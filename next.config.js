const runtimeCaching = require('next-pwa/cache');
const withPreact = require('next-plugin-preact');
const withPlugins = require('next-compose-plugins')
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: true,
})
// const nodeExternals = require('webpack-node-externals');
const withPWA = require('next-pwa')({
    dest: 'public',
    // disable: process.env.NODE_ENV === 'development',
    register: true,
    // scope: '/app',
    sw: 'service-worker.js',
    runtimeCaching
    //...
});

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  child-src daily-mephi.ru;
  style-src 'self' daily-mephi.ru;
  font-src 'self';
`;

const securityHeaders = [
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
    },
    {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    },
    {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    },
    {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin'
    }
];

// if (process.env.NODE_ENV === 'production') {
//     securityHeaders.push({
//         key: 'Content-Security-Policy',
//         value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
//     });
// }

// const sharp = 'commonjs sharp';

/** @type {import('next').NextConfig} */
let nextConfig =
    {
        target: 'serverless',
        swcMinify: true,
        reactStrictMode: true,
        webpack: (config, options) => {
            config.experiments = {layers: true, topLevelAwait: true};

            config.externals = [
                ...config.externals,
                'argon2',
                'chrome-aws-lambda',
                'node-fetch',
                'natural',
                'puppeteer-core'
            ]
            // if (!options.isServer) {
            //     config.externals = [nodeExternals()]
            // } else {
            //     config.externals = [
            //         ...config.externals,
            //         'argon2',
            //         'chrome-aws-lambda',
            //         'node-fetch',
            //         'natural',
            //         'puppeteer-core'
            //     ]
            // }


            config.resolve.alias = {
                ...config.resolve.alias,
                'react-ssr-prepass': 'preact-ssr-prepass',
                // 'mock-aws-s3': 'aliases/null-alias.js',
                // 'aws-sdk': 'aliases/null-alias.js',
                // 'nock': 'aliases/null-alias.js',
                // 'node-gyp': 'aliases/null-alias.js',
                // 'npm': 'aliases/null-alias.js',
            }

            if (options.isServer) {
                config.plugins = [...config.plugins, new PrismaPlugin()]
            }

            return config;
        },
        experimental: {
            esmExternals: false
        },

        async headers() {
            return [
                {
                    // Apply these headers to all routes in your application.
                    source: '/:path*',
                    headers: securityHeaders
                }
            ];
        },
        // module: {
        //     rules: [
        //         {
        //             test: /\.sql$/i,
        //             use: 'raw-loader'
        //         }
        //     ]
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
    };
//https://www.npmjs.com/package/next-pwa

// module.exports = withPreact(withPWA(withBundleAnalyzer(nextConfig)));

module.exports = withPlugins([
    [withBundleAnalyzer],
    [withPWA],
    [withPreact],
    // your other plugins here
], nextConfig);
