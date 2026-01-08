import z from "zod";
import { IsActive, Role } from "./user.interface";
import is from "zod/v4/locales/is.cjs";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .max(50, { message: "Name is too long" })
    .min(2, { message: "Name is too short" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[@$!%*?&#]/.test(val), {
      message: "Password must contain at least one special character",
    }),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, {
      message: "Invalid phone number",
    })
    .optional(),
  address: z.string().max(100).optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string()
    .max(50, { message: "Name is too long" })
    .min(2, { message: "Name is too short" })
    .optional(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[@$!%*?&#]/.test(val), {
      message: "Password must contain at least one special character",
    })
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, {
      message: "Invalid phone number",
    })
    .optional(),
  address: z.string().max(100).optional(),
  role: z.enum(Object.values(Role)).optional(),
  isActive: z.enum(Object.values(IsActive)).optional(),

  isDeleted: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});
