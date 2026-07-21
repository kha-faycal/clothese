"use client"
import { useState } from "react"
import { User } from "@components/dashboard/UsersManager"
import { toast } from "sonner"
import { useSession } from "next-auth/react" // 👈 Importez le hook de session

interface UsersTableProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function UsersTable({ users, setUsers }: UsersTableProps) {
  const { data: session } = useSession() // 👈 Recuperez la session cliente
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: "", email: "" })

  const startEditing = (user: User) => {
    setEditingId(user.id)
    setEditForm({ name: user.name || "", email: user.email || "" })
  }

  const cancelEditing = () => setEditingId(null)

  const saveAction = async (id: string) => {
    toast.promise(
      async () => {
        const res = await fetch("/api/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, name: editForm.name, email: editForm.email }),
        })
        const result = await res.json()
        if (!res.ok) throw new Error(result.error || "Erreur serveur")
        
        setUsers((prev) => prev.map((u) => (u.id === id ? result.user : u)))
        setEditingId(null)
        return result
      },
      {
        loading: "Mise a jour...",
        success: "Utilisateur mis a jour !",
        error: (err) => `Erreur: ${err.message}`
      }
    )
  }

  const deleteAction = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return

    toast.promise(
      async () => {
        // 💡 Assurez-vous que l'URL construite correspond a votre route (ex: /api/users?id=XYZ)
        const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" })
        const result = await res.json()
        if (!res.ok) throw new Error(result.error || "Erreur serveur")
        
        setUsers((prev) => prev.filter((u) => u.id !== id))
        return result
      },
      {
        loading: "Suppression de l utilisateur...",
        success: "Utilisateur supprime !",
        error: (err) => `Erreur: ${err.message}`
      }
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800 bg-zinc-950">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-900 border-b border-gray-800 text-gray-400 uppercase text-xs tracking-wider">
            <th className="px-6 py-4">Avatar</th>
            <th className="px-6 py-4">Nom</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Statut</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 text-sm text-gray-200">
          {users.length > 0 ? (
            users.map((u) => {
              // 👈 Verifier si la ligne courante est celle de la session active
              const isCurrentUser = session?.user?.email?.toLowerCase() === u.email?.toLowerCase()

              return (
                <tr key={u.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4">
                    {u.image ? (
                      <img src={u.image} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-700" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-gray-300 border border-gray-700">
                        {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    {editingId === u.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="px-2 py-1 bg-zinc-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:ring-1"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        {u.name || <span className="text-gray-600 italic">Sans nom</span>}
                        {isCurrentUser && <span className="text-[10px] bg-zinc-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">Moi</span>}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {editingId === u.id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="px-2 py-1 bg-zinc-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:ring-1"
                      />
                    ) : (
                      u.email
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      u.emailVerified 
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/60" 
                        : "bg-amber-950/40 text-amber-400 border-amber-800/60"
                    }`}>
                      {u.emailVerified ? "Verifie" : "En attente"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    {editingId === u.id ? (
                      <>
                        <button onClick={() => saveAction(u.id)} className="px-3 py-1.5 rounded text-xs bg-white text-black font-semibold cursor-pointer">Sauvegarder</button>
                        <button onClick={cancelEditing} className="px-3 py-1.5 rounded text-xs bg-zinc-800 text-gray-300 cursor-pointer">Annuler</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(u)} className="px-3 py-1.5 rounded text-xs border border-gray-700 text-gray-300 hover:bg-zinc-800 cursor-pointer">Modifier</button>
                        
                        {/* 💡 Condition : N'affiche le bouton supprimer QUE si ce n'est pas votre propre compte */}
                        {!isCurrentUser ? (
                          <button onClick={() => deleteAction(u.id)} className="px-3 py-1.5 rounded text-xs bg-red-950/40 border border-red-900 text-red-400 hover:bg-red-900 hover:text-white cursor-pointer">
                            Supprimer
                          </button>
                        ) : (
                          <span className="text-xs text-gray-600 italic px-3 py-1.5 inline-block select-none">
                            Protege
                          </span>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Aucun utilisateur enregistre.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
