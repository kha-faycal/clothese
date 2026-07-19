"use client";
import { useState } from "react";
import { useCartStore } from "../app/store/useCartStore";
import { ALGERIA_WILAYAS, Wilaya } from "../app/data/wilayas"; // 🔴 Import des Wilayas
import { toast } from "sonner";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  
  // États d'expédition obligatoires
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | null>(null);
  const [shippingType, setShippingType] = useState<"HOME" | "DESK">("HOME");
  const [commune, setCommune] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Calcul dynamique des frais de livraison
  const shippingCost = selectedWilaya 
    ? (shippingType === "HOME" ? selectedWilaya.homePrice : selectedWilaya.deskPrice)
    : 0;

  const finalTotalPrice = getTotalPrice() + shippingCost;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !selectedWilaya || !commune) {
      toast.error("يرجى ملء جميع الخانات المطلوبة");
      return;
    }

    setLoading(true);

    toast.promise(
      async () => {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName,
            phone,
            wilaya: `${selectedWilaya.id} - ${selectedWilaya.nameFr}`,
            commune,
            // Optionnel : On envoie aussi le prix final calculé avec livraison pour votre historique
            totalPrice: finalTotalPrice, 
            items: items.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur de traitement");

        clearCart();
        closeCart();
        // Reset des états
        setCustomerName("");
        setPhone("");
        setSelectedWilaya(null);
        setCommune("");
        return data;
      },
      {
        loading: "جاري تسجيل طلبك...",
        success: "تم تسجيل طلبك بنجاح! سنتصل بك قريباً لتأكيده.",
        error: (err) => `${err.message}`,
      }
    );

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" dir="rtl">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={closeCart} />

      <div className="relative w-full max-w-md bg-gray-950 text-white h-full shadow-2xl flex flex-col border-r border-gray-800 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-900 flex items-center justify-between">
          <h3 className="text-xl font-black">سلة التسوق ({items.length})</h3>
          <button onClick={closeCart} className="text-gray-400 hover:text-white text-lg p-1 cursor-pointer">✕</button>
        </div>

        {/* Corps défilant */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
              <span className="text-4xl">🛒</span>
              <p className="text-sm font-medium">السلة فارغة حالياً</p>
            </div>
          ) : (
            <>
              {/* Mapping des articles (Inchangé) */}
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 p-3 bg-gray-900/40 border border-gray-900 rounded-xl items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-800" />
                  <div className="flex-1 flex flex-col gap-1">
                    <h4 className="font-bold text-sm text-white line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-gray-400">اللون: {item.color} | المقاس: {item.size}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button type="button" onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="bg-gray-800 hover:bg-gray-700 w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer">-</button>
                      <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="bg-gray-800 hover:bg-gray-700 w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full min-h-[4rem]">
                    <button type="button" onClick={() => removeItem(item.variantId)} className="text-red-500 hover:text-red-400 text-xs cursor-pointer">حذف</button>
                    <span className="font-black text-sm tracking-tight whitespace-nowrap">{item.price * item.quantity} DZD</span>
                  </div>
                </div>
              ))}

              {/* Formulaire de livraison intelligent Algérie */}
              <form onSubmit={handleCheckout} id="checkout-form" className="mt-2 pt-4 border-t border-gray-900 flex flex-col gap-3">
                <h4 className="text-sm font-bold text-gray-300">معلومات الشحن (Détails de livraison)</h4>
                
                <input 
                  type="text" required placeholder="الاسم الكامل (Nom Complet)" value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-800 rounded-lg text-white outline-none focus:border-gray-600"
                />
                
                <input 
                  type="tel" required placeholder="رقم الهاتف (Téléphone)" value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-800 rounded-lg text-white text-left font-mono outline-none focus:border-gray-600" 
                  dir="ltr"
                />

                {/* 🔴 SÉLECTEUR DE WILAYA DROPDOWN */}
                <select
                  required
                  value={selectedWilaya ? selectedWilaya.id : ""}
                  onChange={(e) => {
                    const wilayaId = parseInt(e.target.value);
                    const found = ALGERIA_WILAYAS.find(w => w.id === wilayaId) || null;
                    setSelectedWilaya(found);
                  }}
                  className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-800 rounded-lg text-white outline-none focus:border-gray-600 cursor-pointer"
                >
                  <option value="" className="text-gray-500">اختر الولاية (Sélectionner la Wilaya)...</option>
                  {ALGERIA_WILAYAS.map((w) => (
                    <option key={w.id} value={w.id} className="bg-gray-950">
                      {w.id} - {w.nameAr} ({w.nameFr})
                    </option>
                  ))}
                </select>

                {/* 🔴 TYPE DE LIVRAISON SÉLECTEUR (Uniquement si une wilaya est choisie) */}
                {selectedWilaya && (
                  <div className="grid grid-cols-2 gap-2 bg-gray-900/50 p-1.5 rounded-lg border border-gray-900">
                    <button
                      type="button"
                      onClick={() => setShippingType("HOME")}
                      className={`py-1.5 text-xs font-bold rounded-md transition-all ${shippingType === "HOME" ? "bg-white text-black shadow" : "text-gray-400 hover:text-white"}`}
                    >
                      المنزل (+{selectedWilaya.homePrice} DA)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShippingType("DESK")}
                      className={`py-1.5 text-xs font-bold rounded-md transition-all ${shippingType === "DESK" ? "bg-white text-black shadow" : "text-gray-400 hover:text-white"}`}
                    >
                      المكتب Stop-Desk (+{selectedWilaya.deskPrice} DA)
                    </button>
                  </div>
                )}

                <input 
                  type="text" required placeholder="البلدية / العنوان (Commune / Adresse)" value={commune} 
                  onChange={(e) => setCommune(e.target.value)} 
                  className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-800 rounded-lg text-white outline-none focus:border-gray-600"
                />
              </form>
            </>
          )}
        </div>

        {/* Footer récapitulatif financier complet */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-900 bg-gray-950 flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>سعر الملابس :</span>
              <span className="font-mono">{getTotalPrice()} DZD</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>تكلفة التوصيل :</span>
              <span className="font-mono">{selectedWilaya ? `${shippingCost} DZD` : "اختر الولاية"}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-900 pt-2.5">
              <span className="text-gray-300 text-sm font-bold">المجموع الإجمالي :</span>
              <span className="text-xl font-black tracking-tight text-green-400 font-mono">{finalTotalPrice} DZD</span>
            </div>
                        <button 
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full bg-white text-black font-extrabold py-3.5 rounded-xl hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shadow-md cursor-pointer text-center mt-1"
            >
              {loading ? "جاري الإرسال..." : "تأكيد الطلب عبر الهاتف"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
