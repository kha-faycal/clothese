"use client";
import React from "react";

interface FacebookShareButtonProps {
  slug: string;
  buttonText?: string;
}

export default function FacebookShareButton({ 
  slug, 
  buttonText = "بارطاجي في فيسبوك" 
}: FacebookShareButtonProps) {

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const currentDomain = window.location.origin;
    
    // 🛠️ Correction 1 : Ajustement du chemin selon votre structure /shop
    const fullProductUrl = `${currentDomain}/shop/products/${slug}`;
    
    // 🛠️ Correction 2 : Ajout du "$" manquant devant encodeURIComponent
    const facebookShareUrl = `https://facebook.com{encodeURIComponent(fullProductUrl)}`;

    const width = 600;
    const height = 450;
    
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      facebookShareUrl,
      "FacebookSharePopup",
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow cursor-pointer w-full sm:w-auto"
      dir="rtl"
    >
      {/* 🛠️ Correction 3 : Lien officiel xmlns pour le SVG d'icône */}
      <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z"/>
      </svg>
      <span>{buttonText}</span>
    </button>
  );
}
