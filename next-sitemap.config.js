/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.NEXTAUTH_URL || 'https://daily-mephi.ru',
    generateRobotsTxt: true, // (optional)
    changefreq: 'daily',
    priority: 0.7,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
        ]
    },
    // ...other options
}

module.exports = config
