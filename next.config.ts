import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [{hostname: 'res.cloudinary.com'}]
    },
    typescript: {
      ignoreBuildErrors: false,
    }
};

export default nextConfig;
