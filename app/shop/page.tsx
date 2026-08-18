"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import { useCartStore } from "./store/useCartStore";
import { CldImage } from 'next-cloudinary';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🎛️ Filtre Principal : Nature du produit (ALL, CLOTHES, PERFUME, COSMETICS)
  const [activeTab, setActiveTab] = useState<"ALL" | "CLOTHES" | "PERFUME" | "COSMETICS">("ALL");

  // Filtres secondaires
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const openCart = useCartStore((state) => state.openCart);
  const cartItemsCount = useCartStore((state) => state.items.reduce((total, i) => total + i.quantity, 0));

  useEffect(() => {
    const fetchStorefrontContent = async () => {
      try {
        const [resProd, resCat] = await Promise.all([fetch("api/products"), fetch("api/categories")]);
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

  const uniqueBrands = ["all", ...new Set(products.map(p => p.brand || p.Brand).filter(Boolean))];

  // 🛡️ Logique de Filtrage croisée (Onglet principal + Filtres secondaires)
  const filteredProducts = products.filter((prod) => {
    // 1. Filtrage par onglet principal (Nature du produit)
    if (activeTab !== "ALL" && prod.type !== activeTab) return false;

    // 2. Recherche textuelle
    const pName = (prod.Name || prod.name || "").toLowerCase();
    const pDesc = (prod.Description || prod.description || "").toLowerCase();
    const matchesSearch = pName.includes(searchQuery.toLowerCase()) || pDesc.includes(searchQuery.toLowerCase());
    
    // 3. Filtres avancés
    const pBrand = prod.brand || prod.Brand || "";
    const matchesBrand = selectedBrand === "all" || pBrand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesGender = selectedGender === "all" || prod.gender === selectedGender;
    const matchesSeason = selectedSeason === "all" || prod.season === selectedSeason;
    const matchesCategory = selectedCategory === "all" || prod.categoryId === Number(selectedCategory);

    return matchesSearch && matchesBrand && matchesGender && matchesSeason && matchesCategory;
  });

  const promotionalProducts = products.filter(p => p.isPromotion || (p.oldPrice && p.oldPrice > p.price));

  return (
    <main className="w-full min-h-screen bg-background text-foreground antialiased flex flex-col pb-24 relative overflow-x-hidden transition-colors duration-200">
      <CartDrawer />

      {/* 1. TOP BAR OPTIMISÉE */}
      <div className="bg-secondary/40 text-muted text-[10px] md:text-xs py-2.5 px-4 border-b border-border transition-colors" dir="rtl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-0 tracking-wide text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="font-medium text-foreground/80">🚚 التوصيل metوفر لـ 58 ولاية سارع بالطلب الآن</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="font-semibold text-foreground">💵 الدفع عند الاستلام (Paiement à la livraison)</span>
          </div>
        </div>
      </div>

      {/* 📱 BOUTON FLOTTANT PANIER DYNAMIQUE */}
      <button 
        onClick={openCart}
        className="fixed bottom-6 right-4 sm:right-6 z-40 bg-foreground text-background pl-5 pr-4 py-3 sm:py-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2.5 sm:gap-3 hover:opacity-90 transition-all active:scale-90 font-bold cursor-pointer select-none group"
      >
        <span className="text-base sm:text-lg group-hover:rotate-12 transition-transform">🛒</span>
        <span className="bg-background text-foreground text-[10px] px-2 py-0.5 rounded-full font-mono font-black">{cartItemsCount}</span>
      </button>

      {/* 2. HERO SECTION ADAPTATIVE */}
      <section className="relative w-full min-h-[40vh] md:min-h-[55vh] bg-gradient-to-b from-secondary/20 to-background border-b border-border flex items-center px-4 sm:px-6 overflow-hidden py-12 md:py-0 transition-colors">
        <div className="absolute top-1/3 left-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center" dir="rtl">
          
          <div className="col-span-1 md:col-span-7 flex flex-col items-center md:items-start gap-4 text-center md:text-right">
            <span className="text-[10px] sm:text-xs bg-secondary border border-border text-foreground px-3 py-1.5 rounded-md font-black tracking-widest uppercase shadow-sm">Collection 2026</span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.2] md:leading-[1.15]">
              منتجات تعبر عن <br className="hidden sm:inline" />
              <span className="text-primary">تميزك وانفرادك</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted max-w-lg leading-relaxed px-2 sm:px-0">
              اكتشف تشكيلاتنا الحصرية من الملابس الراقية، العطور الفاخرة، ومستحضرات التجميل المنتقاة بعناية فائقة لتناسب ذوقك الرفيع.
            </p>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-3 w-full sm:w-auto">
              <a href="#catalogue" className="w-[45%] sm:w-auto bg-foreground text-background font-black text-center text-xs px-5 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg">تصفح المجموعة</a>
              {promotionalProducts.length > 0 && (
                <a href="#promotions" className="w-[45%] sm:w-auto bg-secondary text-primary border border-primary/20 font-bold text-center text-xs px-5 py-3 rounded-xl hover:bg-secondary/80 transition-colors">العروض %</a>
              )}
            </div>
          </div>

        <div className="hidden md:col-span-5 md:flex justify-end relative">
  <div className="w-72 h-96 bg-secondary/50 border border-border rounded-3xl shadow-2xl relative overflow-hidden flex items-center justify-center">
    <img
      src="https://cloudinary.com"              
      width={288} 
      height={384} 
      className="object-cover rounded-3xl"
      alt="Hero Section Image"   
    />
  </div>
</div>

        </div>
      </section>

      {/* 3. BLOCS DE CONFIANCE RE-STYLES */}
      <section className="max-w-7xl mx-auto w-full px-4 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4" dir="rtl">
        <div className="bg-secondary/30 border border-border p-3.5 rounded-xl flex items-center gap-3.5 text-right transition-colors">
          <span className="text-xl bg-background border border-border p-2 rounded-xl">🤝</span>
          <div className="flex flex-col">
            <h4 className="text-xs font-black text-foreground">ثقة وضمان</h4>
            <p className="text-[11px] text-muted">افحص سلعتك قبل الدفع عند الاستلام</p>
          </div>
        </div>
        <div className="bg-secondary/30 border border-border p-3.5 rounded-xl flex items-center gap-3.5 text-right transition-colors">
          <span className="text-xl bg-background border border-border p-2 rounded-xl">⚡</span>
          <div className="flex flex-col">
            <h4 className="text-xs font-black text-foreground">شحن سريع</h4>
            <p className="text-[11px] text-muted">توصيل منزلي في وقت قياسي لجميع الولايات</p>
          </div>
        </div>
        <div className="bg-secondary/30 border border-border p-3.5 rounded-xl flex items-center gap-3.5 text-right transition-colors">
          <span className="text-xl bg-background border border-border p-2 rounded-xl">🔄</span>
          <div className="flex flex-col">
            <h4 className="text-xs font-black text-foreground">خدمة الزبائن</h4>
            <p className="text-[11px] text-muted">فريق متواجد لمتابعة طلبك خطوة بخطوة</p>
          </div>
        </div>
      </section>

      {/* 4. SECTIONS ONGLETS DE FILTRAGE PRINCIPAUX */}
      <section id="catalogue" className="max-w-7xl mx-auto w-full px-4 mt-12" dir="rtl">
        <div className="flex flex-col gap-6">
          
          {/* Titre du catalogue */}
          <div className="text-right">
            <h2 className="text-xl md:text-2xl font-black text-foreground">تصفح أقسام المتجر</h2>
            <p className="text-xs text-muted mt-1">اختر التصنيف الأساسي لعرض المنتجات المتوفرة</p>
          </div>

          {/* 🗂️ ONGLETS DE NATURE DE PRODUITS */}
          <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setActiveTab("ALL"); setSelectedSeason("all"); }}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "ALL" ? "bg-foreground text-background" : "bg-secondary text-muted-foreground border border-border hover:border-gray-700"
              }`}
            >
              الكل ({products.length})
            </button>
                        <button
              onClick={() => setActiveTab("CLOTHES")}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "CLOTHES" ? "bg-blue-600 text-white" : "bg-secondary text-muted-foreground border border-border hover:border-blue-900"
              }`}
            >
              👕 الملابس ({products.filter(p => p.type === "CLOTHES").length})
            </button>

            <button
              onClick={() => { setActiveTab("PERFUME"); setSelectedSeason("all"); }}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "PERFUME" ? "bg-amber-600 text-white" : "bg-secondary text-muted-foreground border border-border hover:border-amber-900"
              }`}
            >
              ✨ العطور ({products.filter(p => p.type === "PERFUME").length})
            </button>

            <button
              onClick={() => { setActiveTab("COSMETICS"); setSelectedSeason("all"); }}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "COSMETICS" ? "bg-purple-600 text-white" : "bg-secondary text-muted-foreground border border-border hover:border-purple-900"
              }`}
            >
              💄 مواد التجميل ({products.filter(p => p.type === "COSMETICS").length})
            </button>
          </div>

          {/* 🔍 BARRE DE RECHERCHE ET FILTRES SECONDAIRES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 bg-secondary/20 p-4 rounded-2xl border border-border">
            <input
              type="text"
              placeholder="🔍 ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full"
            />

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none w-full"
            >
              <option value="all">كل الماركات</option>
              {uniqueBrands.filter(b => b !== "all").map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none w-full"
            >
              <option value="all">كل الفئات (الجنس)</option>
              <option value="men">رجال (Men)</option>
              <option value="women">نساء (Women)</option>
              <option value="kids">أطفال (Kids)</option>
              <option value="unisex">مشترك (Unisex)</option>
            </select>

            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              disabled={activeTab !== "CLOTHES" && activeTab !== "ALL"}
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none disabled:opacity-40 w-full"
            >
              <option value="all">كل الفصول</option>
              <option value="Summer">صيفي (Summer)</option>
              <option value="Winter">شتوي (Winter)</option>
              <option value="AllSeason">كل الفصول (AllSeason)</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none w-full"
            >
              <option value="all">كل التصنيفات</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.Name || c.name}</option>
              ))}
            </select>
          </div>

          {/* 🛍️ GRILLE DES PRODUITS FILTRÉS */}
          {loading ? (
            <div className="text-center py-20 text-xs font-mono text-muted">جاري تحميل المنتجات...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-secondary/10 border border-border border-dashed rounded-2xl">
              <p className="text-xs text-muted">لا توجد منتجات تطابق خيارات التصفية الحالية.</p>
            </div>
          )}
        </div>
      </section> 
       </main>
  );
}
