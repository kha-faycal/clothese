"use client";
import { useState } from "react";
import { useCartStore } from "../app/shop/store/useCartStore"; 
import { toast } from "sonner";
import Link from "next/link";
import { CldImage } from "next-cloudinary"; // ✅ Importation Cloudinary pour optimiser le chargement

interface Variant {
  id: number; 
  color: string; 
  size: string; 
  sku: string;
  barcode: string; 
  price: number; 
  stock: number; 
  image: string[];
}

interface Product {
  id: number; 
  Name: string; 
  Slug: string; 
  brand: string; 
  Description: string;
  type?: "CLOTHES" | "PERFUME" | "COSMETICS"; // ✅ Prise en charge de la nature du produit
  variants?: Variant[];
}

export default function ProductCard({ product }: { product: Product }) {
  const activeVariants = product.variants || [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const currentVariant = activeVariants[selectedIdx];
  const mainImage = currentVariant?.image?.[0] || null;
  const productPath = `/shop/product/${product.Slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentVariant) return;
    if (currentVariant.stock <= 0) {
      toast.error("هذه التوليفة غير متوفرة في المخزن حالياً");
      return;
    }

    addItem({
      variantId: currentVariant.id,
      productId: product.id,
      name: product.Name,
      brand: product.brand,
      color: currentVariant.color,
      size: currentVariant.size,
      price: currentVariant.price,
      image: mainImage || "",
      stock: currentVariant.stock
    });

    toast.success("تمت الإضافة للسلة !", {
      action: { label: "عرض السلة", onClick: () => openCart() }
    });
  };

  const getAbsoluteUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${productPath}`;
    }
    return "";
  };

  const copyLinkTikTok = async () => {
    await navigator.clipboard.writeText(getAbsoluteUrl());
    toast.success("تم نسخ رابط المنتج! ألصقه في TikTok.");
  };

  const handleFacebookShare = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getAbsoluteUrl())}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  // ✅ Fonction utilitaire pour n'afficher que l'information de variante pertinente sur la carte catalogue
  const getVariantLabel = (v: Variant) => {
    if (product.type === "PERFUME") {
      return v.size; // Pour le parfum, afficher uniquement la contenance (ex: "100ml")
    }
    if (product.type === "COSMETICS") {
      return v.color && v.size ? `${v.color} (${v.size})` : v.color || v.size; // Teinte et contenance
    }
    return v.color && v.size ? `${v.color} (${v.size})` : v.color || v.size; // Vêtements : Couleur (Taille)
  };

  return (
    <div className="bg-secondary/30 border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md flex flex-col h-full group hover:border-muted/40 transition-all duration-200">
      
      <Link href={productPath} className="block">
        <div className="aspect-square w-full bg-secondary/50 relative overflow-hidden flex items-center justify-center border-b border-border">
          {mainImage ? (
            // ✅ Remplacement par CldImage pour compresser les vignettes automatiquement au format WebP/AVIF
            <CldImage 
              src={mainImage} 
              width="400"
              height="400"
              crop="fill"
              alt={product.Name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          ) : (
            <div className="text-muted text-xs font-mono uppercase">Aucune Image</div>
          )}
          
          <span className="absolute top-3 right-3 bg-background/80 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-border shadow-sm">
            {product.brand || "Générique"}
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow gap-2 text-right" dir="rtl">
        
        <Link href={productPath} className="block">
          <h4 className="text-sm sm:text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.Name}
          </h4>
        </Link>
        
        <p className="text-xs text-muted line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {product.Description}
        </p>

        {/* ✅ Sélecteur de variantes adaptatif en fonction de la nature du produit */}
        {activeVariants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 my-1 justify-start">
            {activeVariants.map((v, i) => (
              <button
                key={v.id} 
                type="button"
                onClick={() => setSelectedIdx(i)}
                className={`text-[9px] font-bold px-2 py-1 rounded border transition-all cursor-pointer ${
                  i === selectedIdx 
                    ? "bg-foreground text-background border-foreground font-black" 
                    : "bg-background text-muted border-border hover:border-muted"
                }`}
              >
                {getVariantLabel(v)}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <span className="text-sm sm:text-base font-black text-foreground tracking-tight">
            {currentVariant?.price || 0} DZD
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-foreground text-background hover:opacity-90 text-[11px] sm:text-xs font-black px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow active:scale-95 z-10"
          >
            إضافة للسلة
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
          {/* Facebook */}
          <a
            href="#"
            onClick={handleFacebookShare}
            className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2 rounded-xl transition-colors shadow-sm text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z"/>
            </svg>
            Facebook
          </a>

          {/* TikTok */}
          <button
            type="button"
            onClick={copyLinkTikTok}
            className="flex items-center justify-center gap-1 bg-neutral-900 dark:bg-neutral-800 text-white text-[11px] font-bold py-2 rounded-xl border border-border hover:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M128 0c70.7 0 128 57.3 128 128S198.7 256 128 256 0 198.7 0 128 57.3 0 128 0zm36.6 65.5c6.9 5.1 15.2 8.3 24.2 8.9v27.1c-9.1-.2-18-2.9-25.6-7.7v61.6c0 34.9-28.3 63.2-63.2 63.2-12.3 0-23.8-3.6-33.4-9.8 8.9 1.1 18.1-.9 25.9-5.7 7.8-4.8 13.8-12.1 16.9-20.7-7.7 1.6-15.8.2-22.7-4.1-6.9-4.3-11.9-11-13.9-18.7 6.3 1.2 12.8.5 18.6-2.1 5.8-2.6 10.6-7 13.7-12.5 3.1-5.5 4.4-11.8 3.7-18.1V65.5h46.8z"/>
            </svg>
            TikTok
          </button>
        </div>

      </div>
    </div>
  );
}
