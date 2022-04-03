/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: 'http://114.35.65.114/ChocolateMarket/public/api',
    Image_URL: 'http://114.35.65.114/ChocolateMarket/public/storage',
    BASE_URL: 'http://114.35.65.114:3000'
  },
  
}

module.exports = nextConfig
