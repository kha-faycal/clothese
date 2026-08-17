"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import ProductsTable from "@components/ProductsTable"
import ProductForm from "@components/ProductForm"

export interface Variant {
  id?: number; color: string; size: string; sku: string; barcode: string;
  price: string; stock: string; weight: string; image: string[];
}

export interface Attribute { name: string; value: string; }
export interface Category { id: string | number; name?: string; Name?: string; }
export interface Product {
  id: number; name?: string; Name?: string; type?: "CLOTHES" | "PERFUME" | "COSMETICS";
  description?: string; brand?: string; Brand?: string; gender?: string;
  season?: string; categoryId?: string | number;
  variants?: Variant[]; Variants?: Variant[];
  attributes?: Attribute[]; Attributes?: Attribute[];
}

const INITIAL_PRODUCT_STATE = {
  name: "", description: "", brand: "", type: "CLOTHES", gender: "men", season: "", categoryId: "",
}

const INITIAL_VARIANT_STATE = [
  { color: "", size: "", sku: "", barcode: "", price: "", stock: "", weight: "", image: [] }
]

const INITIAL_ATTRIBUTE_STATE = [{ name: "", value: "" }]

export default function ProductsManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([]) 
  const [showForm, setShowForm] = useState(false)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)

  const [product, setProduct] = useState(INITIAL_PRODUCT_STATE)
  const [variants, setVariants] = useState<Variant[]>(INITIAL_VARIANT_STATE)
  const [attributes, setAttributes] = useState<Attribute[]>(INITIAL_ATTRIBUTE_STATE)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCat, resProd] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products")
        ])
        if (resCat.ok) setCategories(await resCat.json())
        if (resProd.ok) {
          const data = await resProd.json()
          setProducts(Array.isArray(data) ? data : data.products || [])
        }
      } catch (err) {
        console.error("Error loading products dashboard:", err)
      }
    }
    fetchData()
  }, [])

  const handleEditTrigger = (prod: Product) => {
    setEditingProductId(prod.id)
    
    setProduct({
      name: prod.name || prod.Name || "",
      description: prod.description || "",
      brand: prod.brand || prod.Brand || "",
      type: prod.type || "CLOTHES",
      gender: prod.gender || "men",
      season: prod.season || "",
      categoryId: String(prod.categoryId || ""),
    })
    
    setVariants(prod.variants || prod.Variants || INITIAL_VARIANT_STATE)
    setAttributes(prod.attributes || prod.Attributes || INITIAL_ATTRIBUTE_STATE)
    setShowForm(true)
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return

    toast.promise(
      async () => {
        const response = await fetch(`/api/products?id=${id}`, { method: "DELETE" })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Server error")
        
        setProducts((prev) => prev.filter((p) => p.id !== id))
        if (editingProductId === id) handleCancelForm()
        return result
      },
      {
        loading: "Suppression du produit...",
        success: "Produit supprimé avec succès !",
        error: (err) => `Erreur: ${err.message}`,
      }
    )
  }

  const handleCancelForm = () => {
    setProduct(INITIAL_PRODUCT_STATE)
    setVariants(INITIAL_VARIANT_STATE)
    setAttributes(INITIAL_ATTRIBUTE_STATE)
    setEditingProductId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const filteredAttributes = attributes.filter(attr => attr.name && attr.value)
    
    const payload = {
      ...(editingProductId && { id: editingProductId }), // Clé ID ajoutée si modification
      ...product,
      // ✅ CORRECTION CRITIQUE : Cast explicite pour correspondre à l'énumération TypeScript
      type: product.type as "CLOTHES" | "PERFUME" | "COSMETICS",
      slug: product.name.toLowerCase().replace(/\s+/g, "-"),
      variants,
      attributes: filteredAttributes
    }

    const isEditing = editingProductId !== null
    const url = "/api/products"
    const method = isEditing ? "PUT" : "POST"

    toast.promise(
      async () => {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Server error")
        
        if (isEditing) {
          setProducts((prev) => prev.map((p) => p.id === editingProductId ? { ...p, ...payload } : p))
        } else if (result.product) {
          setProducts((prev) => [...prev, result.product])
        }

        handleCancelForm()
        return result
      },
      {
        loading: isEditing ? "Modification du produit..." : "Création du produit en cours...",
        success: isEditing ? "Produit modifié avec succès !" : "Produit créé avec succès !",
        error: (err) => `Erreur: ${err.message}`,
      }
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full antialiased bg-black text-white rounded-xl shadow-lg flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Produits</h2>
          <p className="text-sm text-gray-400">Gérez vos articles, stocks et variantes e-commerce.</p>
        </div>
        <button
          type="button"
          onClick={() => showForm ? handleCancelForm() : setShowForm(true)}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md cursor-pointer ${
            showForm ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {showForm ? "Annuler / Fermer" : "Ajouter un produit"}
        </button>
      </div>     

      <div className="flex flex-col gap-8 w-full">
        <div className="w-full">
          <ProductsTable 
            products={products} 
            hideDetails={false} 
            onEdit={handleEditTrigger}
            onDelete={handleDelete}
          />
        </div>

        {showForm && (
          <div className="w-full animate-in slide-in-from-top-4 duration-300 ease-out border border-gray-800 p-4 rounded-xl bg-gray-950">
            <h3 className="text-lg font-bold mb-4 text-gray-200">
              {editingProductId ? "📝 Mode Édition" : "✨ Nouveau Produit"}
            </h3>
            <ProductForm 
              product={product} 
              setProduct={setProduct}
              categories={categories}
              variants={variants} 
              setVariants={setVariants}
              attributes={attributes} 
              setAttributes={setAttributes}
              handleSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </div>
  )
}
