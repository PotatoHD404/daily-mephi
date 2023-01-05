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

// const sharp = "commonjs sharp";

/** @type {import('next').NextConfig} */


const nextConfig = withPWA(
    {
        target: 'serverless',
        swcMinify: true,
        reactStrictMode: true,
        webpack: (config) => {
            config.experiments = {layers: true, topLevelAwait: true};
            // add sharp to externals

            config.module.rules.push({
                test: /\.node$/,
                loader: "node-loader"
            })

            // use source-map-loader to load .js and cjs files
            config.module.rules.push({
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            });

            config.module.rules.push({
                test: /\.cjs$/,
                use: ["source-map-loader"],
                enforce: "pre"
            });

            config.module.rules.push({
                test: /\.ts/,
                use: ["source-map-loader"],
                enforce: "pre"
            });


            config.resolve.alias = {
                ...config.resolve.alias,
                'react-ssr-prepass': 'preact-ssr-prepass',
            }
            // config.externals = {...config.externals, sharp};

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
    });
//https://www.npmjs.com/package/next-pwa

module.exports = withPreact(nextConfig);
// module.exports = nextConfig
