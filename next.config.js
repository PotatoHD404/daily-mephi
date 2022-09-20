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
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
];

if (process.env.NODE_ENV === 'production') {
  securityHeaders.push({
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  });
}

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
    async headers() {
        return [
          {
            // Apply these headers to all routes in your application.
            source: '/:path*',
            headers: securityHeaders,
          },
        ];
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
