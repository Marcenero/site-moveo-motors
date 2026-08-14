import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ivkslwgbabkzmpppuscv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/Imagens/**",
      },
    ],
  },
};

export default nextConfig;
