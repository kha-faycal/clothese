import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Vérification de la session admin (retourne la session si elle est valide)
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Non autorisé");
  }
  return session;
}

export async function PUT(request: Request) {
  try {
    await checkAdminAuth();
    const { id, name, email } = await request.json();

    if (!id || !name || !email) {
      return NextResponse.json({ error: "ID, nom et email sont requis." }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email: email.toLowerCase() },
      select: { id: true, name: true, email: true }
    });

    return NextResponse.json({ message: "Utilisateur mis à jour !", user: updatedUser }, { status: 200 });
  } catch (error: any) {
    if (error.message === "Non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: "Impossible de mettre à jour l'utilisateur." }, { status: 500 });
  }
}

// ❌ SUPPRIMER UN UTILISATEUR
export async function DELETE(request: Request) {
  try {
    console.log("you are in the backend ");
    
    // 1. Récupérer la session de l'utilisateur connecté
    const session = await checkAdminAuth();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "L'identifiant (id) est requis." }, { status: 400 });
    }

    // 2. Récupérer l'adresse email de la personne à supprimer
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: { email: true }
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    // 3. Bloquer la suppression si l'email correspond à l'utilisateur connecté
    if (userToDelete.email?.toLowerCase() === session.user.email?.toLowerCase()) {
      return NextResponse.json(
        { error: "Sécurité : Vous ne pouvez pas supprimer votre propre compte lorsqu'il est connecté." }, 
        { status: 400 }
      );
    }

    // 4. Procéder à la suppression si les identifiants sont différents
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Utilisateur supprimé avec succès !" }, { status: 200 });
    
  } catch (error: any) {
    if (error.message === "Non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: "Échec de la suppression de l'utilisateur." }, { status: 500 });
  }
}
