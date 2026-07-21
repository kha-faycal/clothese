"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import UsersTable from "@components/UsersTable"
import UserForm from "@components/UserForm"

export interface Account {
  id: string;
  provider: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null; // ISO Date string depuis l'API
  image: string | null;
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]) 
  const [showForm, setShowForm] = useState(false)

  // Formulaire calqué sur votre modèle Prisma
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    isVerified: false // Permet de pré-valider l'email à la création si désiré
  })

  // Charger les utilisateurs au montage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/users")
        if (response.ok) {
          const data = await response.json()
          setUsers(Array.isArray(data) ? data : data.users || [])
        }
      } catch (err) {
        console.error("Error loading users dashboard:", err)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    toast.promise(
      async () => {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Server error")
        
        if (result.user) setUsers((prev) => [...prev, result.user])

        // Reset global
        setUser({ name: "", email: "", password: "", image: "", isVerified: false })
        setShowForm(false)
        return result
      },
      {
        loading: "Création de l'utilisateur en cours...",
        success: "Utilisateur créé avec succès !",
        error: (err) => `Erreur: ${err.message}`,
      }
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full antialiased bg-black text-white rounded-xl shadow-lg flex flex-col gap-6">
      
      {/* Container d'en-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h2>
          <p className="text-sm text-gray-400">Gérez vos clients, comptes d'authentification et accès.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md cursor-pointer ${
            showForm ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {showForm ? "Fermer le formulaire" : "Ajouter un utilisateur"}
        </button>
      </div>     

      {/* Disposition verticale empilée */}
      <div className="flex flex-col gap-8 w-full">
        
        {/* 1. Tableau affiché en haut sur toute la largeur */}
        <div className="w-full">
          <UsersTable users={users} setUsers={setUsers} />
        </div>

        {/* 2. Le formulaire s'ouvre sous le tableau avec animation */}
        {showForm && (
          <div className="w-full animate-in slide-in-from-top-4 duration-300 ease-out">
            <UserForm 
              user={user} 
              setUser={setUser}
              handleSubmit={handleSubmit}
            />
          </div>
        )}

      </div>
    </div>
  )
}
