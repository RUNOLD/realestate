import { z } from "zod";

export const CreateTicketSchema = z.object({
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.enum(["MAINTENANCE", "COMPLAINT", "INQUIRY", "OTHER", "PLUMBING", "ELECTRICAL", "STRUCTURAL"]),
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
    category: z.enum(["MAINTENANCE", "COMPLAINT", "INQUIRY", "OTHER", "PLUMBING", "ELECTRICAL", "STRUCTURAL"]),
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
    // Basic User Info
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    image: z.any().optional(),

    // Personal Details
    nationality: z.string().optional(),
    maritalStatus: z.string().optional(),
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(), // ISO Date string
    spouseName: z.string().optional(),
    spouseWork: z.string().optional(),
    residentialAddress: z.string().optional(),
    nearestBusStop: z.string().optional(),
    homeTownAddress: z.string().optional(),
    stateOfOrigin: z.string().optional(),
    lga: z.string().optional(),
    occupation: z.string().optional(),
    placeOfWork: z.string().optional(),
    positionHeld: z.string().optional(),
    placeOfWorship: z.string().optional(),
    bankDetails: z.string().optional(),

    nextOfKinName: z.string().optional(),
    nextOfKinPhone: z.string().optional(),

    // Identity
    meansOfIdentification: z.string().optional(),
    idNumber: z.string().optional(),
    idIssueDate: z.string().optional(),
    idExpiryDate: z.string().optional(),

    // Corporate
    companyName: z.string().optional(),
    incorporationDate: z.string().optional(),
    certificateNumber: z.string().optional(),
    businessType: z.string().optional(),
    banker: z.string().optional(),
    corporateEmail: z.string().optional(),
    corporateWebsite: z.string().optional(),
    contactPersonName: z.string().optional(),
    contactPersonPhone: z.string().optional(),
    corporateAddress: z.string().optional(),
    branchOffice: z.string().optional(),

    // Property Requirements
    propertyTypeRequired: z.string().optional(),
    locationRequired: z.string().optional(),
    acceptOtherLocation: z.string().optional(), // "true" / "false" as string from form
    businessDescription: z.string().optional(),
    tenancyNature: z.string().optional(),
    commencementDate: z.string().optional(),
    budgetPerAnnum: z.string().optional(),
    leasePreference: z.string().optional(),
    leaseYears: z.string().optional(),
    serviceChargeAffordability: z.string().optional(),
    cautionDepositAgreement: z.string().optional(),

    // Previous Tenancy
    lastAddress: z.string().optional(),
    lastSize: z.string().optional(),
    lastRentPaid: z.string().optional(),
    periodOfPayment: z.string().optional(),
    expirationDate: z.string().optional(),
    lastLandlordNameAddress: z.string().optional(),
    reasonForLeaving: z.string().optional(),

    // Guarantors (JSON String)
    guarantors: z.string().optional(),
});

export const CreatePaymentSchema = z.object({
    amount: z.number().positive("Amount must be positive"),
    reference: z.string().min(5, "Reference is required"),
    method: z.string().min(2, "Payment method is required"),
    tenantId: z.string().min(1, "Tenant ID is required"),
    category: z.union([z.string(), z.array(z.string())]).optional().default("RENT"),
});

export const UploadDocumentSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    category: z.string().min(1, "Category is required"),
});

export const AddCommentSchema = z.object({
    ticketId: z.string().min(1, "Ticket ID is required"),
    content: z.string().min(1, "Comment cannot be empty"),
});

// Basic Staff/Admin creation
export const CreateStaffSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["STAFF", "ADMIN"]).default("STAFF"),
});

// Comprehensive Landlord Creation
export const CreateLandlordSchema = z.object({
    // Step 1: Account
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),

    // Step 2: Identity & Legal
    landlordType: z.string().optional(),
    idType: z.string().optional(),
    idNumber: z.string().optional(),
    residentialAddress: z.string().optional(),

    // Step 3: Authority
    relationshipToProperty: z.string().optional(),

    // Step 4: Financials & Consent
    bankName: z.string().optional(),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    preferredContactMethod: z.string().optional(),
    isConsentGiven: z.string().optional(), // "true"
});

export const UpdateUserSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    role: z.enum(["USER", "TENANT", "ADMIN", "STAFF", "LANDLORD"]),
    status: z.enum(["ACTIVE", "PENDING", "SUSPENDED", "REJECTED"]), // Fixed enum to match DB

    // Landlord Profile Optional Updates
    bankName: z.string().optional(),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    isConsentGiven: z.string().optional(),
    residentialAddress: z.string().optional(),
    idType: z.string().optional(),
    idNumber: z.string().optional(),
    landlordType: z.string().optional(),
    relationshipToProperty: z.string().optional(),
});

export const CreatePropertySchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().positive("Price must be positive"),
    location: z.string().min(3, "Location is required"),
    type: z.string().min(1, "Type is required"),
    status: z.enum(["AVAILABLE", "RENTED", "SOLD", "MAINTENANCE"]).default("AVAILABLE"),

    // Landlord
    ownerId: z.string().min(1, "Landlord owner is required"),

    // Multi-unit
    isMultiUnit: z.boolean().default(false),
    unitCount: z.number().min(1).optional(), // For creation logic

    // Specs
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    sqft: z.number().optional(),

    // Images handled separately usually or as string array
    images: z.array(z.string()).optional(),
});
