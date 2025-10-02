module.exports = {
    siteUrl: process.env.SITE_URL || 'http://localhost:3001', // Replace with your production URL
    generateRobotsTxt: true, // Generate robots.txt file
    exclude: ['/admin/*'], // Exclude specific paths (optional)
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
            {
                userAgent: '*',
                disallow: '/admin/',
            },
        ],
    },
}
