import Navdash from "@/components/Navdash"; // 🛠️ Harmonisation de l'alias avec un @/
import Footer from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Barre de navigation d'administration sécurisée */}
      <Navdash />
      
      <main className="flex-1 p-6">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
