import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.JWT_SECRET,

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "string", placeholder: "jsmith" },
        phone: { label: "phone", type: "number", placeholder: "40028922" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null;
        const { phone, password, name } = credentials;

        const existingUser = await db.user.findFirst({
          where: {
            phone: { equals: phone },
          },
        });
        if (!existingUser) {
          if (!name) return null;
          const newUser = await db.user.create({ data: { phone, name } });
          return { id: newUser.id, name: newUser.name, phone: newUser.phone };
        }
        if (existingUser.password) {
          const checkPass = await compare(password, existingUser.password);
          if (!checkPass) return null;
        }

        return {
          id: existingUser.id,
          name: existingUser.name,
          phone: existingUser.phone,
          isAdmin: !!existingUser.isAdmin,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (user) {
        token.name = user.name;
        token.phone = user.phone;
        token.isAdmin = user.isAdmin;
      }
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.phone = session.phone || token.phone;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        name: token.name as string,
        phone: token.phone as string,
        isAdmin: token.isAdmin!!,
      };
      return session;
    },
    redirect({ baseUrl, url }) {
      if (url.startsWith("http")) return url;
      return `${baseUrl}${url}`;
    },
  },
};
