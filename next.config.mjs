/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        pathname: "/9d58xhzxkdpxfgr8/publicFiles/_public/*",
      },
    ],
  },
};

export default nextConfig;
