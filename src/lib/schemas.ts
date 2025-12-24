import { z } from "zod";

export const CreateTicketSchema = z.object({
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.enum(["MAINTENANCE", "COMPLAINT", "INQUIRY", "OTHER"]),
});

export const ContactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export const CreateAdminTicketSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.enum(["MAINTENANCE", "COMPLAINT", "INQUIRY", "OTHER"]),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "EMERGENCY"]),
    images: z.string().optional().default("[]"), // JSON string
});

export const CreateLeaseSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    propertyId: z.string().min(1, "Property ID is required"),
    rentAmount: z.number().positive("Rent amount must be positive"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
});

export const UpdateRentSchema = z.object({
    leaseId: z.string().min(1, "Lease ID is required"),
    newAmount: z.number().positive("New rent amount must be positive"),
    reason: z.string().min(5, "Reason is required"),
});

export const CreateTenantSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    nextOfKinName: z.string().optional(),
    nextOfKinPhone: z.string().optional(),
    employerName: z.string().optional(),
    jobTitle: z.string().optional(),
});

export const CreatePaymentSchema = z.object({
    amount: z.number().positive("Amount must be positive"),
    reference: z.string().min(5, "Reference is required"),
    method: z.string().min(2, "Payment method is required"),
    tenantId: z.string().min(1, "Tenant ID is required"),
});

export const UploadDocumentSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    category: z.string().min(1, "Category is required"),
});

export const AddCommentSchema = z.object({
    ticketId: z.string().min(1, "Ticket ID is required"),
    content: z.string().min(1, "Comment cannot be empty"),
});

export const CreateStaffSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["STAFF", "ADMIN"]).default("STAFF"),
});
