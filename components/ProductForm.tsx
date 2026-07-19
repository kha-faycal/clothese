"use client"

import { useEffect } from "react"
import VariantForm from "./VariantForm"
import AttributeForm from "./AttributeForm"
import { Variant, Attribute, Category } from "../components/dashboard/ProductsManager"

interface ProductFormProps {
  product: any; 
  setProduct: React.Dispatch<React.SetStateAction<any>>;
  categories: Category[];
  variants: Variant[]; 
  setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
  attributes: Attribute[]; 
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function ProductForm({
  product, setProduct, categories,
  variants, setVariants, attributes, setAttributes, handleSubmit
}: ProductFormProps) {

  // Auto-generate Slug instantly whenever the user modifies the product Name string
  useEffect(() => {
    if (product?.name) {
      const generatedSlug = product.name
        .toLowerCase()
        .trim()
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      
      setProduct((prev: any) => ({ ...prev, slug: generatedSlug }));
    } else {
      setProduct((prev: any) => ({ ...prev, slug: "" }));
    }
  }, [product?.name, setProduct]);

  return (
    <form onSubmit={handleSubmit} className="bg-gray-950 p-6 rounded-xl border border-gray-800 shadow-lg flex flex-col gap-6 w-full text-white text-right" dir="rtl">
      
      <div className="border-b border-gray-800 pb-6">
        <h3 className="text-lg font-bold text-white mb-4">1. معلومات عامة (Informations Générales)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase">اسم المنتج (Nom)</label>
            <input
              type="text" required placeholder="Ex: T-Shirt Premium" value={product?.name || ""}
              // 🔴 FIX: Safe functional state updating
              onChange={(e) => setProduct((prev: any) => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase">رابط ثابت تلقائي (Slug Auto)</label>
            <input
              type="text" disabled placeholder="auto-generated-slug" value={product?.slug || ""}
              className="px-3 py-2 text-sm rounded-lg bg-gray-900/40 border border-gray-800 text-gray-500 font-mono outline-none cursor-not-allowed select-none"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase">الماركة (Marque)</label>
            <input
              type="text" placeholder="Ex: Nike, Zara..." value={product?.brand || ""}
              onChange={(e) => setProduct((prev: any) => ({ ...prev, brand: e.target.value }))}
              className="px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase">الفئة (Catégorie)</label>
            <select
              required value={product?.categoryId || ""}
              onChange={(e) => setProduct((prev: any) => ({ ...prev, categoryId: e.target.value }))}
              className="px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-gray-900 text-gray-500">Sélectionner...</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-gray-900">
                  {cat.name || cat.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase">الجنس (Genre)</label>
            <select
              value={product?.gender || "men"}
              onChange={(e) => setProduct((prev: any) => ({ ...prev, gender: e.target.value }))}
              className="px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none appearance-none cursor-pointer"
            >
              <option value="men" className="bg-gray-900">Homme</option>
              <option value="women" className="bg-gray-900">Femme</option>
              <option value="kids" className="bg-gray-900">Enfant</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase">الموسم (Saison Dropdown)</label>
            <select
              value={product?.season || ""}
              onChange={(e) => setProduct((prev: any) => ({ ...prev, season: e.target.value || null }))}
              className="px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-gray-900 text-gray-500">Aucune saison</option>
              <option value="Summer" className="bg-gray-900">الصيف (Summer)</option>
              <option value="Winter" className="bg-gray-900">الشتاء (Winter)</option>
              <option value="AllSeason" className="bg-gray-900">كل الفصول (All Season)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase">الوصف (Description)</label>
          <textarea
            placeholder="Détails du produit..." value={product?.description || ""}
            onChange={(e) => setProduct((prev: any) => ({ ...prev, description: e.target.value }))}
            className="px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none h-20 resize-none"
          />
        </div>
      </div>

      <VariantForm variants={variants} setVariants={setVariants} />
      <AttributeForm attributes={attributes} setAttributes={setAttributes} />

      <button type="submit" className="bg-white text-black font-semibold text-lg px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors mt-2 cursor-pointer w-full text-center">
        حفظ المنتج (Enregistrer le Produit)
      </button>
    </form>
  )
}
