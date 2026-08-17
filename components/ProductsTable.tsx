"use client"
import { Product } from "../components/dashboard/ProductsManager"
import { Edit2, Trash2 } from "lucide-react"

interface ProductsTableProps {
  products: Product[];
  hideDetails?: boolean;
  onEdit: (product: Product) => void;     
  onDelete: (id: string | number) => void; 
}

export default function ProductsTable({ 
  products = [], 
  hideDetails = false,
  onEdit,
  onDelete
}: ProductsTableProps) {

  // Fonction utilitaire pour générer le badge de type de produit
  const getTypeBadge = (type?: string) => {
    const cleanType = type || "CLOTHES";
    if (cleanType === "PERFUME") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          ✨ Parfum
        </span>
      );
    }
    if (cleanType === "COSMETICS") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
          💄 Cosmétique
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
        👕 Vêtement
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto bg-gray-950 text-white rounded-xl shadow-lg border border-gray-800">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="border-b border-gray-800 bg-gray-900/50 text-gray-400">
          <tr>
            <th className="px-4 py-3 font-semibold">Produit</th>
            {!hideDetails && <th className="px-4 py-3 font-semibold">Nature</th>}
            {!hideDetails && <th className="px-4 py-3 font-semibold">Marque</th>}
            {!hideDetails && <th className="px-4 py-3 font-semibold">Variantes & Stock</th>}
            <th className="px-4 py-3 font-semibold text-right">Statut</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-900">
          {products.length === 0 ? (
            <tr>
              <td colSpan={hideDetails ? 4 : 6} className="px-4 py-8 text-center text-gray-500">
                Aucun produit configuré pour le moment.
              </td>
            </tr>
          ) : (
            products.map((prod) => {
              const productName = prod.name || prod.Name || "Sans nom";
              const productBrand = prod.brand || prod.Brand || "Générique";
              const activeVariants = prod.variants || prod.Variants || [];

              // Somme cumulative des stocks de toutes les déclinaisons de ce produit
              const totalStock = activeVariants.reduce((sum, v) => sum + (parseInt(v.stock as string) || 0), 0);

              return (
                <tr key={prod.id} className="hover:bg-gray-900/60 transition-colors group">
                  <td className="px-4 py-3 font-bold text-white max-w-[200px] truncate">
                    {productName}
                  </td>
                  
                  {!hideDetails && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getTypeBadge(prod.type)}
                    </td>
                  )}
                  
                  {!hideDetails && (
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                      {productBrand}
                    </td>
                  )}
                  
                  {!hideDetails && (
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-gray-300">{activeVariants.length} variante(s)</span>
                        <span className="text-gray-500">Total stock : {totalStock} u.</span>
                      </div>
                    </td>
                  )}
                  
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {totalStock > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        En Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        Rupture (Masqué)
                      </span>
                    )}
                  </td>
                  
                  {/* Actions Column */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(prod)}
                        className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(prod.id)}
                        className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
