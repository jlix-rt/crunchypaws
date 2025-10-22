export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',
  wsUrl: 'ws://localhost:3001',
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
    socialLogin: false,
    pushNotifications: false,
    offlineMode: false
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
      publishableKey: 'pk_test_...',
      enabled: false
    },
    paypal: {
      clientId: '...',
      enabled: false
    }
  },
  analytics: {
    googleAnalytics: {
      trackingId: 'GA_TRACKING_ID',
      enabled: false
    },
    facebookPixel: {
      pixelId: 'FB_PIXEL_ID',
      enabled: false
    }
  },
  seo: {
    baseUrl: 'https://crunchypaws.com',
    defaultTitle: 'CrunchyPaws - Tienda de Mascotas en Guatemala',
    defaultDescription: 'La mejor tienda de mascotas en Guatemala. Alimentos, accesorios, juguetes y más para perros y gatos.',
    defaultImage: 'https://crunchypaws.com/assets/images/og-image.jpg'
  }
};



