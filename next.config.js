/** @type {import('next').NextConfig} */

module.exports = {
  assetPrefix: './',
  output: 'export',
  distDir: 'dist',
  swcMinify: false,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
}
