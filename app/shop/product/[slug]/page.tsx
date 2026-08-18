import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductDetailsClient from "./ProductDetailsClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * 🌎 GENERATE METADATA FOR FACEBOOK & WHATSAPP CRAWLERS
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug); 

  const product = await prisma.product.findUnique({
    where: { Slug: slug },
    include: { variants: true },
  });

  if (!product) {
    return { title: "المنتج غير موجود" };
  }

  const productName = product.Name;
  const productDescription = product.Description || "اكتشف منتجاتنا الحصرية والمميزة على متجرنا الإلكتروني.";
  
  // Correction extraction prix : fallback sur product.price si la variante n'a pas de prix
  // Extrait le prix de la première variante. Si aucune variante n'existe, retourne 0.
  const currentPrice = product.variants?.[0]?.price ? Number(product.variants[0].price) : 0;
  const mainImage = product.variants?.[0]?.image?.[0];

  // Domaine officiel de production configuré en dur par défaut pour les partages
  const productionDomain = process.env.NEXT_PUBLIC_SITE_URL || "https://saidati.me";
  
  // Résolution propre de l'adresse de l'image (Cloudinary externe ou locale)
  const absoluteImageUrl = mainImage && mainImage.startsWith("http") 
    ? mainImage 
    : `${productionDomain}${mainImage || "/them.jpg"}`;

  return {
    title: `${productName} | ${product.brand || "Anaka Shop"}`,
    description: `${productDescription} - السعر: ${currentPrice} دج`,
    openGraph: {
      title: productName,
      description: `${productDescription} - السعر الحالي: ${currentPrice} دج`,
      // 🛠️ Ajustement du chemin exact d'URL selon votre arborescence physique /shop/product
      url: `${productionDomain}/shop/product/${rawSlug}`,
      siteName: "Anaka Shop",
      type: "article", // Type article idéal pour la mise en valeur des fiches produits de e-commerce
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: productName,
      description: productDescription,
      images: [absoluteImageUrl],
    },
  };
}

/**
 * 🖥️ MAIN PAGE RENDERER (SERVER COMPONENT)
 */
export default async function ProductDetailsPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug); 

  const product = await prisma.product.findUnique({
    where: { Slug: slug },
    include: {
      variants: true,
      attributes: true,
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Sérialisation des données et conversion sûre des Decimals / Ints
  const serializedProduct = {
    ...product,
    type: product.type, // Ajout de la nature du produit (CLOTHES, PERFUME, COSMETICS)
    variants: product.variants.map((v) => ({
      ...v,
      color: v.color || "",
      size: v.size || "",
      weight: v.weight ? Number(v.weight) : 0,
      price: v.price ? Number(v.price) : 0, 
    })),
  };

  return <ProductDetailsClient initialProduct={serializedProduct} />;
}
