import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MSC Admin Portal',
    short_name: 'MSC Admin',
    description: 'Admin Dashboard for Mighty Spark Communications',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#F0564A',
    icons: [
      {
        src: '/images/MSC LOGO BITTERSWEET VECTOR (1).svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable'
      }
    ],
  }
}
