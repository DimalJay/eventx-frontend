import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
