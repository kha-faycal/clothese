"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import ProductsTable from "@components/ProductsTable"
import ProductForm from "@components/ProductForm"

export interface Variant {
  color: string; size: string; sku: string; barcode: string;
  price: string; stock: string; weight: string; image: string[];
}

export interface Attribute { name: string; value: string; }
export interface Category { id: string | number; name?: string; Name?: string; }
export interface Product {
  id: number; name?: string; Name?: string;
  brand?: string; Brand?: string; gender?: string;
  variants?: Variant[]; Variants?: Variant[];
}

export default function ProductsManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([]) 
  const [showForm, setShowForm] = useState(false)

  const [product, setProduct] = useState({
    name: "", description: "", brand: "", gender: "men", season: "", categoryId: "",
  })
  const [variants, setVariants] = useState<Variant[]>([
    { color: "", size: "", sku: "", barcode: "", price: "", stock: "", weight: "", image: [] }
  ])
  const [attributes, setAttributes] = useState<Attribute[]>([{ name: "", value: "" }])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const filteredAttributes = attributes.filter(attr => attr.name && attr.value)
    const payload = {
      ...product,
      slug: product.name.toLowerCase().replace(/\s+/g, "-"),
      variants,
      attributes: filteredAttributes
    }

    toast.promise(
      async () => {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Server error")
        
        if (result.product) setProducts((prev) => [...prev, result.product])

        // Reset All
        setProduct({ name: "", description: "", brand: "", gender: "men", season: "", categoryId: "" })
        setVariants([{ color: "", size: "", sku: "", barcode: "", price: "", stock: "", weight: "", image: [] }])
        setAttributes([{ name: "", value: "" }])
        setShowForm(false)
        return result
      },
      {
        loading: "Création du produit en cours...",
        success: "Produit créé avec succès !",
        error: (err) => `Erreur: ${err.message}`,
      }
    )
  }

      return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full antialiased bg-black text-white rounded-xl shadow-lg flex flex-col gap-6">
      
      {/* Container d'en-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Produits</h2>
          <p className="text-sm text-gray-400">Gérez vos articles, stocks et variantes e-commerce.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md cursor-pointer ${
            showForm ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {showForm ? "Fermer le formulaire" : "Ajouter un produit"}
        </button>
      </div>     

      {/* Clean Vertical Layout Stack */}
      <div className="flex flex-col gap-8 w-full">
        
        {/* 1. Products Table shows on top, always full width */}
        <div className="w-full">
          {/* We set hideDetails to false so you can always see all columns when it is on top */}
          <ProductsTable products={products} hideDetails={false} />
        </div>

        {/* 2. The Input Form opens smoothly directly under the table */}
        {showForm && (
          <div className="w-full animate-in slide-in-from-top-4 duration-300 ease-out">
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
