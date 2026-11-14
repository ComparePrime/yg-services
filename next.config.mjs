/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  /**
   * L'ancienne page « Admin & optimisation » devient « Assistance
   * administrative » : le mot optimisation ne correspond plus aux
   * prestations. Redirection permanente pour conserver l'indexation et
   * les liens existants.
   */
  async redirects() {
    return [
      {
        source: '/admin-optimisation',
        destination: '/assistance-administrative',
        permanent: true,
      },
      // Article dépublié : les prestations d'assurance ne font plus partie
      // du positionnement. L'URL était indexée, elle est redirigée.
      {
        source: '/blog/faire-le-point-sur-ses-assurances-suisse',
        destination: '/blog',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
