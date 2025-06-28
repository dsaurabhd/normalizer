import { z } from 'zod';
import { UserRecord } from "./userSchema.js";

export enum EContactMethod {
    phone = "phone",
    email = "email",
    none = "none"
}

const EContactMethodSchema = z.nativeEnum(EContactMethod);

// UserRecord schema for the standardized format
export const UserRecordSchema = z.object({
    id: z.string().refine((val) => val !== "unknown", {
        message: 'id must not be unknown',
    }),
    fullName: z.string().refine((val) => val !== "unknown", {
        message: 'name cannot be unknown',
    }),
    email: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(), // You can replace with z.coerce.date() if it's a Date object
    primaryPhone: z.string().optional(),
    roles: z.array(z.string()),
    preferredContactMethod: EContactMethodSchema.optional()
});

// Validates for the above schema
export const legacyRecordValidation = (legacyRecord: UserRecord) => {

    return UserRecordSchema.safeParse(legacyRecord);
}