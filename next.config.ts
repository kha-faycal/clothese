import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    allowedDevOrigins: ['10.53.36.189', 'localhost'], 

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
