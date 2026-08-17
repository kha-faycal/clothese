import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    if (reviews.length === 0) {
      // Avis de démonstration réalistes pour le e-commerce algérien
      return NextResponse.json([
        {
          id: 1,
          customerName: "أمين. ب",
          wilaya: "البليدة",
          comment: "العطر لي شريتو ريحتو بزاف شابة وتطول، والتوصيل كان سريع حتال باب الدار. شكراً ليكم.",
          rating: 5,
        },
        {
          id: 2,
          customerName: "سارة. م",
          wilaya: "الجزائر العاصمة",
          comment: "الملابس قماشها روعة والمقاسات جاو سوا سوا كيما في السيت. هادي ماشي آخر مرة نشري من عندكم.",
          rating: 5,
        },
        {
          id: 3,
          customerName: "ياسمين. ت",
          wilaya: "وهران",
          comment: "منتجات التجميل أصلية جربتها والنتيجة هايلة. فحصت الكولي قبل ما نخلص والموزع كان قمة في الأدب.",
          rating: 5,
        },
      ]);
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Erreur récupération reviews:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
