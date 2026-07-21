"use client"

interface UserFormProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function UserForm({ user, setUser, handleSubmit }: UserFormProps) {
  return (
    <form onSubmit={handleSubmit} className="p-6 bg-zinc-950 border border-gray-800 rounded-xl space-y-5">
      <h3 className="text-lg font-bold border-b border-gray-800 pb-2">Nouvel Utilisateur</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase">Nom complet</label>
          <input
            type="text"
            placeholder="Ex: Jane Doe"
            value={user.name}
            onChange={(e) => setUser({...user, name: e.target.value})}
            className="px-4 py-2 bg-zinc-900 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-white"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase">Adresse Email</label>
          <input
            type="email"
            required
            placeholder="Ex: jane@example.com"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            className="px-4 py-2 bg-zinc-900 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-white"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase">Mot de passe (Credentials)</label>
          <input
            type="password"
            placeholder="••••••••"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            className="px-4 py-2 bg-zinc-900 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-white"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase">Lien image / Avatar</label>
          <input
            type="url"
            placeholder="https://example.com"
            value={user.image}
            onChange={(e) => setUser({...user, image: e.target.value})}
            className="px-4 py-2 bg-zinc-900 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-lg border border-gray-800/80 w-fit">
        <input
          type="checkbox"
          id="isVerified"
          checked={user.isVerified}
          onChange={(e) => setUser({...user, isVerified: e.target.checked})}
          className="w-4 h-4 accent-white cursor-pointer"
        />
        <label htmlFor="isVerified" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
          Marquer l'email comme immédiatement vérifié (`emailVerified`)
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-200 transition-all shadow-md cursor-pointer"
        >
          Créer l'utilisateur
        </button>
      </div>
    </form>
  )
}
