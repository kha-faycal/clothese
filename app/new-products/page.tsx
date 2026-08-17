import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const metadata = {
  title: "وصلنا حديثاً | 10 منتجات جديدة",
  description: "اكتشف آخر المنتجات والتشكيلات الحصرية التي وصلت للتو إلى متجرنا.",
};

export default async function NewProductsPage() {
  // 1. Récupération des 10 derniers produits avec stock > 0 directement côté serveur
  const dbProducts = await prisma.product.findMany({
    where: {
      variants: {
        some: {
          stock: { gt: 0 }
        }
      }
    },
    include: {
      variants: true,
      category: true,
    },
    orderBy: { 
      createdAt: "desc"
    },
    take: 10
  });

  // 2. Sérialisation propre pour éviter les plantages avec Prisma Decimal/Float
  const products = dbProducts.map((product) => ({
    id: product.id,
    Name: product.Name,
    Slug: product.Slug,
    Description: product.Description || "",
    brand: product.brand || "",
    type: product.type,
    category: product.category ? { Name: product.category.Name } : null,
    variants: product.variants.map((v) => ({
      id: v.id,
      color: v.color || "",
      size: v.size || "",
      sku: v.sku,
      barcode: v.barcode,
      price: v.price ? Number(v.price) : 0,
      stock: v.stock,
      image: v.image,
    })),
  }));

  // 3. Rendu direct HTML (Server Component - Plus de problème de 'undefined' ou de 'length')
  return (
    <main className="w-full min-h-screen bg-background text-foreground antialiased py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* En-tête de la page nouveautés */}
        <div className="text-right space-y-2 border-b border-border pb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
              وصلنا حديثاً (Arrivages Récents)
            </span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-black text-foreground">
            آخر 10 منتجات مضافة في المتجر
          </h1>
          <p className="text-xs md:text-sm text-muted max-w-xl">
            تصفح أحدث قطع الموضة، العطور الفاخرة، ومستحضرات التجميل التي وصلت للتو إلى مخازننا. قطع أصلية ومحدودة الكمية!
          </p>
        </div>

        {/* Grille responsive des 10 nouveaux produits */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative">
                {/* Badge visuel "جديد" sur l'angle de chaque produit */}
                <span className="absolute top-2 left-2 bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-md z-20 shadow-sm">
                  جديد
                </span>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          /* État vide si aucun produit n'est configuré */
          <div className="w-full py-24 text-center bg-secondary/10 border border-border border-dashed rounded-2xl">
            <p className="text-sm text-muted">
              لا توجد منتجات جديدة متوفرة في الوقت الحالي.
            </p>
            <Link 
              href="/" 
              className="inline-block mt-4 bg-foreground text-background font-bold text-xs px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              العودة للرئيسية
            </Link>
          </div>
        )}

        {/* Pied de page incitatif */}
        {products && products.length > 0 && (
          <div className="text-center pt-8 border-t border-border">
            <p className="text-xs text-muted mb-4">هل تبحث عن المزيد من الخيارات والتصنيفات؟</p>
            <Link 
              href="/shop" 
              className="inline-block bg-secondary text-foreground border border-border font-bold text-xs px-8 py-3.5 rounded-xl hover:bg-secondary/80 transition-colors"
            >
              تصفح كامل المتجر والمجموعات
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
