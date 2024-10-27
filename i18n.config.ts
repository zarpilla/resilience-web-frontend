export default defineI18nConfig(() => ({
  legacy: false,
  locale: "ca",
  locales: [
    { code: "en", displayName: "ENG" },
    { code: "ca", displayName: "CAT" },
    { code: "es", displayName: "ESP" },
  ],
  messages: {
    en: {
      welcome: "Welcome to",
      en: "ENG",
      ca: "CAT",
      es: "ESP",
    },
    ca: {
      welcome: "Benvinguda a",
      en: "ENG",
      ca: "CAT",
      es: "ESP",
    },
    es: {
      welcome: "Bienvenida a",
      en: "ENG",
      ca: "CAT",
      es: "ESP",
    },
  },
}));
