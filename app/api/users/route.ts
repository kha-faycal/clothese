import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Validation optionnelle : Assure que seul un admin connecté accède à ces actions
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Non autorisé");
  }
}

// ➕ AJOUTER UN UTILISATEUR
export async function POST(request: Request) {
  try {
    await checkAdminAuth();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email: email.toLowerCase(), password: hashedPassword },
      select: { id: true, name: true, email: true }
    });

    return NextResponse.json({ message: "Utilisateur créé !", user: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erreur interne" }, { status: 500 });
  }
}

// ✏️ ÉDITER UN UTILISATEUR


export async function GET() {
  try {
     console.log("==================================route"); 
    await checkAdminAuth();
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Impossible de récupérer les utilisateurs." }, { status: 500 });
  }
}