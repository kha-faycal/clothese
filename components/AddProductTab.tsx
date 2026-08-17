"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function AddProductTab() {
  // 1. Informations générales du produit adaptées au nouveau schéma
  const [productInfo, setProductInfo] = useState({
    name: "",
    slug: "",
    description: "",
    brand: "",
    type: "CLOTHES", // Par défaut : Vêtements (CLOTHES, PERFUME, COSMETICS)
    gender: "men",
    season: "AllSeason",
    categoryId: "",
  });

  // 2. Tableau dynamique des variantes du produit
  const [variants, setVariants] = useState<any[]>([
    { color: "", size: "", sku: "", barcode: "", price: "", stock: "", weight: "", image: [] }
  ]);

  // 3. Tableau dynamique des attributs spécifiques (Spécifications techniques)
  const [attributes, setAttributes] = useState<any[]>([
    { name: "", value: "" }
  ]);

  // --- Gestion des événements de variantes ---
  const addVariantRow = () => {
    setVariants([...variants, { color: "", size: "", sku: "", barcode: "", price: "", stock: "", weight: "", image: [] }]);
  };

  const removeVariantRow = (index: number) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // --- Gestion des événements d'attributs ---
  const addAttributeRow = () => {
    setAttributes([...attributes, { name: "", value: "" }]);
  };

  const removeAttributeRow = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, field: "name" | "value", value: string) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  // --- Soumission du formulaire global ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Nettoyer les attributs vides avant envoi
    const filteredAttributes = attributes.filter(attr => attr.name.trim() && attr.value.trim());

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productInfo,
          variants,
          attributes: filteredAttributes
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert("Produit catalogue enregistré avec succès !");
      
      // Réinitialisation des états après succès
      setProductInfo({
        name: "", slug: "", description: "", brand: "",
        type: "CLOTHES", gender: "men", season: "AllSeason", categoryId: ""
      });
      setVariants([{ color: "", size: "", sku: "", barcode: "", price: "", stock: "", weight: "", image: [] }]);
      setAttributes([{ name: "", value: "" }]);

    } catch (err: any) {
      alert(`Erreur : ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-zinc-200">
      
      {/* SECTION A : INFORMATIONS GÉNÉRALES */}
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">1. Informations Catalogue</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Nom du produit</label>
            <input
              type="text" required
              value={productInfo.name}
              onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
              placeholder="Ex: Eau de Parfum Prestige"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Slug URL unique</label>
            <input
              type="text" required
              value={productInfo.slug}
              onChange={(e) => setProductInfo({ ...productInfo, slug: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
              placeholder="ex: eau-de-parfum-prestige"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Nature du produit (Type)</label>
            <select
              value={productInfo.type}
              onChange={(e) => setProductInfo({ ...productInfo, type: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
            >
              <option value="CLOTHES">👕 Vêtements (Clothes)</option>
              <option value="PERFUME">✨ Parfums (Perfume)</option>
              <option value="COSMETICS">💄 Cosmétiques (Cosmetics)</option>
            </select>
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
              placeholder="Ex: Chanel"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">ID Catégorie</label>
            <input
              type="number" required
              value={productInfo.categoryId}
              onChange={(e) => setProductInfo({ ...productInfo, categoryId: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
              placeholder="Ex: 5"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Genre</label>
            <select
              value={productInfo.gender}
              onChange={(e) => setProductInfo({ ...productInfo, gender: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500"
            >
              <option value="men">Homme (men)</option>
              <option value="women">Femme (women)</option>
              <option value="kids">Enfant (kids)</option>
              <option value="unisex">Unisexe / Mixte (unisex)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Saison</label>
            <select
              value={productInfo.season}
              disabled={productInfo.type !== "CLOTHES"}
              onChange={(e) => setProductInfo({ ...productInfo, season: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:border-indigo-500 disabled:opacity-40"
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
            placeholder="Notes de fond, conseils d'utilisation..."
          />
        </div>
      </div>

      {/* SECTION B : GESTION DYNAMIQUE DES VARIANTES */}
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
            2. Déclinaisons & stocks (Variants)
          </h4>
          <button
            type="button"
            onClick={addVariantRow}
            className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-xs px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" /> Ajouter une variante
          </button>
        </div>

        <div className="space-y-3 overflow-x-auto no-scrollbar">
          <div className="min-w-[1100px] flex flex-col gap-2">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-2 items-center bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                
                <div className="w-1/8">
                  <input
                    type="text"
                    placeholder={productInfo.type === "COSMETICS" ? "Teinte (N°02)" : "Couleur (Rouge)"}
                    required={productInfo.type !== "PERFUME"}
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                                {/* 1. Taille ou Volume (Contenance) */}
                <div className="w-1/12">
                  <input
                    type="text"
                    placeholder={productInfo.type === "CLOTHES" ? "Taille (XL)" : "Volume (100ml)"}
                    required
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                {/* 2. SKU Unique */}
                <div className="w-1/6">
                  <input
                    type="text" 
                    placeholder="SKU Unique" 
                    required
                    value={variant.sku} 
                    onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                {/* 3. Code-barre */}
                <div className="w-1/6">
                  <input
                    type="text" 
                    placeholder="Code-barre"
                    value={variant.barcode} 
                    onChange={(e) => handleVariantChange(index, "barcode", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                {/* 4. Prix (DZD) */}
                <div className="w-1/12">
                  <input
                    type="number" 
                    placeholder="Prix (DZD)" 
                    required
                    value={variant.price} 
                    onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                {/* 5. Stock */}
                <div className="w-1/12">
                  <input
                    type="number" 
                    placeholder="Stock" 
                    required
                    value={variant.stock} 
                    onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                {/* 6. Poids (kg) */}
                <div className="w-1/12">
                  <input
                    type="text" 
                    placeholder="Poids (kg)" 
                    required
                    value={variant.weight} 
                    onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                {/* 7. Bouton Supprimer la Variante */}
                <button
                  type="button"
                  onClick={() => removeVariantRow(index)}
                  disabled={variants.length === 1}
                  className="bg-red-950/40 text-red-500 border border-red-900/40 hover:bg-red-900 hover:text-white rounded p-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION C : ATTRIBUTS ET SPÉCIFICATIONS TECHNIQUES */}
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">3. Spécifications & Attributs</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Ex: concentration = Eau de Parfum | skin_type = Peau grasse</p>
          </div>
          <button
            type="button"
            onClick={addAttributeRow}
            className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-xs px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" /> Ajouter un attribut
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {attributes.map((attr, index) => (
            <div key={index} className="flex gap-2 items-center bg-zinc-900 p-2 rounded-lg border border-zinc-800">
              <input
                type="text"
                placeholder="Propriété (ex: concentration)"
                value={attr.name}
                onChange={(e) => handleAttributeChange(index, "name", e.target.value)}
                className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
              />
              <input
                type="text"
                placeholder="Valeur (ex: Eau de Toilette)"
                value={attr.value}
                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => removeAttributeRow(index)}
                className="bg-red-950/40 text-red-500 border border-red-900/40 hover:bg-red-900 hover:text-white rounded p-1.5 transition-colors cursor-pointer"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BOUTON DE SOUMISSION FINAL */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-lg shadow-md transition-all cursor-pointer text-sm"
        >
          Créer le produit catalogue
        </button>
      </div>
    </form>
  );
}
