module.exports = {
    reactStrictMode: true,
    swcMinify: false, // disables minification to avoid the plugin crash
    webpack: (config) => {
        config.optimization.minimize = false // extra safeguard
        return config
    },
    devIndicators: {
        port: 3001, // Set custom port for development server
    },
}
