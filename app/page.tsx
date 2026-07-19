"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import { useCartStore } from "./store/useCartStore";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const openCart = useCartStore((state) => state.openCart);
  const cartItemsCount = useCartStore((state) => state.items.reduce((total, i) => total + i.quantity, 0));

  // Dynamic Filtration State Maps
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");

  useEffect(() => {
    const fetchStorefrontContent = async () => {
      try {
        const [resProd, resCat] = await Promise.all([fetch("/api/products"), fetch("/api/categories")]);
        if (resProd.ok) setProducts(await resProd.json());
        if (resCat.ok) setCategories(await resCat.json());
      } catch (err) {
        console.error("Storefront runtime connection error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStorefrontContent();
  }, []);

  // Compute unique brands available dynamically across existing products list
  const uniqueBrands = ["all", ...new Set(products.map(p => p.brand || p.Brand).filter(Boolean))];

  // The Filter Engine
  const filteredProducts = products.filter((prod) => {
    const pName = (prod.Name || prod.name || "").toLowerCase();
    const pDesc = (prod.Description || prod.description || "").toLowerCase();
    const matchesSearch = pName.includes(searchQuery.toLowerCase()) || pDesc.includes(searchQuery.toLowerCase());
    
    const pBrand = prod.brand || prod.Brand || "";
    const matchesBrand = selectedBrand === "all" || pBrand.toLowerCase() === selectedBrand.toLowerCase();
    
    const matchesGender = selectedGender === "all" || prod.gender === selectedGender;
    const matchesSeason = selectedSeason === "all" || prod.season === selectedSeason;

    return matchesSearch && matchesBrand && matchesGender && matchesSeason;
  });

  return (
    <main className="w-full min-h-screen bg-black text-white antialiased flex flex-col pb-20 relative">
      <CartDrawer /> {/* Interactive sliding layout mounted globally */}

      {/* Floating Action Cart Sticky Menu Toggle Button */}
      <button 
        onClick={openCart}
        className="fixed bottom-6 right-6 z-40 bg-white text-black p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-transform active:scale-95 font-bold cursor-pointer"
      >
        <span>🛒</span>
        <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full font-mono">{cartItemsCount}</span>
      </button>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[45vh] bg-gradient-to-b from-gray-950 to-black border-b border-gray-900 flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-4 relative z-10" dir="rtl">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">متجر Clothese المتميز</h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">تصفح المجموعات، اختر مقاسك ولونك المفضل، وأكد طلبك بكل بساطة وسرعة.</p>
        </div>
      </section>

      {/* ADVANCED MULTI-FILTRATION BAR CONTAINER */}
      <section className="max-w-7xl mx-auto w-full px-4 -mt-10 relative z-20">
        <div className="bg-gray-950 border border-gray-800 p-5 rounded-2xl shadow-2xl flex flex-col gap-4 text-right" dir="rtl">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">تصفية متقدمة للمنتجات (Filtrer)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* 1. Keyword search input field */}
            <input 
              type="text" placeholder="ابحث باسم المنتج أو الوصف..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gray-600 transition-colors"
            />

            {/* 2. Brand Selector mapping */}
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
              <option value="all">كل الماركات (Toutes les marques)</option>
              {uniqueBrands.filter(b => b !== "all").map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* 3. Strict Database Gender Enum filters */}
            <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
              <option value="all">كل الأجناس (Tous les genres)</option>
              <option value="men">رجال (Hommes)</option>
              <option value="women">نساء (Femmes)</option>
              <option value="kids">أطفال (Enfants)</option>
            </select>

            {/* 4. Strict Database Seasonal Enum filters */}
            <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
              <option value="all">كل الفصول (Toutes les saisons)</option>
              <option value="Summer">الصيف (Summer)</option>
              <option value="Winter">الشتاء (Winter)</option>
              <option value="AllSeason">كل المواسم (All Season)</option>
            </select>
          </div>
        </div>
      </section>

      {/* MAIN PRODUCTS GRID LIST DISPLAY ROW */}
      <section className="max-w-7xl mx-auto w-full px-4 mt-12 flex flex-col gap-6">
        <div className="flex flex-row-reverse justify-between items-center border-b border-gray-900 pb-3" dir="rtl">
          <h2 className="text-xl font-black text-white">المنتجات المتاحة ({filteredProducts.length})</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-950 border border-gray-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="w-full py-20 text-center text-gray-500 border border-gray-900 rounded-2xl bg-gray-950 font-mono text-sm">
            لا توجد منتجات تطابق معايير البحث الحالية.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
