import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/regmi-kirana-store",
  trailingSlash: true,
  images: { unoptimized: true },
  allowedDevOrigins: ["192.168.1.79"],
};

export default nextConfig;
