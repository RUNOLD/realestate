/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://ayoolarealestate.com',
    generateRobotsTxt: true,
    exclude: ['/admin', '/admin/*', '/dashboard', '/dashboard/*'],
    robotsTxtOptions: {
        additionalSitemaps: [
            // Add any additional sitemaps here if needed
        ],
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/dashboard'],
            },
        ],
    },
}
