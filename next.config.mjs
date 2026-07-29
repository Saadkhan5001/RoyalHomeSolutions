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
  async redirects() {
    return [
      // Ad traffic points at /lander; funnel it to the seller landing page and
      // straight to the lead form. Non-permanent (307) so the ad URL stays
      // flexible.
      {
        source: "/lander",
        destination: "/sell-your-home#seller-form",
        permanent: false,
      },
      // /property was the seller-facing "properties we buy" page. It is now the
      // buyer-facing inventory page at /buy-a-home, and its seller content
      // moved to /sell-your-home. Permanent (308) so the old URL's search
      // equity transfers and no duplicate indexable content remains.
      {
        source: "/property",
        destination: "/buy-a-home",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
