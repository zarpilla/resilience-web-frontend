<script setup lang="ts">
import Page from "~/components/AppPage.vue";
import { useRoute } from "vue-router";

defineI18nRoute({
    paths: {
      en: '/resource/[slug]',
      es: '/recurso/[slug]',
      ca: '/recurs/[slug]'
    }
  })

const route = useRoute();
const slug = route.params.slug as string;
</script>

<template>
  slug: {{ slug }}
  <Page :slug="slug" type="resource" />
</template>
