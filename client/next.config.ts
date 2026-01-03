
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "http://localhost:5000" },
                    { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [new URL('https://i.pravatar.cc/**'), new URL('https://lh3.googleusercontent.com/**')],
    },
};

export default nextConfig;
