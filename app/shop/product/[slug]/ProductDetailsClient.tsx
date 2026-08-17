"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "../../store/useCartStore";
import { toast } from "sonner";
import CartDrawer from "@/components/CartDrawer";
import FacebookShareButton from "@/components/FacebookShareButton";
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

interface Attribute {
  id: number;
  name: string;
  value: string;
}

interface Category {
  id: number;
  Name: string;
}

interface Product {
  id: number;
  Name: string;
  Slug: string;
  brand: string;
  Description: string;
  type: "CLOTHES" | "PERFUME" | "COSMETICS"; // Prise en charge du type
  gender: string;
  season?: string | null;
  category?: Category;
  variants?: Variant[];
  attributes?: Attribute[];
}

export default function ProductDetailsClient({ initialProduct }: { initialProduct: Product }) {
  const [product] = useState<Product>(initialProduct);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [selectedVariantIdx]);

  const variants = product.variants || [];
  const currentVariant = variants[selectedVariantIdx];
  const images = currentVariant?.image || [];
  const activeImage = images[activeImageIdx] || null;

  const handleAddToCart = () => {
    if (!currentVariant) return;

    if (currentVariant.stock <= 0) {
      toast.error("هذه التوليفة نفدت من المخزن");
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
      image: activeImage || "",
      stock: currentVariant.stock,
    });

    toast.success("تمت الإضافة للسلة !", {
      action: { label: "عرض السلة", onClick: () => openCart() },
    });
  };

  // Regrouper les variantes par caractéristiques pour affichage dynamique
  const distinctSizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));
  const distinctColors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));

  // Gérer le changement de choix dynamique
  const handleSelectSpecs = (size: string, color: string) => {
    const idx = variants.findIndex(v => v.size === size && v.color === color);
    if (idx !== -1) setSelectedVariantIdx(idx);
  };

  return (
    <main className="w-full min-h-screen bg-black text-white antialiased py-6 md:py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <CartDrawer />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        {/* 📸 SECTION GAUCHE : IMAGES */}
        <div className="flex flex-col gap-3 md:gap-4 w-full">
          <div className="aspect-square w-full bg-gray-950 border border-gray-900 rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center shadow-lg relative max-h-[75vh]">
            {activeImage ? (
              <CldImage
                src={activeImage}
                width="800"
                height="800"
                crop="fill"
                gravity="auto"
                alt={product.Name}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover animate-in fade-in duration-300"
              />
            ) : (
              <div className="text-gray-600 text-xs md:text-sm font-mono uppercase tracking-wider">Aucune image</div>
            )}
            
            {product.brand && (
              <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-gray-300 text-[10px] md:text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-gray-800 z-10">
                {product.brand}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar justify-start snap-x scroll-smooth">
              {images.map((imgUrl: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl border overflow-hidden bg-gray-950 shadow flex-shrink-0 snap-center transition-all cursor-pointer ${
                    idx === activeImageIdx ? "border-white scale-105" : "border-gray-800 opacity-60"
                  }`}
                >
                  <CldImage src={imgUrl} width="150" height="150" crop="thumb" alt="Vignette" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 📝 SECTION DROITE : DETAILS ET LOGIQUE DYNAMIQUE */}
        <div className="flex flex-col gap-6 w-full">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">{product.category?.Name}</span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white mt-1">{product.Name}</h1>
            <p className="text-xl md:text-2xl font-bold text-emerald-400 mt-2">{currentVariant?.price} DZD</p>
          </div>

          <hr className="border-gray-900" />

          {/* 🌟 LOGIQUE INTERFACE ADAPTATIVE */}
          <div className="flex flex-col gap-4">
            {/* 1. Gestion des Tailles / Contenances */}
            {distinctSizes.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-400 block mb-2">
                  {product.type === "CLOTHES" ? "المقاس المتاح :" : "الحجم / السعة :"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {distinctSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSelectSpecs(size, currentVariant?.color)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                        currentVariant?.size === size
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-white border-gray-800 hover:border-gray-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Gestion des Couleurs / Teintes */}
            {distinctColors.length > 0 && (
              <div className="mt-2">
                <label className="text-sm font-medium text-gray-400 block mb-2">
                  {product.type === "COSMETICS" ? "الدرجة / اللون :" : "اللون المتاح :"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {distinctColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleSelectSpecs(currentVariant?.size, color)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                        currentVariant?.color === color
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-white border-gray-800 hover:border-gray-600"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gestion du stock en direct */}
          <div className="text-sm">
            {currentVariant?.stock > 0 ? (
              <span className="text-emerald-500 font-medium">✓ متوفر في المخزن ({currentVariant.stock})</span>
            ) : (
              <span className="text-red-500 font-medium">✕ غير متوفر حالياً</span>
            )}
          </div>

          {/* زر الإضافة إلى السلة */}
          <button
            onClick={handleAddToCart}
            disabled={!currentVariant || currentVariant.stock <= 0}
            className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-xl shadow-lg transition-all disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed"
          >
            {currentVariant?.stock > 0 ? "إضافة إلى سلة التسوق" : "نفدت الكمية"}
          </button>

          {/* ℹ️ SPECIFIC ATTRIBUTES DISPLAY */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="mt-4 bg-gray-950 p-4 rounded-xl border border-gray-900">
              <h3 className="text-sm font-bold text-gray-300 mb-3">تفاصيل ومميزات المنتج :</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {product.attributes.map((attr) => (
                  <div key={attr.id} className="border-b border-gray-900 pb-2">
                    <span className="text-gray-500 block mb-0.5">{attr.name}</span>
                    <span className="text-gray-200 font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* وصف المنتج الأساسي */}
          <div className="mt-2 text-sm leading-relaxed text-gray-400">
            <h3 className="text-white font-bold mb-1">وصف المنتج :</h3>
            <p className="whitespace-pre-line">{product.Description}</p>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <FacebookShareButton url={`/product/${product.Slug}`} />
          </div>
        </div>
      </div>
    </main>
  );
}
