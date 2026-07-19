import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from '@components/Footer';
import Nav from "../components/Nav"; 
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "sonner"; // 👈 1. Import Toaster from Sonner

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
  description: "Welcome to Clothese, your ultimate destination for fashion and style. Explore our curated collection of clothing and accessories to elevate your wardrobe.  ",
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
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Nav/>
          
          {children}

          <Footer/>
        </AuthProvider>

        {/* 👈 2. Add Toaster component with Dark Theme & RTL support */}
        <Toaster 
          theme="dark" 
          dir="rtl" 
          position="bottom-left" // Standard corner positioning for RTL environments
          richColors // Gives elegant colors to success/error notifications
        />
      </body>
    </html>
  );
}
