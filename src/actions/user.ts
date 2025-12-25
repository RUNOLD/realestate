'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import bcrypt from 'bcryptjs';
import { CreateTenantSchema, CreateStaffSchema } from "@/lib/schemas";
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
    } catch (e) {
        console.error("Create Tenant Error:", e);
        return { error: "Failed to create tenant. Please try again." };
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
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "A user with this email already exists." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
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
