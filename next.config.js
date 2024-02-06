const runtimeCaching = require('next-pwa/cache');
// const withPreact = require('next-plugin-preact');
const {PrismaPlugin} = require('@prisma/nextjs-monorepo-workaround-plugin')

const cachingStrategies = require('./pwa/cache');
// const nodeExternals = require('webpack-node-externals');
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    // scope: '/app',
    sw: 'service-worker.js',
    runtimeCaching: cachingStrategies
    //...
});

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' https://mc.yandex.ru https://yastatic.net https://www.google.com https://www.gstatic.com https://mc.yandex.com gc.kis.v2.scr.kaspersky-labs.com ajax.cloudflare.com cloudflareinsights.com static.cloudflareinsights.com 'unsafe-inline';
  img-src data: 'self' https://mc.yandex.ru https://mc.yandex.com https://authjs.dev https://daily-mephi.ru https://www.notion.so;
  connect-src 'self' https://mc.yandex.ru https://mc.yandex.com fonts.googleapis.com fonts.gstatic.com https://www.google.com https://www.gstatic.com cloudflareinsights.com static.cloudflareinsights.com;
  child-src blob: 'self' https://mc.yandex.ru https://mc.yandex.com;
  font-src 'self' https://fonts.gstatic.com;
  style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
  frame-src blob: 'self' https://mc.yandex.ru https://mc.yandex.com https://www.google.com https://www.donationalerts.com;
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

if (process.env.NODE_ENV === 'production') {
    const header_value = ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim();
    securityHeaders.push({
        key: 'Content-Security-Policy',
        value: header_value
    });
    // console.log(header_value)
}

// const sharp = 'commonjs sharp';

/** @type {import('next').NextConfig} */
let nextConfig =
    {
        // target: 'serverless',
        // compiler: {
        //     styledComponents: true
        // },
        swcMinify: true,
        reactStrictMode: true,
        staticPageGenerationTimeout: 30,
        output: "standalone",
        webpack: (config, options) => {
            config.experiments = {layers: true, topLevelAwait: true};

            config.externals = [
                ...config.externals,
                'argon2',
                '@sparticuz/chromium',
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
                // 'react-ssr-prepass': 'preact-ssr-prepass',
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
            esmExternals: false,
            nextScriptWorkers: true,
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
function withPlugins(plugins, config) {
    plugins.forEach(plugin => {
        config = plugin(config)
    })
    return config
}

module.exports = withPlugins([
    withPWA,
    // withPreact
], nextConfig);
