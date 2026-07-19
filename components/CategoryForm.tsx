'use client'; 

import { Category } from "@components/dashboard/CategoriesManager";

interface CategoryFormProps {
  createCategory: {
    name: string;
    description: string;
    imageUrl: string;
    parentId: string;
  };
  setCreateCategory: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    imageUrl: string;
    parentId: string;
  }>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; // Added prop definition missing from your last code snippet
  categories: Category[];
}

export default function CategoryForm({
  createCategory,
  setCreateCategory,
  handleSubmit,
  handleFileUpload, // 👈 Using the unified parent prop instead of breaking local overrides
  categories,
}: CategoryFormProps) {

  return (
    <div className="h-fit bg-black text-white p-8 rounded-xl border border-gray-700 shadow-lg flex flex-col gap-6 max-w-xl w-full">
      <h2 className="text-xl font-semibold border-b border-gray-700 pb-3">Créer une catégorie</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-400">Nom</label>
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={createCategory.name}
            onChange={(e) => setCreateCategory({ ...createCategory, name: e.target.value })}
            className="bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-500"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-400">Description</label>
          <input
            type="text"
            placeholder="Description de la catégorie"
            value={createCategory.description}
            onChange={(e) => setCreateCategory({ ...createCategory, description: e.target.value })}
            className="bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-500"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-400">Catégorie Parente</label>
          <select
            value={createCategory.parentId}
            onChange={(e) => setCreateCategory({ ...createCategory, parentId: e.target.value })}
            className="bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-gray-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-900 text-white">Aucune (Catégorie principale)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-gray-900 text-white">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-400">Image de la catégorie</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-600 file:bg-gray-900 file:text-white file:text-sm file:font-semibold hover:file:bg-gray-800 cursor-pointer file:cursor-pointer"
          />
        </div>

        {createCategory.imageUrl && (
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-sm font-medium text-gray-400">Aperçu :</span>
            <img 
              src={createCategory.imageUrl} 
              alt="Preview" 
              className="w-24 h-24 object-cover rounded-lg border border-gray-600 shadow-md" 
            />
          </div>
        )}

        <button 
          type="submit" 
          className="bg-white text-black font-semibold text-lg px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors mt-2 cursor-pointer"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
