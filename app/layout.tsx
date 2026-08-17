import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider"; 
import { ThemeProvider } from "@/components/ThemeProvider"; // 🎯 1. Importation obligatoire du ThemeProvider
import { Toaster } from "sonner"; 
import "./globals.css"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clothese",
  description: "Welcome to Clothese, your ultimate destination for fashion and style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar" 
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // 🎯 2. Évite les alertes de conflits serveur/client dans votre console de développement
    >
      {/* 💡 Note : Les variables bg-background et text-foreground s'appliquent automatiquement grâce à notre CSS global */}
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {/* 🎯 3. Injection du ThemeProvider configuré sur le mode classe pour Tailwind v4 */}
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children} 
          </ThemeProvider>
        </AuthProvider>

        <Toaster 
          theme="dark" 
          dir="rtl" 
          position="bottom-left" 
          richColors 
        />
      </body>
    </html>
  );
}
