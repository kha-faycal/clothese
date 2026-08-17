"use client";

import { Disclosure } from "@headlessui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useCartStore } from "../app/shop/store/useCartStore"; 
import CartDrawer from "./CartDrawer"; 

// ☀️/🌙 COMPOSANT BOUTON DE THÈME (Tailwind v4 ready)
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Empêche les erreurs d'hydratation SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl bg-muted/10 text-foreground border border-border hover:bg-muted/20 transition-all active:scale-95 cursor-pointer select-none"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        /* Icône Soleil */
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M21 12h-2.25m-13.5 0H3m16.58-6.78l-1.59 1.59M5.22 18.78l-1.59 1.59M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ) : (
        /* Icône Lune */
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}
    </button>
  );
}

// 🛒 COMPOSANT ICÔNE PANIER
function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  );
}

export default function Nav() {
  const { data: session, status } = useSession();
  const openCart = useCartStore((state) => state.openCart);
  const items = useCartStore((state) => state.items);

  const cartItemsCount = items ? items.length : 0;

  return (
    <>
      <Disclosure
        as="nav"
        className="bg-background text-foreground border-b border-border shadow-md transition-colors duration-200"
        dir="rtl"
      >
        <div className="flex h-16 justify-between items-center px-4 sm:px-6 max-w-7xl mx-auto">
          
          {/* Menu principal (À droite en RTL) */}
          <div className="flex space-x-2 sm:space-x-4 space-x-reverse">
            {[
              { href: "/shop", label: "الرئيسية" },
              { href: "/new-products", label: "جديد" },
              { href: "/about", label: "حولنا" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold hover:bg-muted/10 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions : Thème + Panier (À gauche en RTL) */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* ☀️/🌙 Bouton sélecteur de thème injecté */}
            <ThemeToggle />

            {/* 🛒 Bouton déclencheur du panier d'achat */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 rounded-xl bg-muted/10 text-foreground border border-border hover:bg-muted/20 transition-all active:scale-95 cursor-pointer select-none"
              aria-label="Open Cart"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center animate-in scale-in duration-200">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </Disclosure>

      <CartDrawer />
    </>
  );
}
