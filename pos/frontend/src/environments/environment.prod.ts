export const environment = {
  production: true,
  apiUrl: 'https://api.crunchypaws.com/api/pos',
  wsUrl: 'wss://api.crunchypaws.com',
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
      enabled: true,
      url: 'http://localhost:9100'
    }
  },
  scanner: {
    enabled: true,
    port: 'COM3'
  },
  social: {
    whatsapp: 'https://wa.me/50212345678',
    facebook: 'https://www.facebook.com/crunchypaws'
  }
};



