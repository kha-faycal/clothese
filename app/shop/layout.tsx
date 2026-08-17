import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Barre de navigation publique avec le bouton panier intégré */}
      <Nav /> 
      
      {/* Contenu dynamique des pages de la boutique */}
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </>
  );
}
