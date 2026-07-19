"use client";
import { useState } from "react";
import { useCartStore } from "../app/store/useCartStore";
import { toast } from "sonner";
import Link from "next/link";

interface Variant {
  id: number; color: string; size: string; sku: string;
  barcode: string; price: number; stock: number; image: string[];
}
interface Product {
  id: number; Name: string; Slug: string; brand: string; Description: string; variants?: Variant[];
}

export default function ProductCard({ product }: { product: Product }) {
  const activeVariants = product.variants || [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const currentVariant = activeVariants[selectedIdx];
  const mainImage = currentVariant?.image?.[0] || null;

  const productUrl = `https://yourdomain.com/product/${product.Slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentVariant) return;
    if (currentVariant.stock <= 0) {
      toast.error("هذه الـتوليفة غير متوفرة في المخزن حالياً");
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

  const copyLinkTikTok = async () => {
    await navigator.clipboard.writeText(productUrl);
    toast.success("تم نسخ رابط المنتج! ألصقه في TikTok.");
  };

  return (
    <div className="bg-gray-950 border border-gray-900 rounded-2xl overflow-hidden flex flex-col h-full shadow-lg group hover:border-gray-800 transition-colors">
      {/* Clickable product link only around image/title */}
      <Link href={`/product/${product.Slug}`} className="block">
        <div className="aspect-square w-full bg-gray-900 relative overflow-hidden flex items-center justify-center">
          {mainImage ? (
            <img src={mainImage} alt={product.Name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="text-gray-600 text-xs font-mono uppercase">Aucune Image</div>
          )}
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-gray-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-gray-800">
            {product.brand || "Générique"}
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow gap-2 text-right" dir="rtl">
        <Link href={`/product/${product.Slug}`} className="block">
          <h4 className="text-base font-bold text-white line-clamp-1 group-hover:text-gray-300 transition-colors">{product.Name}</h4>
        </Link>
        <p className="text-xs text-gray-400 line-clamp-2 min-h-[2.5rem] leading-relaxed">{product.Description}</p>

        {activeVariants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 my-1 justify-start">
            {activeVariants.map((v, i) => (
              <button
                key={v.id} onClick={() => setSelectedIdx(i)}
                className={`text-[10px] font-bold px-2 py-1 rounded border transition-all cursor-pointer ${i === selectedIdx ? "bg-white text-black border-white font-black" : "bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700"}`}
              >
                {v.color} ({v.size})
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-900/60">
          <span className="text-base font-black text-white">{currentVariant?.price || 0} DZD</span>
          <button
            onClick={handleAddToCart}
            className="bg-white text-black hover:bg-gray-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow active:scale-95 z-10"
          >
            إضافة للسلة
          </button>
        </div>

        {/* Share buttons */}
        <div className="flex gap-2 mt-3">
          {/* Facebook Share */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z"/>
            </svg>
            Facebook
          </a>

          {/* TikTok Share */}
          <button
            onClick={copyLinkTikTok}
            className="flex items-center gap-1 bg-pink-500 text-white text-xs px-3 py-1 rounded hover:bg-pink-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="w-4 h-4">
              <path d="M128 0c70.7 0 128 57.3 128 128S198.7 256 128 256 0 198.7 0 128 57.3 0 128 0zm36.6 65.5c6.9 5.1 15.2 8.3 24.2 8.9v27.1c-9.1-.2-18-2.9-25.6-7.7v61.6c0 34.9-28.3 63.2-63.2 63.2-12.3 0-23.8-3.6-33.4-9.8 8.9 1.1 18.1-.9 25.9-5.7 7.8-4.8 13.8-12.1 16.9-20.7-7.7 1.6-15.8.2-22.7-4.1-6.9-4.3-11.9-11-13.9-18.7 6.3 1.2 12.8.5 18.6-2.1 5.8-2.6 10.6-7 13.7-12.5 3.1-5.5 4.4-11.8 3.7-18.1V65.5h46.8z"/>
            </svg>
            TikTok
          </button>
        </div>
      </div>
    </div>
  );
}
