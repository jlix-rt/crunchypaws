export const environment = {
  production: true,
  apiUrl: 'https://api.crunchypaws.com/api',
  wsUrl: 'wss://api.crunchypaws.com',
  appName: 'CrunchyPaws',
  appVersion: '1.0.0',
  defaultLanguage: 'es-GT',
  supportedLanguages: ['es-GT', 'en-US'],
  currency: 'GTQ',
  currencySymbol: 'Q',
  country: 'GT',
  timezone: 'America/Guatemala',
  features: {
    wishlist: true,
    reviews: true,
    loyalty: true,
    referrals: true,
    socialLogin: true,
    pushNotifications: true,
    offlineMode: true
  },
  social: {
    facebook: 'https://www.facebook.com/crunchypaws',
    instagram: 'https://www.instagram.com/crunchypaws',
    whatsapp: 'https://wa.me/50212345678',
    twitter: 'https://twitter.com/crunchypaws'
  },
  contact: {
    phone: '+502-1234-5678',
    email: 'info@crunchypaws.com',
    address: 'Guatemala, Guatemala'
  },
  payment: {
    stripe: {
      publishableKey: 'pk_live_...',
      enabled: true
    },
    paypal: {
      clientId: '...',
      enabled: true
    }
  },
  analytics: {
    googleAnalytics: {
      trackingId: 'GA_TRACKING_ID',
      enabled: true
    },
    facebookPixel: {
      pixelId: 'FB_PIXEL_ID',
      enabled: true
    }
  },
  seo: {
    baseUrl: 'https://crunchypaws.com',
    defaultTitle: 'CrunchyPaws - Tienda de Mascotas en Guatemala',
    defaultDescription: 'La mejor tienda de mascotas en Guatemala. Alimentos, accesorios, juguetes y más para perros y gatos.',
    defaultImage: 'https://crunchypaws.com/assets/images/og-image.jpg'
  }
};



