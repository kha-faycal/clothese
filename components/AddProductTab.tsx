"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function AddProductTab() {
  // 1. Informations générales du produit
  const [productInfo, setProductInfo] = useState({
    name: "",
    slug: "",
    description: "",
    brand: "",
    gender: "men",
    season: "AllSeason",
    categoryId: "",
  });

  // 2. Tableau dynamique des variantes du produit
  const [variants, setVariants] = useState<any[]>([
    { color: "", size: "", sku: "", barcode: "", price: "", stock: "", weight: "", image: [] }
  ]);

  // Ajouter une ligne de variante vide
  const addVariantRow = () => {
    setVariants([...variants, { color: "", size: "", sku: "", barcode: "", price: "", stock: "", weight: "", image: [] }]);
  };

  // Supprimer une ligne de variante
  const removeVariantRow = (index: number) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Mettre à jour un champ spécifique d'une variante précise
  const handleVariantChange = (index: number, field: string, value: string) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productInfo,
          variants,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert("Produit catalogue enregistré avec succès !");
      // Réinitialisation optionnelle des états ici
    } catch (err: any) {
      alert(`Erreur : ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-zinc-200">
      
      {/* SECTION A : INFORMATIONS GÉNÉRALES */}
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">1. Informations Catalogue</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Nom du vêtement</label>
            <input
              type="text" required
              value={productInfo.name}
              onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
              placeholder="Ex: T-Shirt Graphic Vintage"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Slug URL unique (Minuscules et tirets)</label>
            <input
              type="text" required
              value={productInfo.slug}
              onChange={(e) => setProductInfo({ ...productInfo, slug: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
              placeholder="ex: t-shirt-graphic-vintage"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Marque</label>
            <input
              type="text" required
              value={productInfo.brand}
              onChange={(e) => setProductInfo({ ...productInfo, brand: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
              placeholder="Ex: Nike"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">ID Catégorie Prisma</label>
            <input
              type="number" required
              value={productInfo.categoryId}
              onChange={(e) => setProductInfo({ ...productInfo, categoryId: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
              placeholder="Ex: 2"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Genre (Enum)</label>
            <select
              value={productInfo.gender}
              onChange={(e) => setProductInfo({ ...productInfo, gender: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
            >
              <option value="men">Homme (men)</option>
              <option value="women">Femme (women)</option>
              <option value="kids">Enfant (kids)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Saison (Enum)</label>
            <select
              value={productInfo.season}
              onChange={(e) => setProductInfo({ ...productInfo, season: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
            >
              <option value="AllSeason">Toutes Saisons</option>
              <option value="Summer">Été (Summer)</option>
              <option value="Winter">Hiver (Winter)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Description éditoriale</label>
          <textarea
            rows={2}
            value={productInfo.description}
            onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
            placeholder="Composition du tissu, conseils de lavage..."
          />
        </div>
      </div>

      {/* SECTION B : GESTION DYNAMIQUE DES VARIANTES (TAILLES / COULEURS) */}
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">2. Déclinaisons de tailles & stocks (Variants)</h4>
          <button
            type="button"
            onClick={addVariantRow}
            className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-xs px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" /> Ajouter une variante
          </button>
        </div>

        <div className="space-y-3 overflow-x-auto">
          {variants.map((variant, index) => (
            <div key={index} className="flex gap-2 items-center min-w-[900px] bg-zinc-900 p-3 rounded-lg border border-zinc-800">
              
              <input
                type="text" placeholder="Couleur (ex: Rouge)" required
                value={variant.color} onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                className="w-1/8 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100"
              />
              <input
                type="text" placeholder="Taille (ex: XL)" required
                value={variant.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                className="w-1/12 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100"
              />
              <input
                type="text" placeholder="SKU Unique" required
                value={variant.sku} onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                className="w-1/6 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100"
              />
              <input
                type="text" placeholder="Code-barre" required
                value={variant.barcode} onChange={(e) => handleVariantChange(index, "barcode", e.target.value)}
                className="w-1/6 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100"
              />
              <input
                type="number" step="0.01" placeholder="Prix" required
                value={variant.price} onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                className="w-1/12 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100"
              />
              <input
                type="number" placeholder="Stock" required
                value={variant.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                className="w-1/12 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100"
              />
              <input
                type="number" step="0.01" placeholder="Poids (kg)" required
                value={variant.weight} onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                className="w-1/12 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100"
              />

              <button
                type="button"
                disabled={variants.length === 1}
                onClick={() => removeVariantRow(index)}
                className="text-red-400 hover:text-red-500 p-1 disabled:opacity-30 cursor-pointer"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BOUTON GLOBAL SOUUMISSION */}
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Enregistrer le produit et ses variantes 
        </button>
    </form>
  );
}