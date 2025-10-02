export const environment = {
  production: false,
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
    defaultImage: '/assets/images/og-image.jpg',
    twitterHandle: '@crunchypaws',
  },
  analytics: {
    googleAnalyticsId: '', // Add in production
    facebookPixelId: '', // Add in production
  },
  payment: {
    stripePublishableKey: '', // Add if using Stripe
  },
};
