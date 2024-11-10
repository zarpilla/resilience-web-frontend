<script setup lang="ts">
import Page from "~/components/AppPage.vue";

import { useRoute } from "vue-router";

const route = useRoute();
const slug = route.params.slug as string;

</script>

<template>
  <Page :slug="slug" type="page" />
</template>
