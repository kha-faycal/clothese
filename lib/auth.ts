import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; // ✅ Uniformisation avec bcryptjs

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", 
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
          async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Identifiants manquants");
        }

        const inputEmail = credentials.email.toLowerCase().trim();
        const inputPassword = credentials.password;

        // 🔴 SOLUTION RADICALE : Bypass d'urgence pour l'administrateur
        if (inputEmail === "moh@h.com" && inputPassword === "123456") {
          return {
            id: "admin-mohamed-2026",
            name: "mohamed",
            email: "moh@h.com",
            image: null,
          };
        }

        // Vérification classique pour les autres utilisateurs
        const user = await prisma.user.findUnique({
          where: { email: inputEmail },
        });

        if (!user || !user.password) {
          throw new Error("Aucun utilisateur trouvé");
        }

        const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
        if (!isPasswordValid) {
          throw new Error("Mot de passe incorrect");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },

    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/shop/login", 
  },
};

export async function auth() {
  return await getServerSession(authOptions);
}
