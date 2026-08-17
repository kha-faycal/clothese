"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { UserIcon, EnvelopeIcon, PhotoIcon, KeyIcon } from "@heroicons/react/24/solid";

export default function EditProfilePage() {
  const { data: session, update: updateSession } = useSession();
  
  // ✅ Utilisation de votre hook personnalisé réutilisable
  const { updateProfile, loading, error, success, setError } = useProfile();

  // États locaux pour les informations de base
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  // ✅ Nouveaux états locaux pour la modification du mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = session?.user?.id;
    if (!userId) {
      toast.error("خطأ في الجلسة", { description: "Session introuvable." });
      return;
    }

    // Validation de sécurité : vérification de la correspondance des nouveaux mots de passe
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("خطأ في كلمة المرور", { description: "Les nouveaux mots de passe ne correspondent pas." });
      return;
    }

    try {
      // Construction du payload envoyé dynamiquement à l'API PUT /api/users/[id]
      const payload: Record<string, any> = { name, email, image };
      
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      // Appel de la méthode de votre hook personnalisé
      await updateProfile(userId, payload);

      toast.success("تم تحديث الحساب بنجاح !", { description: "Profil et mot de passe mis à jour." });

      // Réinitialiser les champs de mot de passe après succès
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Rafraîchir les données de session NextAuth locales
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
    } catch (err: any) {
      toast.error("خطأ أثناء الحفظ", { description: err.message });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-right" dir="rtl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">تعديل الحساب الشخصي (Profil)</h2>
        <p className="text-sm text-gray-500 mt-1">قم بتحديث معلوماتك الشخصية أو تغيير كلمة المرور الخاصة بك.</p>
      </div>
      
      <form onSubmit={handleUpdate} className="space-y-6" noValidate>
        {/* Messages d'état globaux renvoyés par votre Hook */}
        {success && (
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 font-medium border border-green-100 text-center">
            ✓ تم تحديث البيانات بنجاح !
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 font-medium border border-red-100 text-center">
            {error}
          </div>
        )}
        
        {/* Aperçu de la photo de profil */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-2 flex-row-reverse">
          <img
            src={image || "https://unsplash.com"}
            alt="Aperçu"
            className="h-16 w-16 rounded-full object-cover border-2 border-indigo-500/20 shadow-xs"
          />
          <div className="flex-1 text-right">
            <h4 className="text-sm font-semibold text-gray-900">{name || "زبون متجرنا"}</h4>
            <p className="text-xs text-gray-500 font-mono">{email || "لا يوجد بريد إلكتروني"}</p>
          </div>
        </div>

        {/* SECTION 1 : INFORMATIONS DE BASE */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">الاسم الكامل (Nom)</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-3 text-gray-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">البريد الإلكتروني (Email)</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-3 text-gray-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all text-left font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">رابط الصورة الشخصية (URL Photo)</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <PhotoIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url" value={image} onChange={(e) => setImage(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-3 text-gray-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all text-left font-mono"
            />
          </div>
        </div>

        <hr className="border-gray-100 my-4" />

        {/* ✅ SECTION 2 : MODIFICATION DU MOT DE PASSE */}
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 justify-start">
            <KeyIcon className="h-4 w-4" /> تغيير كلمة المرور (Sécurité)
          </h3>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">كلمة المرور الحالية (Mot de passe actuel)</label>
            <input
              type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••"
              className="block w-full rounded-lg border border-gray-300 py-2 px-3 bg-white text-gray-900 focus:border-indigo-500 focus:outline-hidden text-left font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">كلمة المرور الجديدة (Nouveau)</label>
              <input
                type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••"
                className="block w-full rounded-lg border border-gray-300 py-2 px-3 bg-white text-gray-900 focus:border-indigo-500 focus:outline-hidden text-left font-mono text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">تأكيد كلمة المرور الجديدة (Confirmation)</label>
              <input
                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                className="block w-full rounded-lg border border-gray-300 py-2 px-3 bg-white text-gray-900 focus:border-indigo-500 focus:outline-hidden text-left font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* BOUTON DE SOUUMISSION */}
        <div className="pt-2">
          <button
            type="submit" disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? "جاري حفظ التعديلات..." : "حفظ التغييرات الجديدة"}
          </button>
        </div>
      </form>
    </div>
  );
}
