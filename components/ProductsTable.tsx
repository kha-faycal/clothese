"use client"
import { Product } from "@components/dashboard/ProductsManager"

interface ProductsTableProps {
  products: Product[];
  hideDetails?: boolean; // Toggles slim-mode dynamically if the layout changes
}

export default function ProductsTable({ products = [], hideDetails = false }: ProductsTableProps) {
  return (
    <div className="w-full overflow-x-auto bg-gray-950 text-white rounded-xl shadow-lg border border-gray-800">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="border-b border-gray-800 bg-gray-900/50 text-gray-400">
          <tr>
            <th className="px-4 py-3 font-semibold">Produit</th>
            {!hideDetails && <th className="px-4 py-3 font-semibold">Marque</th>}
            {!hideDetails && <th className="px-4 py-3 font-semibold">Variantes</th>}
            <th className="px-4 py-3 font-semibold text-right">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-900">
          {products.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                Aucun produit configuré pour le moment.
              </td>
            </tr>
          ) : (
            products.map((prod) => {
              const productName = prod.name || prod.Name || "Sans nom";
              const productBrand = prod.brand || prod.Brand || "Générique";
              const activeVariants = prod.variants || prod.Variants || [];

              return (
                <tr key={prod.id} className="hover:bg-gray-900/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-white">{productName}</td>
                  {!hideDetails && <td className="px-4 py-3 text-gray-300">{productBrand}</td>}
                  {!hideDetails && (
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {activeVariants.length} variante(s) dispos
                    </td>
                  )}
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      Actif
                    </span>
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
