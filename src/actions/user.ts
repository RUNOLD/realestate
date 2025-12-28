'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import bcrypt from 'bcryptjs';
import { CreateTenantSchema, CreateStaffSchema, UpdateUserSchema } from "@/lib/schemas";
import { createActivityLog, ActionType, EntityType } from "@/lib/logger";

export async function createTenant(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
        nextOfKinName: formData.get("nextOfKinName"),
        nextOfKinPhone: formData.get("nextOfKinPhone"),
        employerName: formData.get("employerName"),
        jobTitle: formData.get("jobTitle"),
    };

    const validatedFields = CreateTenantSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, message: "Validation failed" };
    }

    const { name, email, phone, password, nextOfKinName, nextOfKinPhone, employerName, jobTitle } = validatedFields.data;
    const imageFile = formData.get("image") as File;

    if (!imageFile || imageFile.size === 0) {
        return { error: "Profile picture is mandatory for account creation." };
    }

    try {
        const { generateUniqueId } = await import("@/lib/utils");
        const uniqueId = await generateUniqueId('APMS', 'user');

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone || undefined }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === email) return { error: "A user with this email already exists." };
            if (phone && existingUser.phone === phone) return { error: "A user with this phone number already exists." };
        }

        const { uploadToCloudinary } = await import("@/lib/cloudinary");
        const imageUrl = await uploadToCloudinary(imageFile, 'tenant_profiles');

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = (session.user as any).role;
        const status = userRole === 'STAFF' ? 'PENDING' : 'ACTIVE';

        const user = await prisma.user.create({
            data: {
                uniqueId,
                name,
                email,
                phone: phone || null,
                password: hashedPassword,
                role: 'TENANT',
                status,
                image: imageUrl,
                nextOfKinName: nextOfKinName || null,
                nextOfKinPhone: nextOfKinPhone || null,
                employerName: employerName || null,
                jobTitle: jobTitle || null,
                isEmployed: !!employerName,
            }
        });

        await createActivityLog(
            session.user.id,
            ActionType.CREATE,
            EntityType.USER,
            user.id,
            { name, role: 'TENANT', status }
        );

        revalidatePath("/admin/users");
        return { success: true, message: status === 'PENDING' ? "Tenant created and pending approval." : "Tenant created successfully." };
    } catch (e: any) {
        console.error("Create Tenant Error:", e);
        return { error: e.message || "Failed to create tenant. Please try again." };
    }
}

export async function createStaff(prevState: any, formData: FormData) {
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
        return { error: validatedFields.error.flatten().fieldErrors, message: "Validation failed" };
    }

    const { name, email, phone, password, role } = validatedFields.data;

    try {
        const { generateUniqueId } = await import("@/lib/utils");
        // Landlords: APMS + 4 digits
        // Staff/Admin: APM + 4 digits
        const prefix = role === 'LANDLORD' ? 'APMS' : 'APM';
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

export async function approveUser(userId: string) {
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
        return { success: true };
    } catch (e) {
        console.error("Approve User Error:", e);
        return { error: "Failed to approve user" };
    }
}

export async function updateUser(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'ADMIN') {
        return { error: "Unauthorized. Only admins can edit users." };
    }

    const rawData = {
        id: formData.get("id"),
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        role: formData.get("role"),
        status: formData.get("status"),
    };

    const validatedFields = UpdateUserSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, message: "Validation failed" };
    }

    const { id, name, email, phone, role, status } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return { error: "User not found." };
        }

        // Check for email conflicts
        if (email !== existingUser.email) {
            const emailConflict = await prisma.user.findUnique({ where: { email } });
            if (emailConflict) return { error: "A user with this email already exists." };
        }

        await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                phone: phone || null,
                role: role as any,
                status: status as any,
            }
        });

        await createActivityLog(
            session.user.id,
            ActionType.UPDATE,
            EntityType.USER,
            id,
            { name, role, status }
        );

        revalidatePath("/admin/users");
        revalidatePath(`/admin/users/${id}`);
        revalidatePath("/admin/team");

        return { success: true, message: `User ${name} updated successfully.` };
    } catch (e) {
        console.error("Update User Error:", e);
        return { error: "Failed to update user. Please try again." };
    }
}

export async function updateSelfPassword(prevState: any, formData: FormData) {
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
