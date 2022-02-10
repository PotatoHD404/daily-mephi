/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.experiments = {layers: true, topLevelAwait: true};
        return config;
    },
    experimental: {
        esmExternals: false
    }
}

module.exports = nextConfig
