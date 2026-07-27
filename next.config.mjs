/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Ad traffic points at /lander; funnel it to the seller landing page and
  // straight to the lead form. Non-permanent (307) so the ad URL stays flexible.
  async redirects() {
    return [
      {
        source: "/lander",
        destination: "/sell-your-home#seller-form",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
