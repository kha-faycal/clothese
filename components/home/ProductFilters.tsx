import React from 'react';

interface Category {
  id: string | number;
  Name?: string;
  name?: string;
}

interface ProductFiltersProps {
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  uniqueBrands: string[];
  
  selectedGender: string;
  setSelectedGender: (value: string) => void;
  
  selectedSeason: string;
  setSelectedSeason: (value: string) => void;
  activeTab: string;
  
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  categories: Category[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedBrand,
  setSelectedBrand,
  uniqueBrands,
  selectedGender,
  setSelectedGender,
  selectedSeason,
  setSelectedSeason,
  activeTab,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  return (
    <>
      {/* فلتر الماركات */}
      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none w-full"
      >
        <option value="all">كل الماركات</option>
        {uniqueBrands
          .filter((b) => b !== "all")
          .map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
      </select>

      {/* فلتر الجنس */}
      <select
        value={selectedGender}
        onChange={(e) => setSelectedGender(e.target.value)}
        className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none w-full"
      >
        <option value="all">كل الفئات </option>
        <option value="men">رجال (Men)</option>
        <option value="women">نساء (Women)</option>
        <option value="kids">أطفال (Kids)</option>
        <option value="unisex">مشترك (Unisex)</option>
      </select>

      {/* فلتر الفصول */}
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

      {/* فلتر التصنيفات */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none w-full"
      >
        <option value="all">كل التصنيفات</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.Name || c.name}
          </option>
        ))}
      </select>
    </>
  );
};
