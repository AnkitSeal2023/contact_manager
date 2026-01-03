
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // No custom headers needed for CORS; handled by backend only
    images: {
        remotePatterns: [new URL('https://i.pravatar.cc/**'), new URL('https://lh3.googleusercontent.com/**')],
    },
};

export default nextConfig;
