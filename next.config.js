const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

const withMDX = require('@next/mdx')();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withMDX(nextConfig));
