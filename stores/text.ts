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
      const { data: header } = await useAPI("/api/text", { query: { locale } });
      this.texts.push({
        locale: locale,
        value: JSON.parse(JSON.stringify(header.value)),
      });
    },
  },
  getters: {
    text(): Text {
      const { locale } = useI18n();
      return this.texts.find((h: Text) => h.locale === locale.value)?.value;
    },
  },
});
