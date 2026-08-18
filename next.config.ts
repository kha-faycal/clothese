import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Options de configuration ici */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
