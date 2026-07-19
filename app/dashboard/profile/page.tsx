"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProfile } from "@/hooks/useProfile";
import { UserIcon, EnvelopeIcon, PhotoIcon } from "@heroicons/react/24/solid";

export default function EditProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const { updateProfile, loading, error, success } = useProfile();

  // États locaux du formulaire synchronisés avec votre schéma Prisma
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");

  // Pré-remplir le formulaire dès que la session utilisateur est chargée
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setImage(session.user.image || "");
      // Si vous avez récupéré la bio depuis une API ou étendu le JWT, ajoutez-la ici :
      // setBio((session.user as any).bio || "");
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Appel de votre hook personnalisé 'useProfile' vers l'API PUT /api/user/profile
      await updateProfile({ name, email, image, bio });

      // 2. IMPORTANT : Met à jour instantanément les données du client (ex: le nom et l'image dans la Nav Bar)
      if (updateSession) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name,
            email,
            image,
          },
        });
      }
    } catch (err) {
      // Les erreurs de communication réseau ou Prisma sont déjà gérées par votre hook useProfile
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Modifier mon profil</h2>
        <p className="text-sm text-gray-500 mt-1">Mettez à jour vos informations personnelles visibles sur votre compte.</p>
      </div>
      
      <form onSubmit={handleUpdate} className="space-y-5" noValidate>
        {/* Messages d'état */}
        {success && (
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 font-medium border border-green-100">
            ✓ Profil mis à jour avec succès ! Les modifications ont été appliquées à votre session.
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 font-medium border border-red-100">
            {error}
          </div>
        )}
        
        {/* Aperçu rapide de la photo de profil actuelle */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-2">
          <img
            src={image || "https://unsplash.com"}
            alt="Aperçu"
            className="h-16 w-16 rounded-full object-cover border-2 border-indigo-500/20 shadow-xs"
          />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{name || "Utilisateur"}</h4>
            <p className="text-xs text-gray-500">{email || "Pas d'adresse email renseignée"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Champ Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-gray-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all"
                placeholder="Votre nom"
              />
            </div>
          </div>

          {/* Champ Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-gray-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all"
                placeholder="adresse@exemple.com"
              />
            </div>
          </div>
        </div>

        {/* Champ URL de l'image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lien de la photo de profil (URL)</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <PhotoIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-gray-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all"
              placeholder="https://exemple.com"
            />
          </div>
        </div>

        {/* Champ Biographie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 py-2.5 px-3 text-gray-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all"
            rows={4}
            placeholder="Parlez-nous un peu de vous..."
          />
        </div>

        {/* Bouton de validation de l'édition */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? "Sauvegarde en cours..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
