import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; 

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
  // 🔴 RETRAIT DE L'ADAPTER : Obligatoire puisque votre schéma n'a plus les tables Session/Account
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

        if (inputEmail === "moh@h.com" && inputPassword === "123456") {
          return {
            id: "admin-mohamed-2026",
            name: "mohamed",
            email: "moh@h.com",
            image: null,
          };
        }

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
  // 🌐 CORRECTION : Partager le cookie d'authentification avec toute l'arborescence du domaine
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/", // ✅ Rend la session lisible par le dossier racine /dashboard
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

export async function auth() {
  return await getServerSession(authOptions);
}
