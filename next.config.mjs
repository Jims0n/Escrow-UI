/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        RPC_ENDPOINT: process.env.RPC_ENDPOINT,
    }
};

export default nextConfig;
