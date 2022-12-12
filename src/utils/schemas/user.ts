import { z } from "zod";
import permissionSchema, { type Permission } from "./permission";

export const idSchema = z.string();

export const emailSchema = z.string().email();

export const nameSchema = z.string().trim().min(4).max(25);

export const passwordSchema = z.string().min(12).max(127);

export const userLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type UserLogin = z.infer<typeof userLoginSchema>;

export const userRegisterSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
});
export type UserRegister = z.infer<typeof userRegisterSchema>;

export const userSchema = z.object({
  id: idSchema,
  email: emailSchema,
  name: nameSchema,
  permissions: permissionSchema,
});
export type User = z.infer<typeof userSchema> & { permissions: Permission };
