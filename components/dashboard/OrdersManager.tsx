"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  variant: {
    color: string;
    size: string;
    image: string[];
    product: {
      Name: string;
      brand: string;
    };
  };
}

interface Order {
  id: number;
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        toast.success("Statut de la commande mis à jour !");
        fetchOrders(); // Rafraîchir les données
      } else {
        toast.error("Erreur lors de la modification");
      }
    } catch {
      toast.error("Erreur de traitement");
    }
  };

  // Couleurs conditionnelles selon l'avancement du cycle de vente
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "CONFIRMED": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "SHIPPED": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "DELIVERED": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "CANCELLED": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) return <div className="p-6 text-gray-400 animate-pulse">Chargement des commandes en cours...</div>;

  return (
    <div className="w-full flex flex-col gap-6" dir="rtl">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h2 className="text-xl font-black text-white">📦 إدارة الطلبات المتلقية (Gestion des commandes)</h2>
        <span className="bg-gray-900 px-3 py-1 text-xs rounded-full border border-gray-800 text-gray-400">Total : {orders.length}</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-2xl bg-gray-950/20">
          لا توجد أي طلبات مسجلة حالياً في قاعدة البيانات.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-950 rounded-xl border border-gray-800 p-5 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center shadow-sm">
              
              {/* Infos Client */}
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">{order.customerName}</span>
                  <span className="text-[10px] bg-gray-900 border border-gray-800 px-2 py-0.5 rounded text-gray-500 font-mono">#{order.id}</span>
                </div>
                <a href={`tel:${order.phone}`} className="text-xs font-mono text-blue-400 hover:underline inline-block w-fit" dir="ltr">{order.phone}</a>
                <span className="text-xs text-gray-400 font-semibold">{order.wilaya} - {order.commune}</span>
                <span className="text-[10px] text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>

              {/* Détails des Articles commandés */}
              <div className="flex-1 flex flex-col gap-2 w-full border-t border-b lg:border-none border-gray-900 py-3 lg:py-0">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-900/30 p-2 rounded-lg border border-gray-900/60 w-full">
                    <img src={item.variant.image?.[0] || "/placeholder.jpg"} alt="" className="w-10 h-10 object-cover rounded-md border border-gray-800" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.variant.product?.Name}</p>
                      <p className="text-[10px] text-gray-400">اللون: {item.variant.color} | المقاس: {item.variant.size} | الكمية: <span className="font-bold text-white">{item.quantity}</span></p>
                    </div>
                    <div className="text-left font-mono text-xs font-bold text-gray-300 pl-1">{item.price * item.quantity} DZD</div>
                  </div>
                ))}
              </div>

              {/* Prix total & Changement du Statut de traitement */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 w-full lg:w-auto min-w-[160px]">
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block">المبلغ الإجمالي</span>
                  <span className="font-black text-md text-green-400 font-mono">{order.totalPrice} DZD</span>
                </div>

                <div className="flex flex-col gap-1 w-full max-w-[140px]">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors outline-none cursor-pointer appearance-none text-center ${getStatusBadgeClass(order.status)}`}
                  >
                    <option value="PENDING" className="bg-gray-950 text-amber-400">En attente (PENDING)</option>
                    <option value="CONFIRMED" className="bg-gray-950 text-blue-400">Confirmé (CONFIRMED)</option>
                    <option value="SHIPPED" className="bg-gray-950 text-purple-400">Expédié (SHIPPED)</option>
                    <option value="DELIVERED" className="bg-gray-950 text-green-400">Livré (DELIVERED)</option>
                    <option value="CANCELLED" className="bg-gray-950 text-red-400">Annulé (CANCELLED)</option>
                  </select>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
