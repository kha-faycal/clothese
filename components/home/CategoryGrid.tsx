"use client";
import React from "react";
import Image from "next/image";

interface Category {
  id: string | number;
  Name?: string;
  name?: string;
  image?: string | string[];
  imageUrl?: string | string[];
}

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  loading: boolean; // 🟢 Ajout de la prop loading
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  loading,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-right">
        <h2 className="text-xl md:text-2xl font-black text-foreground">تصفح أقسام المتجر</h2>
        <p className="text-xs text-muted-foreground mt-1">اختر التصنيف لعرض المنتجات المتوفرة مباشرة</p>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 sm:overflow-visible">
        {loading ? (
          // 🟢 SQUELETTE D'ATTENTE DES CATÉGORIES (6 cercles animés clignotants)
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-2 min-w-[75px] shrink-0 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-secondary/60 border border-border/40" />
              <div className="h-3 bg-secondary/60 rounded w-14" />
            </div>
          ))
        ) : (
          <>
            {/* Bouton global "Toutes les catégories" */}
            <button
              onClick={() => setSelectedCategory("all")}
              className="flex flex-col items-center gap-2 group min-w-[75px] shrink-0 cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
                selectedCategory === "all" 
                  ? "border-primary bg-primary/10 scale-105 ring-4 ring-primary/20" 
                  : "border-border bg-secondary/30 group-hover:border-primary/50 group-hover:bg-secondary/60"
              }`}>
                <span className="text-xl">🛍️</span>
              </div>
              <span className={`text-xs font-bold transition-colors ${
                selectedCategory === "all" ? "text-primary font-black" : "text-foreground group-hover:text-primary"
              }`}>
                كل التصنيفات
              </span>
            </button>

            {/* Liste dynamique des catégories */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === String(cat.id);
              const imageField = cat.image || cat.imageUrl;
              const firstImage = Array.isArray(imageField) ? imageField[0] : imageField;
              const hasImage = typeof firstImage === 'string' && firstImage.trim().length > 0 ? firstImage : null;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(String(cat.id))}
                  className="flex flex-col items-center gap-2 group min-w-[75px] shrink-0 cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-full overflow-hidden relative border-2 transition-all duration-300 shadow-sm flex items-center justify-center bg-secondary/20 ${
                    isSelected 
                      ? "border-primary bg-primary/10 scale-105 ring-4 ring-primary/20" 
                      : "border-border group-hover:border-primary/50 group-hover:scale-102"
                  }`}>
                    {hasImage ? (
                      <Image 
                        src={hasImage} 
                        alt={cat.Name || cat.name || "Category"}
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-lg font-bold text-muted-foreground">
                        {(cat.Name || cat.name || "C").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-medium tracking-wide text-center truncate w-20 transition-colors ${
                    isSelected ? "text-primary font-black" : "text-muted-foreground group-hover:text-primary"
                  }`}>
                    {cat.Name || cat.name}
                  </span>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
