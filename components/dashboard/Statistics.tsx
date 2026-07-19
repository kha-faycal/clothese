"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface StatsData {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    pendingRevenue: number;
    totalItemsSold: number;
    confirmationRate: number;
    cancellationRate: number;
  };
  topProducts: Array<{
    name: string;
    color: string;
    size: string;
    image: string;
    quantity: number;
  }>;
}

export default function Statistics() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/statistics");
        const stats = await res.json();
        if (res.ok) setData(stats);
      } catch {
        toast.error("Erreur lors de la récupération des statistiques");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-6 text-gray-400 animate-pulse">جاري تحميل الإحصائيات (Calcul des indicateurs...)</div>;
  if (!data) return <div className="p-6 text-red-500">خطأ في تحميل البيانات</div>;

  return (
    <div className="w-full flex flex-col gap-6" dir="rtl">
      
      {/* En-tête */}
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-xl font-black text-white">📊 لوحة التحكم والإحصائيات (Statistiques Générales)</h2>
        <p className="text-xs text-gray-500 mt-1">Analyse des performances de vente basées sur les commandes traitées.</p>
      </div>

      {/* Grille des indicateurs (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Chiffre d'Affaires Encaissé */}
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-950 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase">المداخيل الصافية (CA Encaissé)</span>
          <span className="text-2xl font-black text-green-400 font-mono">{data.summary.totalRevenue} DZD</span>
          <span className="text-[10px] text-gray-600 mt-1">Commandes livrées avec succès</span>
        </div>

        {/* Chiffre d'Affaires En Cours */}
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-950 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase">في طور المعالجة (CA En Cours)</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{data.summary.pendingRevenue} DZD</span>
          <span className="text-[10px] text-gray-600 mt-1">Commandes en attente/expédiées</span>
        </div>

        {/* Total Commandes reçues */}
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-950 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase">إجمالي الطلبيات (Total Commandes)</span>
          <span className="text-2xl font-black text-white font-mono">{data.summary.totalOrders}</span>
          <span className="text-[10px] text-gray-600 mt-1">Volume global des demandes reçues</span>
        </div>

        {/* Total Articles vendus */}
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-950 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase">المنتجات المباعة (Articles Vendus)</span>
          <span className="text-2xl font-black text-blue-400 font-mono">{data.summary.totalItemsSold}</span>
          <span className="text-[10px] text-gray-600 mt-1">Unités sorties définitivement du stock</span>
        </div>
      </div>

      {/* Section des Taux de Conversion & Top Ventes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Taux de conversion */}
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-950 flex flex-col gap-4">
          <h3 className="text-sm font-black text-white">📈 نسب التحويل (Performances)</h3>
          
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-400">نسبة تأكيد الطلبات (Taux de Confirmation)</span>
              <span className="text-blue-400 font-mono">{data.summary.confirmationRate}%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
              <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${data.summary.confirmationRate}%` }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-400">نسبة الإلغاء / الرفض (Taux d'Annulation)</span>
              <span className="text-red-400 font-mono">{data.summary.cancellationRate}%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
              <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${data.summary.cancellationRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* Top 5 Produits les plus vendus */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-gray-800 bg-gray-950 flex flex-col gap-4">
          <h3 className="text-sm font-black text-white">⭐ المنتجات الأكثر مبيعاً (Top 5 Produits)</h3>
          
          {data.topProducts.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6">لا توجد بيانات كافية حالياً لتحديد أفضل المنتجات.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {data.topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-900/40 border border-gray-900">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={product.image || "/placeholder.jpg"} alt="" className="w-9 h-9 object-cover rounded border border-gray-800" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{product.name}</p>
                      <p className="text-[10px] text-gray-500">اللون: {product.color} | المقاس: {product.size}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-xs bg-blue-950/60 border border-blue-900 text-blue-400 px-2 py-1 rounded font-bold font-mono">
                      {product.quantity} قطعة / Pcs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
