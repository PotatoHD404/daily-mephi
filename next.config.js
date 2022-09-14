// const path = require("path");

const runtimeCaching = require('next-pwa/cache');
const withPreact = require('next-plugin-preact')
const withPWA = require('next-pwa')({
    dest: 'public',
    // disable: process.env.NODE_ENV === 'development',
    register: true,
    // scope: '/app',
    sw: 'service-worker.js',
    runtimeCaching
    //...
});


/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    reactStrictMode: true,
    webpack: (config) => {
        config.experiments = {layers: true, topLevelAwait: true};
        return config;
    },
    experimental: {
        esmExternals: false,
        images: {
            unoptimized: true,
            allowFutureImage: true
        }
    },
    // module: {
    //     rules: [
    //         {
    //             test: /\.*$/,
    //             exclude: [
    //                 './parsing/'
    //             ]
    //         }
    //     ],
    // },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: false
    }
});
//https://www.npmjs.com/package/next-pwa

module.exports = withPreact(nextConfig);
// module.exports = nextConfig
