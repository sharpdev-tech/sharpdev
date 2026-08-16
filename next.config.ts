import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev-tools badge in the corner during development.
  // Compile and runtime errors are still surfaced.
  devIndicators: false,
};

export default nextConfig;
