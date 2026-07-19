import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Non autorisé");
  }
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
    return NextResponse.json({ error: "Impossible de mettre à jour l'utilisateur." }, { status: 500 });
  }
}

// ❌ SUPPRIMER UN UTILISATEUR
export async function DELETE(request: Request) {
  try {
    await checkAdminAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "L'identifiant (id) est requis." }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Utilisateur supprimé avec succès !" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Échec de la suppression de l'utilisateur." }, { status: 500 });
  }
}