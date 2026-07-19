import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } // 👈 1. Update the type definition to expect a Promise
) {
  try {
    // 👈 2. Add 'await' before extracting properties from params
    const { slug } = await params;

    // 3. Prisma will now securely receive the string value instead of 'undefined'
    const product = await prisma.product.findUnique({
      where: { Slug: slug },
      include: {
        variants: true,
        attributes: true,
        category: true, 
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Prisma Unique Product Fetch Error:", error);
    return NextResponse.json({ error: "Erreur serveur : " + error.message }, { status: 500 });
  }
}
