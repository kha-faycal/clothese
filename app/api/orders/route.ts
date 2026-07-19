import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, phone, wilaya, commune, items } = body;

    if (!customerName || !phone || !wilaya || !commune || !items || items.length === 0) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    // Calcul et vérification sécurisée via transaction Prisma
    const order = await prisma.$transaction(async (tx) => {
      let calculatedTotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        // 1. Récupérer la variante directement depuis la DB pour éviter les fraudes de prix du client
        const dbVariant = await tx.variant.findUnique({
          where: { id: item.variantId },
        });

        if (!dbVariant) {
          throw new Error(`La variante ID ${item.variantId} n'existe pas.`);
        }

        if (dbVariant.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour le produit en taille/couleur sélectionnée.`);
        }

        // 2. Déduire le stock de la variante
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: dbVariant.stock - item.quantity },
        });

        calculatedTotal += dbVariant.price * item.quantity;
        
        orderItemsData.push({
          variantId: item.variantId,
          quantity: item.quantity,
          price: dbVariant.price,
        });
      }

      // 3. Créer la commande principale
      return await tx.order.create({
        data: {
          customerName,
          phone,
          wilaya,
          commune,
          totalPrice: calculatedTotal,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: true,
        },
      });
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erreur interne serveur" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            variant: {
              include: {
                product: true // Permet de récupérer le nom global du produit
              }
            }
          }
        }
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Impossible de charger les commandes" }, { status: 500 });
  }
}

// Modifier le statut d'une commande
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status }
    });

    return NextResponse.json({ success: true, updatedOrder });
  } catch (error) {
    return NextResponse.json({ error: "Échec de la mise à jour" }, { status: 500 });
  }
}
