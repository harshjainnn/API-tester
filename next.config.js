/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['mikro-orm', 'better-sqlite3'],
};

module.exports = nextConfig;
