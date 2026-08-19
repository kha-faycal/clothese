"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "../app/shop/store/useCartStore"; 
import { toast } from "sonner";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

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
  type?: "CLOTHES" | "PERFUME" | "COSMETICS"; 
  variants?: Variant[];
}

export default function ProductCard({ product }: { product: Product }) {
  const activeVariants = product.variants || [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  
  // 🟢 Gestion de l'état du cœur et du compteur (+1)
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const currentVariant = activeVariants[selectedIdx];
  const mainImage = currentVariant?.image?.[0] || null;
  const productPath = `/shop/product/${product.Slug}`;

  // Initialisation d'un nombre d'avis/likes de base réaliste
  useEffect(() => {
    setLikeCount(Math.floor(Math.random() * 45) + 12);
  }, []);

  // 🟢 Fonction pour ajouter/enlever le like dynamiquement (+1 / -1)
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

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
    toast.success("تم نسخ رابط المنتج! ألصقه in TikTok.");
  };

  // 🔒 Votre code d'origine Facebook préservé à 100%
  const handleFacebookShare = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const shareUrl = `https://facebook.com{encodeURIComponent(getAbsoluteUrl())}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const getVariantLabel = (v: Variant) => {
    if (product.type === "PERFUME") {
      return v.size; 
    }
    if (product.type === "COSMETICS") {
      return v.color && v.size ? `${v.color} (${v.size})` : v.color || v.size; 
    }
    return v.color && v.size ? `${v.color} (${v.size})` : v.color || v.size; 
  };

  return (
    <div className="bg-background dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl flex flex-col h-full group hover:-translate-y-1 transition-all duration-300 relative">
      
      {/* Zone Image avec Logo de la marque et bouton Cœur */}
      <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-800/50 overflow-hidden flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800">
        
        {/* 🟢 Bouton cœur flottant interactif (+1) */}
        <button
          type="button"
          onClick={handleLikeClick}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md flex items-center justify-center border border-neutral-200 dark:border-neutral-800 shadow-sm text-neutral-500 hover:text-red-500 active:scale-90 transition-all cursor-pointer"
        >
          <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={`w-4 h-4 transition-colors ${isLiked ? "text-red-500" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>

        <Link href={productPath} className="w-full h-full block">
          {mainImage ? (
            <CldImage 
              src={mainImage} 
              width="400"
              height="400"
              crop="fill"
              alt={product.Name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-mono">Aucune Image</div>
          )}
        </Link>
        
        <span className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-md text-foreground text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-border shadow-sm">
          {product.brand || "Générique"}
        </span>
      </div>

      {/* Contenu textuel et actions */}
      <div className="p-4 flex flex-col flex-grow gap-2 text-right" dir="rtl">
        
        {/* 🟢 Ligne des étoiles statiques et compteur d'avis lié au Cœur */}
        <div className="flex items-center justify-between text-[11px] mt-0.5">
          <span className="flex items-center gap-0.5 text-amber-500 font-bold tracking-tighter">
            ★★★★★
          </span>
          <span className="font-bold text-neutral-400 dark:text-neutral-500 font-mono">
            ({likeCount} ❤️)
          </span>
        </div>

        <Link href={productPath} className="block mt-0.5">
          <h4 className="text-sm sm:text-base font-black text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-primary transition-colors">
            {product.Name}
          </h4>
        </Link>
        
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {product.Description}
        </p>

        {/* Sélecteur de variantes */}
        {activeVariants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 my-1.5 justify-start">
            {activeVariants.map((v, i) => (
              <button
                key={v.id} 
                type="button"
                onClick={() => setSelectedIdx(i)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                  i === selectedIdx 
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent font-black shadow-sm" 
                    : "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                }`}
              >
                {getVariantLabel(v)}
              </button>
            ))}
          </div>
        )}

        {/* Prix et Bouton Panier */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-sm sm:text-base font-black text-neutral-900 dark:text-white tracking-tight">
            {currentVariant?.price || 0} DZD
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90 text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow active:scale-95 z-10"
          >
            إضافة للسلة
          </button>
        </div>

        {/* 🔒 Vos deux boutons officiels d'origine Facebook et TikTok (Intacts) */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <a
            href="#"
            onClick={handleFacebookShare}
            className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2 rounded-xl transition-colors shadow-sm text-center"
          >
            <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z"/>
            </svg>
            Facebook
          </a>

          <button
            type="button"
            onClick={copyLinkTikTok}
            className="flex items-center justify-center gap-1 bg-neutral-900 dark:bg-neutral-800 text-white text-[11px] font-bold py-2 rounded-xl border border-border hover:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors shadow-sm"
          >
            <svg xmlns="http://w3.org" viewBox="0 0 256 256" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M128 0c70.7 0 128 57.3 128 128S198.7 256 128 256 0 198.7 0 128 57.3 0 128 0zm36.6 65.5c6.9 5.1 15.2 8.3 24.2 8.9v27.1c-9.1-.2-18-2.9-25.6-7.7v61.6c0 34.9-28.3 63.2-63.2 63.2-12.3 0-23.8-3.6-33.4-9.8 8.9 1.1 18.1-.9 25.9-5.7 7.8-4.8 13.8-12.1 16.9-20.7-7.7 1.6-15.8.2-22.7-4.1-6.9-4.3-11.9-11-13.9-18.7 6.3 1.2 12.8.5 18.6-2.1 5.8-2.6 10.6-7 13.7-12.5 3.1-5.5 4.4-11.8 3.7-18.1V65.5h46.8z"/>
            </svg>
            TikTok
          </button>
        </div>

      </div>
    </div>
  );
}
