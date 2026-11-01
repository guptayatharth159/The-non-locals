import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/adventures",
        permanent: false,
      },
      {
        source: "/profile",
        destination: "/adventures",
        permanent: false,
      },
      {
        source: "/auth",
        destination: "/admin/login",
        permanent: false,
      },
      {
        source: "/bookings/:path*",
        destination: "/adventures",
        permanent: false,
      },
      {
        source: "/destinations",
        destination: "/adventures",
        permanent: false,
      },
      {
        source: "/explore",
        destination: "/adventures",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
