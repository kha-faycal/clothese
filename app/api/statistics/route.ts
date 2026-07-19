import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    // 1. Récupérer toutes les commandes terminées et leurs articles en une seule requête globale
    const allOrders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            variant: {
              include: {
                product: true // Inclusions totalement supportées ici
              }
            }
          }
        },
      },
    });

    const totalOrdersCount = allOrders.length;

    let totalRevenue = 0; 
    let pendingRevenue = 0; 
    let confirmedCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    let totalItemsSold = 0;

    // Dictionnaire temporaire pour calculer manuellement le Top 5 des ventes sans faire planter le serveur
    const variantSalesMap: Record<number, { 
      name: string; 
      color: string; 
      size: string; 
      image: string; 
      quantity: number; 
    }> = {};

    allOrders.forEach((order) => {
      // Comptage des revenus et volumes selon le statut
      if (order.status === "DELIVERED") {
        totalRevenue += order.totalPrice;
        
        order.orderItems.forEach((item) => {
          totalItemsSold += item.quantity;

          // Agrégation sécurisée du produit
          if (item.variantId) {
            if (!variantSalesMap[item.variantId]) {
              variantSalesMap[item.variantId] = {
                name: item.variant?.product?.Name || "produit_inconnu",
                color: item.variant?.color || "-",
                size: item.variant?.size || "-",
                image: item.variant?.image?.[0] || "", // Prend la première image disponible
                quantity: 0
              };
            }
            variantSalesMap[item.variantId].quantity += item.quantity;
          }
        });
      } else if (order.status !== "CANCELLED") {
        pendingRevenue += order.totalPrice;
      }

      // Calcul des totaux pour les taux de conversion
      if (order.status === "CONFIRMED" || order.status === "SHIPPED" || order.status === "DELIVERED") {
        confirmedCount++;
      }
      if (order.status === "DELIVERED") deliveredCount++;
      if (order.status === "CANCELLED") cancelledCount++;
    });

    // Calcul des pourcentages
    const confirmationRate = totalOrdersCount > 0 
      ? Math.round((confirmedCount / totalOrdersCount) * 100) 
      : 0;

    const cancellationRate = totalOrdersCount > 0 
      ? Math.round((cancelledCount / totalOrdersCount) * 100) 
      : 0;

    // Trier le dictionnaire pour obtenir le Top 5 des produits les plus vendus
    const topProducts = Object.values(variantSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return NextResponse.json({
      summary: {
        totalOrders: totalOrdersCount,
        totalRevenue,
        pendingRevenue,
        totalItemsSold,
        confirmationRate,
        cancellationRate,
      },
      topProducts,
    });
  } catch (error: any) {
    console.error("Prisma Analytics Error:", error);
    return NextResponse.json({ error: "Impossible de charger les statistiques" }, { status: 500 });
  }
}
