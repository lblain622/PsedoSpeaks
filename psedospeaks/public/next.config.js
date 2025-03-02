/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone", // Genera archivos listos para un servidor externo
    experimental: {
        appDir: true,
    },
};

module.exports = nextConfig;


