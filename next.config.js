/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
  images: {
    domains: ["images.unsplash.com", "avatar.vercel.sh"],
  },
};

module.exports = nextConfig;
