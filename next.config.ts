import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: [
      "lh3.googleusercontent.com", // ✅ Google avatars
      "i.pravatar.cc"              // (optional, if you use this)
    ],
  },
};

export default nextConfig;
