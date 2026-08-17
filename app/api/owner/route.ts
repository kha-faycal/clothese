import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🟢 GET : Récupérer les informations du propriétaire de la boutique
export async function GET() {
  try {
    const ownerData = await prisma.logecilowner.findFirst();

    if (!ownerData) {
      // Données par défaut si la table est vide
      return NextResponse.json({
        name_company: "متجرنا الإلكتروني",
        name_owner: "المدير المسؤول",
        address: "الجزائر",
        telephone: "0555000000",
        mail: "contact@yourdomain.com",
        image: []
      });
    }

    return NextResponse.json(ownerData);
  } catch (error) {
    console.error("Erreur récupération logecilowner:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
