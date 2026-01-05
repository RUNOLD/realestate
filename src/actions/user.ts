'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import bcrypt from 'bcryptjs';
import { CreateTenantSchema, CreateStaffSchema, CreateLandlordSchema, UpdateUserSchema } from "@/lib/schemas";
import { createActivityLog, ActionType, EntityType } from "@/lib/logger";
import { ActionState } from "@/lib/types";
import { sendEmail } from "@/lib/mail";
import { getWelcomeTemplate } from "@/lib/mail_templates";

export async function createTenant(prevState: any, formData: FormData): Promise<ActionState> {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const currentUserRole = (session.user as any).role;
    if (currentUserRole !== 'ADMIN' && currentUserRole !== 'STAFF') {
        return { error: "Unauthorized. Only Admin or Staff can create tenants." };
    }

    // Parse Guarantors JSON manually before sending to Zod
    let guarantorsJson = formData.get("guarantors") as string;
    // ensure it's valid JSON string
    try {
        JSON.parse(guarantorsJson);
    } catch {
        guarantorsJson = "[]";
    }

    // Helper to safely extract string or return undefined if null/empty
    const getString = (key: string) => {
        const value = formData.get(key);
        // Treat null, empty string, or whitespace-only string as undefined
        if (!value || (typeof value === 'string' && value.trim() === '')) return undefined;
        return value as string;
    };

    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
        image: formData.get("image"), // File object

        // Personal
        nationality: getString("nationality"),
        maritalStatus: getString("maritalStatus"),
        gender: getString("gender"),
        dateOfBirth: getString("dateOfBirth"),
        spouseName: getString("spouseName"),
        spouseWork: getString("spouseWork"),
        residentialAddress: getString("residentialAddress"),
        nearestBusStop: getString("nearestBusStop"),
        homeTownAddress: getString("homeTownAddress"),
        stateOfOrigin: getString("stateOfOrigin"),
        lga: getString("lga"),
        occupation: getString("occupation"),
        placeOfWork: getString("placeOfWork"),
        positionHeld: getString("positionHeld"),
        placeOfWorship: getString("placeOfWorship"),
        bankDetails: getString("bankDetails"),

        // Identity
        meansOfIdentification: getString("meansOfIdentification"),
        idNumber: getString("idNumber"),
        idIssueDate: getString("idIssueDate"),
        idExpiryDate: getString("idExpiryDate"),

        // Corporate
        companyName: getString("companyName"),
        incorporationDate: getString("incorporationDate"),
        certificateNumber: getString("certificateNumber"),
        businessType: getString("businessType"),
        banker: getString("banker"),
        corporateEmail: getString("corporateEmail"),
        corporateWebsite: getString("corporateWebsite"),
        contactPersonName: getString("contactPersonName"),
        contactPersonPhone: getString("contactPersonPhone"),
        corporateAddress: getString("corporateAddress"),

        // Property
        propertyTypeRequired: getString("propertyTypeRequired"),
        locationRequired: getString("locationRequired"),
        acceptOtherLocation: getString("acceptOtherLocation"), // Will be "true", "false" or undefined
        businessDescription: getString("businessDescription"),
        tenancyNature: getString("tenancyNature"),
        commencementDate: getString("commencementDate"),
        budgetPerAnnum: getString("budgetPerAnnum"),
        leasePreference: getString("leasePreference"),
        leaseYears: getString("leaseYears"),
        serviceChargeAffordability: getString("serviceChargeAffordability"),
        cautionDepositAgreement: getString("cautionDepositAgreement"),

        // History
        lastAddress: getString("lastAddress"),
        lastSize: getString("lastSize"),
        lastRentPaid: getString("lastRentPaid"),
        periodOfPayment: getString("periodOfPayment"),
        expirationDate: getString("expirationDate"),
        lastLandlordNameAddress: getString("lastLandlordNameAddress"),
        reasonForLeaving: getString("reasonForLeaving"),

        guarantors: guarantorsJson,
    };

    const validatedFields = CreateTenantSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error("Validation Error:", validatedFields.error.flatten().fieldErrors);
        return { error: "Validation failed. Please check all fields.", details: validatedFields.error.flatten().fieldErrors };
    }

    const data = validatedFields.data;
    const imageFile = formData.get("image") as File;

    if (!imageFile || imageFile.size === 0) {
        return { error: "Profile picture is mandatory." };
    }

    try {
        const { generateUniqueId } = await import("@/lib/utils");
        const uniqueId = await generateUniqueId('APMS', 'user');

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { phone: data.phone || undefined }
                ]
            }
        });

        if (existingUser) {
            return { error: "A user with this email or phone already exists." };
        }

        const { uploadToCloudinary } = await import("@/lib/cloudinary");
        const imageUrl = await uploadToCloudinary(imageFile, 'tenant_profiles');

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userRole = (session.user as any).role;
        const status = userRole === 'STAFF' ? 'PENDING' : 'ACTIVE';

        // Transaction to create user and profile together
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    uniqueId,
                    name: data.name,
                    email: data.email,
                    phone: data.phone || null,
                    password: hashedPassword,
                    role: 'TENANT',
                    status,
                    image: imageUrl,
                    isEmployed: !!data.occupation,
                }
            });

            // Create extended profile
            await tx.tenantProfile.create({
                data: {
                    userId: newUser.id,
                    nationality: data.nationality,
                    maritalStatus: data.maritalStatus,
                    gender: data.gender,
                    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                    spouseName: data.spouseName,
                    spouseWork: data.spouseWork,
                    residentialAddress: data.residentialAddress,
                    nearestBusStop: data.nearestBusStop,
                    homeTownAddress: data.homeTownAddress,
                    stateOfOrigin: data.stateOfOrigin,
                    lga: data.lga,
                    occupation: data.occupation,
                    placeOfWork: data.placeOfWork,
                    positionHeld: data.positionHeld,
                    placeOfWorship: data.placeOfWorship,
                    bankDetails: data.bankDetails,

                    meansOfIdentification: data.meansOfIdentification,
                    idNumber: data.idNumber,
                    idIssueDate: data.idIssueDate ? new Date(data.idIssueDate) : null,
                    idExpiryDate: data.idExpiryDate ? new Date(data.idExpiryDate) : null,

                    companyName: data.companyName,
                    incorporationDate: data.incorporationDate ? new Date(data.incorporationDate) : null,
                    certificateNumber: data.certificateNumber,
                    businessType: data.businessType,
                    banker: data.banker,
                    corporateEmail: data.corporateEmail,
                    corporateWebsite: data.corporateWebsite,
                    contactPersonName: data.contactPersonName,
                    contactPersonPhone: data.contactPersonPhone,
                    corporateAddress: data.corporateAddress,

                    propertyTypeRequired: data.propertyTypeRequired,
                    locationRequired: data.locationRequired,
                    // safe check for 'true' string
                    acceptOtherLocation: data.acceptOtherLocation === 'true',
                    businessDescription: data.businessDescription,
                    tenancyNature: data.tenancyNature,
                    commencementDate: data.commencementDate ? new Date(data.commencementDate) : null,
                    budgetPerAnnum: data.budgetPerAnnum,
                    leasePreference: data.leasePreference,
                    leaseYears: data.leaseYears ? parseInt(data.leaseYears) : null,
                    serviceChargeAffordability: data.serviceChargeAffordability === 'true',
                    cautionDepositAgreement: data.cautionDepositAgreement === 'true',

                    lastAddress: data.lastAddress,
                    lastSize: data.lastSize,
                    lastRentPaid: data.lastRentPaid,
                    periodOfPayment: data.periodOfPayment,
                    expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
                    lastLandlordNameAddress: data.lastLandlordNameAddress,
                    reasonForLeaving: data.reasonForLeaving,

                    guarantors: JSON.parse(data.guarantors || "[]"),
                    agreedToTerms: true,
                }
            });

            return newUser;
        });

        await createActivityLog(
            session.user.id,
            ActionType.CREATE,
            EntityType.USER,
            user.id,
            { name: data.name, role: 'TENANT', status }
        );

        revalidatePath("/admin/users");
        return { success: true, message: status === 'PENDING' ? "Tenant created and pending approval." : "Tenant created successfully." };
    } catch (e: any) {
        console.error("Create Tenant Error:", e);
        return { error: e.message || "Failed to create tenant. Please try again." };
    }
}


export async function createLandlord(prevState: any, formData: FormData): Promise<ActionState> {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
        return { error: "Unauthorized. Only admins can create landlords." };
    }

    const getString = (key: string) => {
        const value = formData.get(key);
        if (!value || (typeof value === 'string' && value.trim() === '')) return undefined;
        return value as string;
    };

    const rawData = {
        name: getString("name"),
        email: getString("email"),
        phone: getString("phone"),
        password: getString("password"),

        landlordType: getString("landlordType"),
        idType: getString("idType"),
        idNumber: getString("idNumber"),
        residentialAddress: getString("residentialAddress"),

        relationshipToProperty: getString("relationshipToProperty"),

        bankName: getString("bankName"),
        accountName: getString("accountName"),
        accountNumber: getString("accountNumber"),
        preferredContactMethod: getString("preferredContactMethod"),
        isConsentGiven: getString("isConsentGiven"),
    };

    const validatedFields = CreateLandlordSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Validation failed.", details: validatedFields.error.flatten().fieldErrors };
    }

    const data = validatedFields.data;

    // Redundant safety check to ensure critical fields are present
    if (!data.name || !data.email || !data.password) {
        return { error: "Validation failed: Critical fields missing." };
    }

    try {
        const { generateUniqueId } = await import("@/lib/utils");
        const uniqueId = await generateUniqueId('APMS', 'user');

        const existingUser = await prisma.user.findFirst({
            where: { email: data.email }
        });

        if (existingUser) {
            return { error: "A user with this email already exists." };
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Transaction
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    uniqueId,
                    name: data.name,
                    email: data.email,
                    phone: data.phone || null,
                    password: hashedPassword,
                    role: 'LANDLORD',
                    status: 'ACTIVE',
                }
            });

            await tx.landlordProfile.create({
                data: {
                    userId: newUser.id,
                    landlordType: data.landlordType,
                    idType: data.idType,
                    idNumber: data.idNumber,
                    residentialAddress: data.residentialAddress,
                    relationshipToProperty: data.relationshipToProperty,
                    bankName: data.bankName,
                    accountName: data.accountName,
                    accountNumber: data.accountNumber,
                    preferredContactMethod: data.preferredContactMethod,
                    isConsentGiven: data.isConsentGiven === 'true',
                    consentDate: new Date(),
                }
            });

            return newUser;
        });

        await createActivityLog(
            session.user.id,
            ActionType.CREATE,
            EntityType.USER,
            user.id,
            { name: data.name, role: 'LANDLORD', status: 'ACTIVE' }
        );

        revalidatePath("/admin/users");
        return { success: true, message: `Landlord ${data.name} created successfully.` };

    } catch (e: any) {
        console.error("Create Landlord Error:", e);
        return { error: "Failed to create landlord." };
    }
}

export async function createStaff(prevState: any, formData: FormData): Promise<ActionState> {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
        return { error: "Unauthorized. Only admins can create staff." };
    }

    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
        role: formData.get("role"),
    };

    const validatedFields = CreateStaffSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Validation failed", details: validatedFields.error.flatten().fieldErrors };
    }

    const { name, email, phone, password, role } = validatedFields.data;

    try {
        const { generateUniqueId } = await import("@/lib/utils");
        // Staff/Admin: APM + 4 digits
        const prefix = 'APM';
        const uniqueId = await generateUniqueId(prefix, 'user');

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "A user with this email already exists." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                uniqueId,
                name,
                email,
                phone: phone || null,
                password: hashedPassword,
                role: role as any,
                status: 'ACTIVE',
            }
        });

        // Send Welcome Email
        await sendEmail({
            to: email,
            subject: "Welcome to Team Ayoola",
            html: getWelcomeTemplate(name, password)
        });

        await createActivityLog(
            session.user.id,
            ActionType.CREATE,
            EntityType.USER,
            user.id,
            { name, role, status: 'ACTIVE' }
        );

        revalidatePath("/admin/team");
        return { success: true, message: `Staff member ${name} created successfully as ${role}.` };
    } catch (e) {
        console.error("Create Staff Error:", e);
        return { error: "Failed to create staff member. Please try again." };
    }
}

export async function approveUser(userId: string): Promise<ActionState> {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'ACTIVE' }
        });

        await createActivityLog(
            session.user.id,
            ActionType.APPROVE,
            EntityType.USER,
            userId,
            { details: "Tenant Approved" }
        );

        revalidatePath("/admin/users");
        revalidatePath("/admin/approvals");
        return { success: true, message: "User approved successfully." };
    } catch (e) {
        console.error("Approve User Error:", e);
        return { error: "Failed to approve user" };
    }
}

export async function updateUser(prevState: any, formData: FormData): Promise<ActionState> {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
        return { error: "Unauthorized. Only admins can edit users." };
    }

    const getString = (k: string) => {
        const v = formData.get(k);
        return (!v || (typeof v === 'string' && v.trim() === '')) ? undefined : v as string;
    };

    const rawData = {
        id: formData.get("id"),
        name: formData.get("name"),
        email: formData.get("email"),
        phone: getString("phone"),
        role: formData.get("role"),
        status: formData.get("status"),

        // Landlord Extras
        bankName: getString("bankName"),
        accountName: getString("accountName"),
        accountNumber: getString("accountNumber"),
        isConsentGiven: getString("isConsentGiven"), // "true" or undefined
        residentialAddress: getString("residentialAddress"),
        idType: getString("idType"),
        idNumber: getString("idNumber"),
        landlordType: getString("landlordType"),
        relationshipToProperty: getString("relationshipToProperty"),
    };

    const validatedFields = UpdateUserSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Validation failed", details: validatedFields.error.flatten().fieldErrors };
    }

    const data = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: data.id }
        });

        if (!existingUser) {
            return { error: "User not found." };
        }

        // Check for email conflicts
        if (data.email !== existingUser.email) {
            const emailConflict = await prisma.user.findUnique({ where: { email: data.email } });
            if (emailConflict) return { error: "A user with this email already exists." };
        }

        await prisma.$transaction(async (tx) => {
            // 1. Update Base User
            await tx.user.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone || null,
                    role: data.role as any,
                    status: data.status as any,
                }
            });

            // 2. If Landlord, Upsert Profile
            if (data.role === 'LANDLORD') {
                await tx.landlordProfile.upsert({
                    where: { userId: data.id },
                    create: {
                        userId: data.id,
                        bankName: data.bankName,
                        accountName: data.accountName,
                        accountNumber: data.accountNumber,
                        isConsentGiven: data.isConsentGiven === 'true',
                        consentDate: data.isConsentGiven === 'true' ? new Date() : null,
                        residentialAddress: data.residentialAddress,
                        idType: data.idType,
                        idNumber: data.idNumber,
                        landlordType: data.landlordType,
                        relationshipToProperty: data.relationshipToProperty,
                    },
                    update: {
                        bankName: data.bankName,
                        accountName: data.accountName,
                        accountNumber: data.accountNumber,
                        isConsentGiven: data.isConsentGiven === 'true',
                        consentDate: data.isConsentGiven === 'true' ? new Date() : undefined,
                        residentialAddress: data.residentialAddress,
                        idType: data.idType,
                        idNumber: data.idNumber,
                        landlordType: data.landlordType,
                        relationshipToProperty: data.relationshipToProperty,
                    }
                });
            }
        });

        await createActivityLog(
            session.user.id,
            ActionType.UPDATE,
            EntityType.USER,
            data.id,
            { name: data.name, role: data.role, status: data.status }
        );

        revalidatePath("/admin/users");
        revalidatePath(`/admin/users/${data.id}`);
        revalidatePath("/admin/team");

        return { success: true, message: `User ${data.name} updated successfully.` };
    } catch (e) {
        console.error("Update User Error:", e);
        return { error: "Failed to update user. Please try again." };
    }
}

export async function updateSelfPassword(prevState: any, formData: FormData): Promise<ActionState> {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || password.length < 6) {
        return { error: "Password must be at least 6 characters" };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        });

        await createActivityLog(
            session.user.id,
            ActionType.UPDATE,
            EntityType.USER,
            session.user.id,
            { details: "Password changed by user" }
        );

        revalidatePath("/landlord/settings");
        return { success: true, message: "Password updated successfully." };
    } catch (e) {
        console.error("Update Password Error:", e);
        return { error: "Failed to update password." };
    }
}
