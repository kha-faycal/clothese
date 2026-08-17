import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth"; // ✅ Correction de l'import pour cibler votre fichier racine central
import bcrypt from "bcryptjs";

// Fonction utilitaire interne pour sécuriser l'accès aux routes d'administration
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Non autorisé");
  }
  return session;
}

// 🟢 GET : Récupérer tous les utilisateurs
export async function GET() {
  try {
    await checkAdminAuth(); // Optionnel : Bloque la lecture si non connecté
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
      }
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    if (error.message === "Non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: "Impossible de récupérer les utilisateurs." }, { status: 500 });
  }
}

// 🔵 POST : Créer un nouvel utilisateur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, image, isVerified } = body;

    if (!email) {
      return NextResponse.json({ error: "L'adresse email est obligatoire." }, { status: 400 });
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = await prisma.user.create({
      data: {
        name: name || null,
        email: email.toLowerCase().trim(),
        image: image || null,
        password: hashedPassword,
        emailVerified: isVerified ? new Date() : null,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "Utilisateur créé avec succès !", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur Prisma Utilisateur POST:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Un utilisateur avec cette adresse email existe déjà." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur." }, { status: 500 });
  }
}

// 🟠 PUT : Mettre à jour un utilisateur existant
export async function PUT(request: Request) {
  try {
    await checkAdminAuth();
    const { id, name, email } = await request.json();

    if (!id || !name || !email) {
      return NextResponse.json({ error: "ID, nom et email sont requis." }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { 
        name, 
        email: email.toLowerCase().trim() 
      },
      select: { id: true, name: true, email: true }
    });

    return NextResponse.json({ message: "Utilisateur mis à jour !", user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur Prisma Utilisateur PUT:", error);
    if (error.message === "Non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: "Impossible de mettre à jour l'utilisateur." }, { status: 500 });
  }
}

// 🔴 DELETE : Supprimer un utilisateur
export async function DELETE(request: Request) {
  try {
    const session = await checkAdminAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "L'identifiant (id) est requis." }, { status: 400 });
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { email: true }
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    // Sécurité critique : Empêche un administrateur connecté de s'auto-supprimer
    if (userToDelete.email?.toLowerCase() === session.user.email?.toLowerCase()) {
      return NextResponse.json(
        { error: "Sécurité : Vous ne pouvez pas supprimer votre propre compte lorsqu'il est connecté." }, 
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Utilisateur supprimé avec succès !" }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: "Échec de la suppression de l'utilisateur." }, { status: 500 });
  }
}
