import { z } from "zod";

export const slugSchema = z.string().optional();
export type ProductSlug = z.infer<typeof slugSchema>;

export const titleSchema = z.string().trim().min(1).max(25);
export type ProductTitle = z.infer<typeof titleSchema>;

export const descriptionSchema = z.string().trim().min(1).max(3000);
export type ProductDescription = z.infer<typeof descriptionSchema>;

export const playersSchema = z.number().min(1);
export type ProductPlayers = z.infer<typeof playersSchema>;

export const imageSchema = z.string();
export type ProductImage = z.infer<typeof imageSchema>;

export const productSchema = z.object({
  slug: slugSchema,
  title: titleSchema,
  description: descriptionSchema,
  players: playersSchema,
  image: imageSchema,
});

export const productEditSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
  players: playersSchema.optional(),
  image: imageSchema.optional(),
});

export type Product = z.infer<typeof productSchema>;
