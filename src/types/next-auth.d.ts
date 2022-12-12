import type { User } from "../utils/schemas/user";

declare module "next-auth" {
  interface Session {
    user?: User;
  }
}
