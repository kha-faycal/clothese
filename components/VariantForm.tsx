"use client"
import { toast } from "sonner"
import { Variant } from "../components/dashboard/ProductsManager"

interface VariantFormProps {
  variants: Variant[]; 
  setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
}

export default function VariantForm({ variants, setVariants }: VariantFormProps) {
  
  // 🔴 FIX: Conversion automatique des types (Number pour price, stock, weight)
  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const updated = [...variants]
    
    let processedValue = value;
    if (field === "price" || field === "weight") {
      processedValue = value === "" ? "" : parseFloat(value);
    } else if (field === "stock") {
      processedValue = value === "" ? "" : parseInt(value, 10);
    }

    updated[index] = { ...updated[index], [field]: processedValue }
    setVariants(updated)
  }

  const handleVariantImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    toast.promise(
      async () => {
        const res = await fetch("/api/upload-product", { method: "POST", body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error uploading images")
        
        const updated = [...variants]
        updated[index].image = [...(updated[index].image || []), ...data.urls]
        setVariants(updated)
        return data
      },
      {
        loading: `Téléchargement de ${files.length} image(s)...`,
        success: "Images prêtes !",
        error: "Échec de l'envoi",
      }
    )
  }

  const setDefaultImage = (variantIndex: number, imageIndex: number) => {
    const updated = [...variants]
    const currentImages = [...(updated[variantIndex].image || [])]
    
    if (imageIndex === 0 || currentImages.length === 0) return

    const selectedImage = currentImages.splice(imageIndex, 1)[0]
    currentImages.unshift(selectedImage)
    
    updated[variantIndex].image = currentImages
    setVariants(updated)
    toast.success("Image principale mise à jour !")
  }

  const deleteImage = (variantIndex: number, imageIndex: number) => {
    const updated = [...variants]
    updated[variantIndex].image = (updated[variantIndex].image || []).filter((_, i) => i !== imageIndex)
    setVariants(updated)
    toast.info("Image retirée")
  }

  // 🔴 FIX: Action indispensable pour ajouter un bloc variante vide au tableau
  const addEmptyVariant = () => {
    const newVariant: Variant = {
      color: "",
      size: "",
      price: 0,
      stock: 0,
      sku: "",
      barcode: "",
      weight: 0,
      image: []
    } as unknown as Variant; // Fallback selon la stricte définition de votre type Variant
    
    setVariants([...variants, newVariant])
    toast.success("Nouvelle variante ajoutée")
  }

  // 🔴 FIX: Supprimer une variante entière de la liste
  const removeVariant = (indexToRemove: number) => {
    setVariants(variants.filter((_, i) => i !== indexToRemove))
    toast.info("Variante supprimée")
  }

  return (
  <div className="border-b border-gray-700 pb-6 text-right" dir="rtl">
    
    {/* En-tête avec bouton d'ajout */}
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-white">2. متغيرات المنتج (Variantes du Produit)</h3>
      <button
        type="button"
        onClick={addEmptyVariant}
        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
      >
        + إضافة خيار / variante
      </button>
    </div>

    <div className="flex flex-col gap-4">
      {variants.length === 0 ? (
        <div className="text-center py-6 text-gray-500 border border-dashed border-gray-800 rounded-xl bg-gray-950/30 text-sm">
          لا توجد متغيرات حالياً. انقر فوق زر الإضافة في الأعلى.
        </div>
      ) : (
        variants.map((variant, index) => (
          <div key={index} className="p-4 rounded-xl border border-gray-800 bg-gray-950 flex flex-col gap-3 relative group/card">
            
            {/* Bouton de suppression de la variante complète */}
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="absolute top-3 left-3 text-gray-500 hover:text-red-500 text-sm transition-colors"
              title="Supprimer la variante"
            >
              ✕ Supprimer
            </button>

            {/* Inputs de la variante */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-6">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 mr-1">اللون (Couleur)</label>
                <input type="text" placeholder="Ex: Rouge" value={variant.color || ""} onChange={(e) => handleVariantChange(index, "color", e.target.value)} className="px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-700 text-white text-center outline-none focus:border-gray-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 mr-1">المقاس (Taille)</label>
                <input type="text" placeholder="Ex: XL" value={variant.size || ""} onChange={(e) => handleVariantChange(index, "size", e.target.value)} className="px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-700 text-white text-center outline-none focus:border-gray-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 mr-1">السعر (Prix DZD)</label>
                <input type="number" placeholder="0.00" value={variant.price ?? ""} onChange={(e) => handleVariantChange(index, "price", e.target.value)} className="px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-700 text-white text-center outline-none focus:border-gray-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 mr-1">المخزون (Stock)</label>
                <input type="number" placeholder="0" value={variant.stock ?? ""} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} className="px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-700 text-white text-center outline-none focus:border-gray-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 mr-1">رمز SKU</label>
                <input type="text" placeholder="SKU-XYZ" value={variant.sku || ""} onChange={(e) => handleVariantChange(index, "sku", e.target.value)} className="px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-700 text-white text-center outline-none focus:border-gray-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 mr-1">الكود بار (Barcode)</label>
                <input type="text" placeholder="Barcode" value={variant.barcode || ""} onChange={(e) => handleVariantChange(index, "barcode", e.target.value)} className="px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-700 text-white text-center outline-none focus:border-gray-500" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 mr-1">الوزن (Poids kg)</label>
                <input type="number" step="0.01" placeholder="0.0" value={variant.weight ?? ""} onChange={(e) => handleVariantChange(index, "weight", e.target.value)} className="px-2 py-1.5 text-sm rounded bg-gray-900 border border-gray-700 text-white text-center outline-none focus:border-gray-500" />
              </div>
            </div>

            {/* Zone Téléchargement d'images */}
            <div className="flex flex-col gap-2 border-t border-gray-900 pt-3">
              <label className="text-xs text-gray-400">صور المنتج (Sélectionnez les images) :</label>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <input type="file" accept="image/*" multiple onChange={(e) => handleVariantImageUpload(index, e)} className="text-xs text-gray-400 file:bg-gray-900 file:text-white file:border-gray-700 file:rounded file:px-3 file:py-1.5 cursor-pointer" />
                
                <div className="flex flex-wrap gap-3">
                  {variant.image?.map((imgUrl, imgIndex) => {
                    const isDefault = imgIndex === 0;
                    return (
                      <div key={imgIndex} className="relative group cursor-pointer">
                        <img 
                          src={imgUrl} 
                          onClick={() => setDefaultImage(index, imgIndex)}
                          alt="Thumbnail"
                          className={`w-14 h-14 object-cover rounded-lg border shadow-md transition-all ${isDefault ? "border-green-500 ring-2 ring-green-500/30 scale-105" : "border-gray-700 hover:border-white"}`} 
                        />
                        {isDefault && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[9px] font-extrabold px-1 rounded-full shadow">
                            ★
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); deleteImage(index, imgIndex); }}
                          className="absolute -bottom-1 -left-1 bg-red-600 text-white text-[9px] rounded-md px-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  </div>
);
}