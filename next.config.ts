import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  webpack: (config, context) => {
    config.module.rules.push({
      test: /\.(graphql|gql)/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader"
    });

    return config;
  }
}
 
export default nextConfig