import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Fonction interne pour vérifier si l'utilisateur connecté modifie bien son propre profil
async function validateUserAccess(targetId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Non autorisé");
  }

  // Récupérer l'utilisateur en base de données par son email de session
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email || "" },
    select: { id: true }
  });

  // Sécurité stricte : empêche la modification d'un compte tiers
  if (!currentUser || currentUser.id !== targetId) {
    throw new Error("Interdit");
  }

  return currentUser.id;
}

// 🟢 GET : Récupérer le profil d'un utilisateur spécifique
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ Correction du typage asynchrone Next.js 15/16
) {
  try {
    // ✅ Résolution asynchrone obligatoire de params
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Erreur GET maps:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🟠 PUT : Mettre à jour le profil (Nom, Email, Mot de passe)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ Correction du typage asynchrone
) {
  try {
    // ✅ Élimination du crash Next.js en résolvant la promesse params
    const { id } = await params;
    
    // Validation d'identité croisée
    await validateUserAccess(id);

    const body = await request.json();
    const { name, email, currentPassword, newPassword, image } = body;

    if (!email) {
      return NextResponse.json({ error: "L'email est obligatoire." }, { status: 400 });
    }

    const updateData: any = {
      name: name || null,
      email: email.toLowerCase().trim(),
      image: image || null
    };

    // Gestion du changement de mot de passe sécurisé
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Le mot de passe actuel est requis." }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({
        where: { id },
        select: { password: true }
      });

      if (!existingUser || !existingUser.password) {
        return NextResponse.json({ error: "Impossible de valider le compte." }, { status: 400 });
      }

      const isCurrentValid = await bcrypt.compare(currentPassword, existingUser.password);
      if (!isCurrentValid) {
        return NextResponse.json({ error: "Le mot de passe actuel est incorrect." }, { status: 400 });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    });

    return NextResponse.json({ message: "Profil mis à jour !", user: updatedUser }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur PUT Profil:", error);
    if (error.message === "Non autorisé") {
      return NextResponse.json({ error: "Veuillez vous connecter." }, { status: 401 });
    }
    if (error.message === "Interdit") {
      return NextResponse.json({ error: "Vous n'avez pas l'autorisation de modifier ce compte." }, { status: 403 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Cette adresse email est déjà prise." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur lors de la modification." }, { status: 500 });
  }
}
