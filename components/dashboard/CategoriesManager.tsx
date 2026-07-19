"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner" // 👈 Import Sonner directly
import CategoryTable from "@components/CategoryTable"
import CategoryForm from "@components/CategoryForm"

export interface Category {
  id: number
  name: string
  description: string
  image?: string[]
  parentId?: string | null
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)

  const [createCategory, setCreateCategory] = useState({
    name: "",
    description: "",
    imageUrl: "",
    parentId: ""
  })

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categories")
      if (!response.ok) return
      const data = await response.json()

      const formatted = data.map((cat: any) => ({
        id: cat.id,
        name: cat.Name,
        description: cat.Description,
        image: cat.image,
        parentId: cat.ParentId,
      }))

      setCategories(formatted)
    }
    fetchCategories()
  }, [])

  // Refactored file upload with reactive loading feedback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    // Using toast.promise automatically handles loading, success, and error states elegantly
    toast.promise(
      async () => {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Échec de l'envoi")
        
        setCreateCategory((prev) => ({ ...prev, imageUrl: data.url }))
        return data
      },
      {
        loading: "Téléchargement de l'image en cours...",
        success: "Image téléchargée avec succès !",
        error: (err) => `Erreur d'upload: ${err.message}`,
      }
    )
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    toast.promise(
      async () => {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: createCategory.name,
            description: createCategory.description,
            image: createCategory.imageUrl ? [createCategory.imageUrl] : [],
            slug: createCategory.name.toLowerCase().replace(/\s+/g, "-"),
            parentId: createCategory.parentId || null
          }),
        })

        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Erreur serveur")

        // Format raw database response cleanly to match state interface definitions
        const formattedNewCat: Category = {
          id: result.category.id,
          name: result.category.Name,
          description: result.category.Description,
          image: result.category.image,
          parentId: result.category.ParentId,
        }

        setCategories((prev) => [...prev, formattedNewCat])
        setCreateCategory({ name: "", description: "", imageUrl: "", parentId: "" })
        setShowForm(false)
        return result
      },
      {
        loading: "Création de la catégorie...",
        success: "Catégorie créée avec succès !",
        error: (err) => `Erreur: ${err.message}`,
      }
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full bg-[var(--background)] text-[var(--foreground)] rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--secondary)]">
          Liste des catégories
        </h2>
        <button
          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 shadow-md cursor-pointer ${
            showForm 
              ? "bg-[var(--border)] text-[var(--foreground)] hover:bg-gray-700" 
              : "bg-[var(--primary)] text-[var(--text)] hover:bg-red-700"
          }`}
          type="button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Fermer le formulaire" : "Ajouter une catégorie"}
        </button>
      </div>

      {/* Main Grid */}
      <div className={`grid grid-cols-1 gap-6 ${showForm ? "lg:grid-cols-3" : "grid-cols-1"}`}>
        {/* Table */}
        <div className={`overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-md ${showForm ? "lg:col-span-2" : "w-full"}`}>
          <CategoryTable categories={categories} />
        </div>

        {/* Form */}
        {showForm && (
          <CategoryForm
            createCategory={createCategory}
            setCreateCategory={setCreateCategory}
            handleSubmit={handleSubmit}
            handleFileUpload={handleFileUpload} // 👈 Safely passing down parent handler
            categories={categories}
          />
        )}
      </div>
    </div>
  )
}
