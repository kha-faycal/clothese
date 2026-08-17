import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- FONCTIONS DE MAPPING PARTAGÉES POUR LES ENUMS PRISMA ---
function getMappedGender(gender: string): 'men' | 'women' | 'kids' | 'unisex' {
  const cleanGender = (gender || "").toLowerCase().trim();
  if (cleanGender === 'women' || cleanGender === 'femme') return 'women';
  if (cleanGender === 'kids' || cleanGender === 'enfant') return 'kids';
  if (cleanGender === 'unisex' || cleanGender === 'mixte') return 'unisex';
  return 'men';
}

function getMappedSeason(season: string | null | undefined): 'Summer' | 'Winter' | 'AllSeason' | null {
  if (!season) return null;
  const cleanSeason = season.toLowerCase().trim();
  if (cleanSeason === "été" || cleanSeason === "ete" || cleanSeason === "summer") return "Summer";
  if (cleanSeason === "hiver" || cleanSeason === "winter") return "Winter";
  if (cleanSeason === "toutes" || cleanSeason === "allseason" || cleanSeason === "all") return "AllSeason";
  return null;
}

function getMappedProductType(type: string): 'CLOTHES' | 'PERFUME' | 'COSMETICS' {
  const cleanType = (type || "").toUpperCase().trim();
  if (cleanType === "PERFUME" || cleanType === "PARFUM") return "PERFUME";
  if (cleanType === "COSMETICS" || cleanType === "COSMETIQUE" || cleanType === "مواد التجميل") return "COSMETICS";
  return "CLOTHES";
}

// 🟢 GET : Récupérer tous les produits (uniquement ceux en stock > 0)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        variants: {
          some: {
            stock: {
              gt: 0 // Cache les produits si toutes les variantes sont en rupture (stock = 0)
            }
          }
        }
      },
      include: { variants: true, attributes: true },
      orderBy: { id: "desc" }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur lors du GET des produits:", error);
    return NextResponse.json({ error: "Erreur serveur de récupération" }, { status: 500 });
  }
}

// 🔵 POST : Créer un produit (Vêtement, Parfum ou Cosmétique)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, slug, description, brand, type, gender, season, categoryId, variants, attributes 
    } = body;

    if (!name || !slug || !categoryId || !variants || variants.length === 0) {
      return NextResponse.json(
        { error: "Le nom, le slug, la catégorie et au moins une variante sont obligatoires." },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        Name: name,
        Slug: slug,
        Description: description || "",
        brand: brand || "",
        type: getMappedProductType(type),
        gender: getMappedGender(gender),
        season: getMappedSeason(season),
        categoryId: parseInt(categoryId),
        
        variants: {
          create: variants.map((v: any) => ({
            color: v.color || null, // Optionnel (Peut être nul pour les parfums)
            size: v.size || null,   // Optionnel (Stockera la contenance en ml pour les parfums/cosmétiques)
            sku: v.sku,
            barcode: v.barcode || `${Date.now()}-${Math.random()}`,
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
    console.error("Erreur Prisma Produit POST:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Un produit avec ce Slug, ou un SKU/Code-barre existe déjà." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erreur lors de la création de l'article." }, { status: 500 });
  }
}

// 🟠 PUT : Mettre à jour un produit existant (Vêtement, Parfum ou Cosmétique)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, name, slug, description, brand, type, gender, season, categoryId, variants, attributes 
    } = body;

    if (!id || !name || !slug || !categoryId || !variants || variants.length === 0) {
      return NextResponse.json(
        { error: "Données manquantes pour la modification (id, nom, slug, catégorie, variantes requis)." },
        { status: 400 }
      );
    }

    const productId = parseInt(id);

    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Nettoyage des attributs simples
      await tx.attribute.deleteMany({ where: { productId } });

      // 2. Identification des variantes envoyées à conserver
      const incomingVariantIds = variants
        .map((v: any) => v.id ? parseInt(v.id) : null)
        .filter((vid: number | null) => vid !== null) as number[];

      // 3. Supprime uniquement les variantes retirées du formulaire
      if (incomingVariantIds.length > 0) {
        await tx.variant.deleteMany({
          where: {
            productId: productId,
            id: { notIn: incomingVariantIds }
          }
        });
      }

      // 4. Mise à jour des informations globales du produit
      await tx.product.update({
        where: { id: productId },
        data: {
          Name: name,
          Slug: slug,
          Description: description || "",
          brand: brand || "",
          type: getMappedProductType(type),
          gender: getMappedGender(gender),
          season: getMappedSeason(season),
          categoryId: parseInt(categoryId),
        }
      });

      // 5. Traitement individuel des variantes (Update si id présent, sinon Create)
      for (const v of variants) {
        const variantData = {
          color: v.color || null,
          size: v.size || null,
          sku: v.sku,
          barcode: v.barcode || `${Date.now()}-${Math.random()}`,
          price: parseFloat(v.price || 0),
          stock: parseInt(v.stock || 0),
          weight: parseFloat(v.weight || 0),
          image: Array.isArray(v.image) ? v.image : [],
        };

        if (v.id) {
          await tx.variant.update({
            where: { id: parseInt(v.id) },
            data: variantData
          });
        } else {
          await tx.variant.create({
            data: { ...variantData, productId }
          });
        }
      }

      // 6. Enregistrement des attributs dynamiques mis à jour
      if (attributes && attributes.length > 0) {
        await tx.attribute.createMany({
          data: attributes.map((a: any) => ({
            productId,
            name: a.name,
            value: a.value,
          }))
        });
      }

      return await tx.product.findUnique({
        where: { id: productId },
        include: { variants: true, attributes: true }
      });
    });

    return NextResponse.json(
      { message: "Produit modifié avec succès !", product: updatedProduct },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Erreur Prisma PUT Produit:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Un produit avec ce Slug, SKU ou Code-barre existe déjà." }, { status: 400 });
    }
    if (error.code === "P2003") {
      return NextResponse.json({ error: "Impossible de supprimer une variante liée à une commande historique." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur lors de la modification de l'article." }, { status: 500 });
  }
}

// 🔴 DELETE : Supprimer un produit complet
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "L'identifiant 'id' est requis." }, { status: 400 });
    }

    const productId = parseInt(id);

    await prisma.$transaction([
      prisma.variant.deleteMany({ where: { productId } }),
      prisma.attribute.deleteMany({ where: { productId } }),
      prisma.product.delete({ where: { id: productId } }),
    ]);

    return NextResponse.json({ message: "Produit supprimé avec succès !" }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur Prisma DELETE Produit:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}
