/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpilamos three y los helpers de drei para evitar problemas de ESM en build.
  transpilePackages: ["three"],
};

export default nextConfig;
