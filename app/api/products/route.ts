import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, slug, description, brand, gender, season, categoryId, variants, attributes 
    } = body;

    if (!name || !slug || !categoryId || !variants || variants.length === 0) {
      return NextResponse.json(
        { error: "Le nom, le slug, la catégorie et au moins une variante sont obligatoires." },
        { status: 400 }
      );
    }

    // 👈 1. STRICT PRISMA GENDER ENUM VALIDATION MAPPING
    let mappedGender: 'men' | 'women' | 'kids' = 'men';
    if (gender === 'women' || gender === 'women') mappedGender = 'women';
    if (gender === 'kids' || gender === 'kids') mappedGender = 'kids';

    // 👈 2. STRICT PRISMA SEASON ENUM VALIDATION MAPPING
    let mappedSeason: 'Summer' | 'Winter' | 'AllSeason' | null = null;
    const cleanSeason = (season || "").toLowerCase().trim();
    
    if (cleanSeason === "été" || cleanSeason === "ete" || cleanSeason === "summer") {
      mappedSeason = "Summer";
    } else if (cleanSeason === "hiver" || cleanSeason === "winter") {
      mappedSeason = "Winter";
    } else if (cleanSeason === "toutes" || cleanSeason === "allseason" || cleanSeason === "all") {
      mappedSeason = "AllSeason";
    }

    const newProduct = await prisma.product.create({
      data: {
        Name: name,
        Slug: slug,
        Description: description || "",
        brand: brand || "",
        gender: mappedGender, // Uses mapped enum safely
        season: mappedSeason, // Uses mapped enum safely without breaking constraints
        categoryId: parseInt(categoryId),
        
        variants: {
          create: variants.map((v: any) => ({
            color: v.color,
            size: v.size,
            sku: v.sku,
            barcode: v.barcode || `${Date.now()}-${Math.random()}`, // Fallback if barcode string parameter is empty
            price: parseFloat(v.price || 0),
            stock: parseInt(v.stock || 0),
            weight: parseFloat(v.weight || 0),
            image: Array.isArray(v.image) ? v.image : [], 
          })),
        },

        attributes: {
          create: attributes?.map((a: any) => ({
            name: a.name,
            value: a.value,
          })) || [],
        },
      },
      include: {
        variants: true,
        attributes: true,
      },
    });

    return NextResponse.json(
      { message: "Produit créé avec succès !", product: newProduct },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Erreur Prisma Produit:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Un produit avec ce Slug, ou un SKU/Code-barre existe déjà." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erreur lors de la création de l'article." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { variants: true, attributes: true },
      orderBy: { id: "desc" }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur de récupération" }, { status: 500 });
  }
}
