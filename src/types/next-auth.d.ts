// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      phone: string;
      isAdmin?: boolean;
    };
  }

  interface User extends DefaultUser {
    name: string;
    phone: string;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name: string;
    phone: string;
    isAdmin?: boolean;
  }
}
