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
        config.resolve.alias = {
            ...config.resolve.alias,
            // 'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
            // react: 'preact-compat'
            // 'react-dom/test-utils': 'preact/test-utils',
            // 'react-dom': 'preact/compat',
            // 'react/jsx-runtime'    : 'preact/jsx-runtime',
            // 'react/jsx-dev-runtime': 'preact/jsx-dev-runtime'
        }
        return config;
    },
    experimental: {
        esmExternals: false,

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
    images: {
        unoptimized: true,
        domains: ['mc.yandex.ru']
    },
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
