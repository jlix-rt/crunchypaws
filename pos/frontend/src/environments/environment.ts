export const environment = {
  production: false,
  apiUrl: 'http://localhost:3002/api',
  wsUrl: 'ws://localhost:3002',
  appName: 'CrunchyPaws POS',
  appVersion: '1.0.0',
  defaultLanguage: 'es-GT',
  currency: 'GTQ',
  currencySymbol: 'Q',
  country: 'GT',
  timezone: 'America/Guatemala',
  features: {
    barcodeScanner: true,
    thermalPrinter: true,
    offlineMode: true,
    realTimeUpdates: true
  },
  printer: {
    thermal: {
      enabled: false,
      url: 'http://localhost:9100'
    }
  },
  scanner: {
    enabled: false,
    port: 'COM3'
  },
  social: {
    whatsapp: 'https://wa.me/50212345678',
    facebook: 'https://www.facebook.com/crunchypaws'
  }
};



