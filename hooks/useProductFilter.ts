"use client";
import { useState, useEffect } from "react";

export function useProductFilter() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"ALL" | "CLOTHES" | "PERFUME" | "COSMETICS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const filteredProducts = products.filter((prod) => {
    if (activeTab !== "ALL" && prod.type !== activeTab) return false;

    const pName = (prod.Name || prod.name || "").toLowerCase();
    const pDesc = (prod.Description || prod.description || "").toLowerCase();
    const matchesSearch = pName.includes(searchQuery.toLowerCase()) || pDesc.includes(searchQuery.toLowerCase());
    
    const pBrand = prod.brand || prod.Brand || "";
    const matchesBrand = selectedBrand === "all" || pBrand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesGender = selectedGender === "all" || prod.gender === selectedGender;
    const matchesSeason = selectedSeason === "all" || prod.season === selectedSeason;
    const matchesCategory = selectedCategory === "all" || prod.categoryId === Number(selectedCategory);

    return matchesSearch && matchesBrand && matchesGender && matchesSeason && matchesCategory;
  });

  const hasPromotions = products.some(p => p.isPromotion || (p.oldPrice && p.oldPrice > p.price));

  return {
    products,
    categories,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedBrand,
    setSelectedBrand,
    selectedGender,
    setSelectedGender,
    selectedSeason,
    setSelectedSeason,
    selectedCategory,
    setSelectedCategory,
    uniqueBrands,
    filteredProducts,
    hasPromotions,
  };
}
