import { z } from "zod";
import { permissionsSchema } from "../permissions";

export const emailSchema = z.string().email();

export const nameSchema = z.string().trim().min(4).max(25);

export const passwordSchema = z.string().min(12).max(127);

export const userLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const userRegisterSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
});

export const userSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
  permissions: permissionsSchema,
});
