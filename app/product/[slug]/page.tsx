"use client";
import * as React from "react"; // 👈 1. Import all from React to get access to React.use()
import { useEffect, useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import { toast } from "sonner";
import CartDrawer from "@/components/CartDrawer";

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) { // 👈 2. Strongly type params as a Promise
  // 👈 3. UNWRAP THE PROMISE PROPERLY USING REACT.USE BEFORE ACCESSING ITS SLUG
  const { slug } = React.use(params);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // 👈 4. Use the unwrapped slug string safely without generating linter faults
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error("Failed to load product sheet data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]); // 👈 5. Bind the dependency array directly to the unwrapped string variable

  // Reset the active image preview index to 0 whenever the user switches variants
  useEffect(() => {
    setActiveImageIdx(0);
  }, [selectedVariantIdx]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center font-medium">
        جاري تحميل تفاصيل المنتج...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-400">عذراً، المنتج غير موجود.</p>
      </div>
    );
  }

  const variants = product.variants || [];
  const currentVariant = variants[selectedVariantIdx];
  const images = currentVariant?.image || [];
  const activeImage = images[activeImageIdx] || null;

  const handleAddToCart = () => {
    if (!currentVariant) return;

    if (currentVariant.stock <= 0) {
      toast.error("هذه الـتوليفة نفدت من المخزن");
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

  return (
    <main className="w-full min-h-screen bg-black text-white antialiased py-12 px-4 md:px-8">
      <CartDrawer />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE IMAGES SLIDER LAYOUT CONTAINER */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-full bg-gray-950 border border-gray-900 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg relative">
            {activeImage ? (
              <img src={activeImage} alt={product.Name} className="w-full h-full object-cover animate-in fade-in duration-300" />
            ) : (
              <div className="text-gray-600 text-sm font-mono uppercase tracking-wider">Aucune image</div>
            )}
            
            {product.brand && (
              <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-gray-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-800">
                {product.brand}
              </span>
            )}
          </div>

          {/* Map and render multiple images thumbnails dynamically */}
          {images.length > 1 && (
            <div className="flex flex-wrap gap-3 justify-center">
              {images.map((imgUrl: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl border overflow-hidden bg-gray-950 shadow transition-all cursor-pointer ${idx === activeImageIdx ? "border-white scale-105 ring-2 ring-white/10" : "border-gray-800 opacity-60 hover:opacity-100"}`}
                >
                  <img src={imgUrl} alt="Thumbnail view" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: COMPLETE SPECIFICATIONS AND PRODUCT CONFIG SHEET */}
        <div className="flex flex-col gap-6 text-right" dir="rtl">
          
          {/* Section 1: Title Metadata info */}
          <div className="border-b border-gray-900 pb-4 flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              {product.category?.Name || "تصنيف عام"}
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{product.Name}</h1>
            <p className="text-2xl font-black text-white mt-2 tracking-tight">
              {currentVariant?.price || 0} DZD
            </p>
          </div>

          {/* Section 2: Descriptions summary text */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">الوصف والخصائص</h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium">
              {product.Description || "لم يتم توفير وصف تفصيلي لهذا ..."}
            </p>
          </div>

          {/* Section 3: Interactive Variant Combos selections */}
          {variants.length > 0 && (
            <div className="flex flex-col gap-3 bg-gray-950 border border-gray-900 p-4 rounded-2xl">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">المقاسات والألوان المتوفرة :</h3>
              <div className="flex flex-wrap gap-2.5 justify-start">
                {variants.map((v: any, index: number) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIdx(index)}
                    className={`px-4 py-2.5 text-xs font-black rounded-xl border transition-all cursor-pointer ${index === selectedVariantIdx ? "bg-white text-black border-white shadow-md scale-102" : "bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700"}`}
                  >
                    {v.color} — {v.size} {v.stock <= 0 && "(نفد)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Specifications tables attributes loops */}
          <div className="flex flex-col gap-2 border-t border-gray-900 pt-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">المواصفات التقنية</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.attributes?.map((attr: any) => (
                <div key={attr.id} className="flex justify-between items-center bg-gray-950/40 border border-gray-900 px-4 py-2.5 rounded-xl text-xs">
                  <span className="text-gray-400 font-semibold">{attr.name}</span>
                  <span className="text-white font-bold">{attr.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center bg-gray-950/40 border border-gray-900 px-4 py-2.5 rounded-xl text-xs">
                <span className="text-gray-400 font-semibold">الجنس (Genre)</span>
                <span className="text-white font-bold">{product.gender}</span>
              </div>
              {product.season && (
                <div className="flex justify-between items-center bg-gray-950/40 border border-gray-900 px-4 py-2.5 rounded-xl text-xs">
                  <span className="text-gray-400 font-semibold">الموسم (Saison)</span>
                  <span className="text-white font-bold">{product.season}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Add item conversion button triggering */}
          <div className="mt-4 pt-4 border-t border-gray-900 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleAddToCart}
              type="button"
              className="w-full bg-white text-black font-black text-base py-4 rounded-2xl hover:bg-gray-200 transition-colors shadow-lg active:scale-98 cursor-pointer text-center"
            >
              إضافة لسلة المشتريات التلقائية
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}
