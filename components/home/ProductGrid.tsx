"use client";
import React from "react";
import ProductCard from "@/components/ProductCard";

interface ProductGridProps {
  products: any[];
  loading: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  // 1. État de chargement (Squelettes)
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border border-border/60 rounded-2xl p-3 flex flex-col gap-3 animate-pulse bg-secondary/10">
            <div className="w-full aspect-square bg-secondary/60 rounded-xl" />
            <div className="h-4 bg-secondary/60 rounded w-3/4 mt-1" />
            <div className="h-3 bg-secondary/40 rounded w-1/2" />
            <div className="flex justify-between items-center mt-2">
              <div className="h-4 bg-secondary/60 rounded w-16" />
              <div className="h-8 bg-secondary/60 rounded-lg w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. État vide (Aucun produit trouvé)
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-secondary/10 border border-border border-dashed rounded-2xl">
        <p className="text-xs text-muted">لا توجد منتجات تطابق خيارات التصفية الحالية.</p>
      </div>
    );
  }

  // 3. Rendu normal des produits
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
