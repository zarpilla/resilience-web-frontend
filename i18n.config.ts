export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'ca',
    locales: [
        { code: 'en', iso: 'en-US' },
        { code: 'ca', iso: 'ca-ES' },
        { code: 'es', iso: 'es-ES' }
        ],
    messages: {
      en: {
        welcome: 'Welcome to'
      },
      ca: {
        welcome: 'Benvinguda a'
      },
      es: {
        welcome: 'Bienvenida a'
      }
    }
  }))
  