import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  redirects: async () => {
    return [
      {
        source: "/event/manage/:id",
        destination: "/event/manage/:id/overview",
        permanent: true,
      },
    ];
  }
  
};

export default nextConfig;
