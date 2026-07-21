import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    allowedDevOrigins: ['192.168.1.2', 'localhost'], 

     images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://cloudinary.com',
      },
    ],
  },

};

export default nextConfig;
