/** @type {import('next').NextConfig} */
const SUPABASE_HOST = (() => {
  try {
    const u = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
    return u.hostname || 'localhost';
  } catch {
    return 'localhost';
  }
})();

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'emunicipal.telangana.gov.in', pathname: '/**' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com', pathname: '/**' },
      { protocol: 'https', hostname: 'pbs.twimg.com', pathname: '/**' },
      { protocol: 'https', hostname: SUPABASE_HOST, pathname: '/storage/v1/object/**' },
    ],
  },
  allowedDevOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.56.1'],
  webpack: (config) => {
    // Avoid large persistent cache files that can cause ArrayBuffer allocation failures in some environments
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
