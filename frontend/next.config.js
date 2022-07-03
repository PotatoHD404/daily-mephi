// const withPWA = require('next-pwa');
const {IgnorePlugin} = require('webpack');
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        const plugins = config.plugins || [];
        const lazyImports = [
            '@nestjs/microservices/microservices-module',
            '@nestjs/websockets/socket-module',
        ];
        config.plugins = [
            ...plugins,
            new IgnorePlugin({
                checkResource(resource) {
                    if (lazyImports.includes(resource)) {
                        try {
                            require.resolve(resource);
                        } catch (err) {
                            return true;
                        }
                    }
                    return false;
                },
            }),
        ];
        config.output = {
            ...config.output,
            libraryTarget: 'commonjs2',
        }
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
        ],
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