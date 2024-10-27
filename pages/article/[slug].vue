<script setup lang="ts">
import Page from "~/components/AppPage.vue";
import { useRoute } from "vue-router";

defineI18nRoute({
    paths: {
      en: '/article/[slug]',
      es: '/articulo/[slug]',
      ca: '/article/[slug]'
    }
  })

const route = useRoute();
const slug = route.params.slug as string;
</script>

<template>
  <Page :slug="slug" type="article" />
</template>
