import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://ivkslwgbabkzmpppuscv.supabase.co",
        pathname: "/storage/v1/object/public/Imagens/**",
      },
    ],
  },
};

export default nextConfig;
