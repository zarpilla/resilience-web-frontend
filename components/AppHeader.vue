<script setup lang="ts">
import { useHeaderStore } from "~/stores/header";
const { locale, setLocale, availableLocales } = useI18n();
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

defineProps<{
  slug: string;
}>();

const headerStore = useHeaderStore();
const header = computed(() =>
  headerStore.headers.find((h) => h.locale === locale.value)
);

const setLocaleLanguage = async (lang: string) => {
  setLocale(lang);
};


</script>
<template>
  <header>
    <h1>Header</h1>
    <pre>
header: {{ header }}
        </pre
    >

    <pre>
locale: {{ locale }}
      </pre
    >
    <div>
      
      <nuxt-link v-for="loc in availableLocales" :key="loc" :to="switchLocalePath(loc)">
    {{ loc }}<br>
  </nuxt-link>

      
      <p>{{ $t("welcome") }} header!</p>
    </div>
  </header>
</template>
