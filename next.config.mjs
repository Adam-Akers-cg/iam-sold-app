/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx'],
    sassOptions: {
        includePaths: [process.cwd(), 'src/styles'],
    },
}

export default nextConfig
