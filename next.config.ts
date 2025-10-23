import type {NextConfig} from 'next';

// Derive Supabase storage hostname from env so Next/Image can allow it
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseHost: string | undefined;
try {
  supabaseHost = new URL(supabaseUrl).hostname;
} catch {}

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'emunicipal.telangana.gov.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '/**',
      },
      ...(supabaseHost
        ? [{ protocol: 'https' as const, hostname: supabaseHost, port: '', pathname: '/**' }]
        : []),
    ],
  },
};

export default nextConfig;