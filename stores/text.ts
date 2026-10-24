import { defineStore } from "pinia";

interface Text {
  locale: string;
  value: any;
}
export const useTextStore = defineStore("textStore", {
  state: () => ({
    texts: [] as Text[],
  }),
  actions: {
    async fetch(locale: string) {
      const { data: texts } = await useAPI("/api/text", { query: { locale, populate: '*' } });
      this.texts.push({
        locale: locale,
        value: JSON.parse(JSON.stringify(texts.value)),
      });
    },
  },
  getters: {
    text(): Text {
      // useI18n() only works at the top of setup(); getters run anywhere
      const locale = useNuxtApp().$i18n.locale;
      return this.texts.find((h: Text) => h.locale === locale.value)?.value;
    },
  },
});
