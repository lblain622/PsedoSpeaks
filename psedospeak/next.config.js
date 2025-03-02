const nextConfig = {
    experimental: {
        runtime: "edge", // Use Edge Runtime
        serverComponents: true, // Enable Server Components (if needed)
    },
    output: "standalone", // Generate a standalone build for OpenNext
};

module.exports = nextConfig;
