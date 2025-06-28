import { z } from 'zod';

// Enum for contact method
export enum EContactMethod {
  phone = "phone",
  email = "email",
  none = "none"
}

// Output interface ( Contract )
export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  primaryPhone?: string;
  roles: string[];
  preferredContactMethod?: EContactMethod;
}

// Raw schema
const contactMethodEnum = z.nativeEnum(EContactMethod);

// Adhoc schema observed in the pool
const RawUserSchema = z.object({

  // ID fields
  user_id: z.coerce.string().optional(),
  userId: z.coerce.string().optional(),
  id: z.coerce.string().optional(),

  // Name fields
  name: z.object({
    first: z.string(),
    last: z.string()
  }).optional(),
  fullName: z.string().optional(),
  full_name: z.string().optional(),

  // Email fields
  email: z.string().optional(),
  email_address: z.string().optional(),

  // Status fields
  status: z.string().optional(),
  accountStatus: z.string().optional(),
  status_code: z.string().optional(),

  // Date fields
  createdAt: z.string().optional(),
  created_at: z.number().optional(),
  joined_date: z.string().optional(),
  created: z.string().optional(),

  // Phone fields
  phones: z.array(z.string()).optional(),
  contactPhone: z.string().optional(),
  primaryPhone: z.string().optional(),
  contact: z.object({
    phone: z.string().optional(),
    preferred: z.string().optional()
  }).optional(),

  // Role fields
  roles: z.union([z.string(), z.array(z.string())]).optional(),
  role_list: z.array(z.string()).optional(),

  // Preferred contact method fields
  preferred_contact_method: z.string().nullable().optional(),
  preferredContactMethod: z.string().optional(),
  prefContact: z.string().optional()
});

export const NormalizedUserRecord = RawUserSchema.transform((raw): UserRecord => {
  const id =
      raw.id ?? raw.user_id ?? raw.userId ?? "unknown";

  const fullName =
    raw.fullName ??
    raw.full_name ??
    (raw.name ? `${raw.name.first} ${raw.name.last}` : "unknown");

  const email = raw.email ?? raw.email_address ?? "";

  const status = raw.status ?? raw.status_code ?? raw.accountStatus ?? "";
  const isActive = ["A", "active", "OK"].includes(status.toLowerCase());

  const createdAt =
    raw.createdAt
      ? new Date(raw.createdAt).toISOString()
      :
      raw.created_at
        ? new Date(raw.created_at).toISOString()
        : raw.joined_date
          ? new Date(raw.joined_date.split("-").reverse().join("-")).toISOString()
          : raw.created
            ? new Date(raw.created.split("-").reverse().join("-")).toISOString()
            : "";

  const primaryPhone =
    raw.primaryPhone ??
    raw.phones?.[0] ??
    raw.contactPhone ??
    raw.contact?.phone;

  const roles =
    Array.isArray(raw.roles)
      ? raw.roles
      : typeof raw.roles === "string"
        ? raw.roles.split(",").map(r => r.trim())
        : raw.role_list ?? [];

  const rawPref = raw.preferredContactMethod ?? raw.preferred_contact_method ??
    raw.prefContact ??
    raw.contact?.preferred;

  const preferredContactMethod = contactMethodEnum.safeParse(rawPref).success
    ? rawPref as EContactMethod
    : undefined;

  return {
    id,
    fullName,
    email,
    isActive,
    createdAt,
    primaryPhone,
    roles,
    preferredContactMethod
  };
});
