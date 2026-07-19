import { Category } from "@components/dashboard/CategoriesManager";


interface CategoryTableProps {
  categories: Category[];
}
export default function CategoryTable({ categories = [] }: CategoryTableProps) {
  return (
    <div className="w-full overflow-x-auto bg-black text-white rounded-xl shadow-lg">
      <table className="w-full border-collapse text-left text-lg">
        <thead className="border-b border-gray-700">
          <tr>
            <th className="px-8 py-4 font-semibold">Image</th>
            <th className="px-8 py-4 font-semibold">Nom</th>
            <th className="px-8 py-4 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {categories.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-8 py-6 text-center text-gray-400">
                Aucune catégorie disponible.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-900">
                <td className="px-8 py-4">
                  {category.image?.length ? (
                    <img
                      src={category.image[0]}
                      alt={category.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-800 flex items-center justify-center text-xs text-gray-400 border border-dashed">
                      No img
                    </div>
                  )}
                </td>
                <td className="px-8 py-4 font-bold">{category.name}</td>
                <td className="px-8 py-4">{category.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}