// const withPWA = require('next-pwa');
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.experiments = {layers: true, topLevelAwait: true};
        return config;
    },
    experimental: {
        esmExternals: false
    },
    // pwa: {
    //     dest: 'public',
    //     disable: process.env.NODE_ENV === 'development',
    //     register: true,
    //     // scope: '/app',
    //     sw: 'service-worker.js',
    //     //...
    // },
    module: {
        rules: [
            {
                test: /\.*$/,
                exclude: [
                    './database/'
                ]
            }
        ]
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
}
//https://www.npmjs.com/package/next-pwa

// module.exports = withPWA(nextConfig)
module.exports = nextConfig