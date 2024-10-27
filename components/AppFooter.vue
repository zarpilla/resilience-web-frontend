<script setup lang="ts">
import { useFooterStore } from "~/stores/footer";
const { locale, setLocale, availableLocales } = useI18n();

defineProps<{
  slug: string;
}>();

const footerStore = useFooterStore();
const footer = computed(() =>
  footerStore.footers.find((h) => h.locale === locale.value)
);

const setLocaleLanguage = async (lang: string) => {
  setLocale(lang);
};
</script>
<template>
  <footer>
    <h1>Footer</h1>
    <!-- <pre
      >{{ footer }}
      </pre
    > -->
  </footer>
</template>
