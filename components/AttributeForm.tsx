"use client"
import { Attribute } from "../components/dashboard/ProductsManager"

interface AttributeFormProps {
  attributes: Attribute[]; setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
}

export default function AttributeForm({ attributes, setAttributes }: AttributeFormProps) {
  const handleAttributeChange = (index: number, field: keyof Attribute, value: string) => {
    const updated = [...attributes]
    updated[index][field] = value
    setAttributes(updated)
  }

  return (
    <div className="pb-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">3. Caractéristiques Techniques</h3>
        <button
          type="button" onClick={() => setAttributes([...attributes, { name: "", value: "" }])}
          className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-700 cursor-pointer"
        >
          + Ajouter un attribut
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {attributes.map((attr, index) => (
          <div key={index} className="flex items-center gap-3">
            <input type="text" placeholder="Matière, Coupe..." value={attr.name} onChange={(e) => handleAttributeChange(index, "name", e.target.value)} className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 text-white" />
            <input type="text" placeholder="100% Coton, Slim" value={attr.value} onChange={(e) => handleAttributeChange(index, "value", e.target.value)} className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700 text-white" />
            {attributes.length > 1 && (
              <button type="button" onClick={() => setAttributes(attributes.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-400 text-sm font-medium cursor-pointer">Supprimer</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
