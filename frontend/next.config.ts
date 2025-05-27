import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: 'https://q-air-line-web-56ot.vercel.app/api', // Trỏ đến API backend
  },
};
export default nextConfig;
