import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */ 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Corrigé ici
        pathname: '/**', // Permet d'accepter tous les dossiers d'images
      },
    ],
  },
};

export default nextConfig;
