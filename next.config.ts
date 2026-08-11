import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages (serves plain files, no Node server).
  output: "export",
  // User site is served from the domain root, so no basePath needed.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
