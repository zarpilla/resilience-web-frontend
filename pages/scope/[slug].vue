<script setup lang="ts">
import Page from "~/components/AppPage.vue";
import { useRoute } from "vue-router";

defineI18nRoute({
  paths: {
    en: "/scope/[slug]",
    es: "/ambito/[slug]",
    ca: "/ambit/[slug]",
  },
});

const route = useRoute();
const slug = route.params.slug as string;
</script>

<template>
  <Page :slug="slug" type="scope" />
</template>
