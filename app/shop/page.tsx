"use client";
import CartDrawer from "@/components/CartDrawer";
import TopBar from "@/components/home/TopBar";
import HeroSection from "@/components/home/HeroSection";
import FloatingCar from "@/components/home/FloatingCart";
import TrustBadges from "@/components/home/TrustBadges";
import { ProductFilters } from "@/components/home/ProductFilters";
import { SearchBar } from "@/components/home/SearchBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductGrid } from "@/components/home/ProductGrid"; // 🟢 Nouveau
import { useProductFilter } from "@/hooks/useProductFilter"; // 🟢 Nouveau
import { useCartStore } from "./store/useCartStore";

export default function HomePage() {
  // Extraction de tous les états et fonctions du Hook personnalisé
  const state = useProductFilter();

  const openCart = useCartStore((s) => s.openCart);
  const cartItemsCount = useCartStore((s) => s.items.reduce((total, i) => total + i.quantity, 0));

  return (
    <main className="w-full min-h-screen bg-background text-foreground antialiased flex flex-col pb-24 relative overflow-x-hidden transition-colors duration-200">
      <CartDrawer />
      <TopBar />
      <FloatingCar count={cartItemsCount} onClick={openCart} />
      <HeroSection hasPromotions={state.hasPromotions} />
      <TrustBadges />
      
      <section id="catalogue" className="max-w-7xl mx-auto w-full px-4 mt-12" dir="rtl">
        <div className="flex flex-col gap-8">
          
          {/* 1. Grille des Catégories */}
          <CategoryGrid 
            categories={state.categories}
            selectedCategory={state.selectedCategory}
            setSelectedCategory={state.setSelectedCategory}
            loading={state.loading} 
          />

          {/* 2. Barre de Recherche et Filtres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 bg-secondary/20 p-4 rounded-2xl border border-border">
            <SearchBar searchQuery={state.searchQuery} setSearchQuery={state.setSearchQuery} />
            <ProductFilters
              selectedBrand={state.selectedBrand}
              setSelectedBrand={state.setSelectedBrand}
              uniqueBrands={state.uniqueBrands}
              selectedGender={state.selectedGender}
              setSelectedGender={state.setSelectedGender}
              selectedSeason={state.selectedSeason}
              setSelectedSeason={state.setSelectedSeason}
              activeTab={state.activeTab}
              selectedCategory={state.selectedCategory}
              setSelectedCategory={state.setSelectedCategory}
              categories={state.categories}
            />
          </div>

          {/* 3. Grille des Produits (Squelettes, Vide ou Cartes intégrés) */}
          <ProductGrid 
            products={state.filteredProducts} 
            loading={state.loading} 
          />

        </div>
      </section> 
    </main>
  );
}
