<script setup lang="ts">
import Page from "~/components/AppPage.vue";

import { useRoute } from "vue-router";

const route = useRoute();
const slug = route.params.slug as string;

watch(() => route.params.slug, () => {
  console.log("slug", route.params.slug);
});

</script>

<template>
  <Page :slug="slug" type="page" />
</template>
