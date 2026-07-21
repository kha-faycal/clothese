import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; // Optionnel: pnpm add bcryptjs && pnpm add -D @types/bcryptjs

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, image, isVerified } = body;

    // Validation stricte
    if (!email) {
      return NextResponse.json(
        { error: "L'adresse email est obligatoire." },
        { status: 400 }
      );
    }

    // Gestion du mot de passe optionnel lié au Credentials Login
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

    // Masquer le mot de passe dans la réponse JSON client
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "Utilisateur créé avec succès !", user: userWithoutPassword },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Erreur Prisma Utilisateur:", error);
    // Code Prisma P2002 = Contrainte unique violée (email existant)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Un utilisateur avec cette adresse email existe déjà." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        // Exclure volontairement le champ password pour des raisons de sécurité évidentes
      }
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Erreur GET Prisma Utilisateurs:", error);
    return NextResponse.json({ error: "Impossible de récupérer les utilisateurs." }, { status: 500 });
  }
}
