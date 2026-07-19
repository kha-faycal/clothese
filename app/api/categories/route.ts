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

// ➕ AJOUTER UNE CATÉGORIE
export async function POST(request: Request) {
  try {
    await checkAdminAuth();
    const { name, slug, description, image, parentId } = await request.json();
    
    console.log("Données reçues en route :", name, slug, description, image, parentId);

    if (!name || !description) {
      return NextResponse.json(
        { error: "Le nom et la description sont requis." },
        { status: 400 },
      );
    }

    // Wrap the string image URL inside an array if it's sent as a plain string
    const imageArray = typeof image === "string" ? [image] : (image || []);

    const newCategory = await prisma.category.create({
      data: {
        Name: name,
        Slug: (slug || name || "").toLowerCase().trim().replace(/\s+/g, "-"),
        Description: description,
        image: imageArray, 
        ParentId: parentId ? parseInt(parentId) : null,
      },
    });

    return NextResponse.json(
      { message: "Catégorie créée !", category: newCategory },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Erreur Prisma POST :", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ce nom ou ce slug de catégorie existe déjà." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la création de la catégorie." },
      { status: 500 },
    );
  }
}

// ✏️ ÉDITER UNE CATÉGORIE
export async function PUT(request: Request) {
  try {
    await checkAdminAuth();
    const { id, name, slug, description, image, parentId } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "L'ID de la catégorie est requis." },
        { status: 400 },
      );
    }

    const imageArray = typeof image === "string" ? [image] : image;

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { Name: name }),
        ...(slug && { Slug: slug.toLowerCase().replace(/\s+/g, "-") }),
        ...(description && { Description: description }),
        ...(imageArray && { image: imageArray }),
        ...(parentId !== undefined && {
          ParentId: parentId ? parseInt(parentId) : null,
        }),
      },
    });

    return NextResponse.json(
      { message: "Catégorie mise à jour !", category: updatedCategory },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Erreur Prisma PUT :", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la catégorie." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await checkAdminAuth();     
    const categories = await prisma.category.findMany({
      include: {
        parent: true, 
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories." },
      { status: 500 },
    );
  }   
}
