import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider"; 
import { ThemeProvider } from "@/components/ThemeProvider"; 
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

// 🟢 MODIFICATION DU TITRE ET DE LA DESCRIPTION DE VOTRE BOUTIQUE ICI
export const metadata: Metadata = {
  title: "Clothese | متجر الملابس الخاص بك", // Titre affiché sur Google et l'onglet
  description: "Welcome to Clothese, your ultimate destination for fashion and style. اكتشف أحدث صيحات الموضة والملابس الحصرية",
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
      suppressHydrationWarning 
    >
      <head>
        {/* 🟢 LIEN VERS VOTRE NOUVELLE ICÔNE (FAVICON) */}
        {/* Assurez-vous de placer votre image nommée "favicon.ico" ou "logo.png" directement dans le dossier racine nommé "public" */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Optionnel : si vous avez une icône haute qualité au format PNG, vous pouvez la lier ainsi : */}
        {/* <link rel="icon" href="/logo.png" type="image/png" /> */}
      </head>
      
      <body className="min-h-full flex flex-col">
        <AuthProvider>
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
