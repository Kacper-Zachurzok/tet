import NextAuth, { type NextAuthOptions } from "next-auth";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "domain",
      name: "domain",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "name@company.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "password",
        },
      },
      authorize: async (credentials) => {
        if (!(credentials?.email && credentials.password))
          throw new Error("Please make sure you insert email and password.");

        const user = await prisma.user.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        if (
          user === null ||
          !bcrypt.compareSync(credentials.password, user.password)
        )
          throw new Error(
            "User does not exists. Please make sure you insert the correct email and password."
          );

        return user;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.sub = user.id;
      return token;
    },
    session: async ({ session, token }) => {
      if (!token.sub) return session;

      const user = await prisma.user.findFirst({
        where: {
          id: token.sub,
        },
        select: {
          email: true,
          name: true,
          permissions: true,
        },
      });
      if (!user) return session;

      session.user = {
        id: token.sub,
        email: user.email,
        name: user.name,
        permissions: user.permissions,
      };

      return session;
    },
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60,
  },
  secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
