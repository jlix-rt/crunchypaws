export const environment = {
  production: true,
  apiBaseUrl: '/api',
  assetsBaseUrl: '/assets',
  featureFlags: {
    infiniteScroll: true,
    showBadges: true,
    enableCoupons: true,
    enableWhatsApp: true,
    enableGuestCheckout: true,
  },
  seo: {
    siteName: 'CrunchyPaws',
    defaultTitle: 'CrunchyPaws - Productos Deshidratados para Mascotas',
    defaultDescription: 'Los mejores productos deshidratados para perros y gatos. 100% naturales, sin conservantes.',
    defaultImage: 'https://crunchypaws.com/assets/images/og-image.jpg',
    twitterHandle: '@crunchypaws',
  },
  analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX', // Replace with actual ID
    facebookPixelId: 'XXXXXXXXXX', // Replace with actual ID
  },
  payment: {
    stripePublishableKey: 'pk_live_XXXXXXXXXX', // Replace with actual key
  },
};
