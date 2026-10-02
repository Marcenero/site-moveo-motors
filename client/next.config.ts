import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.15.4"],

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
