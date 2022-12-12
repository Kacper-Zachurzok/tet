import { z } from "zod";

const permissionSchema = z.number().int().positive();
export type Permission = z.infer<typeof permissionSchema>;

export default permissionSchema;
