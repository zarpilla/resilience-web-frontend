<script setup lang="ts">
const { locale } = useI18n();

const props = defineProps<{
  slug: string;
  type: string;
}>();

const populate = {
  "populate[0]": "metadata",
  "populate[1]": "metadata.shareImage",
  "populate[2]": "localizations",
  "populate[3]": "sections",
};
const { data: pages } = await useAPI("/api/pages", {
  query: {
    "filters[slug][$eq]": props.slug,
    "filters[type][$eq]": props.type,
    locale,
    ...populate,
  },
});

const populateSections = {
  "populate[sections][populate]": "*",
};

const { data: sections } = await useAPI("/api/pages", {
  query: { "filters[slug][$eq]": props.slug, locale, ...populateSections },
});

const documents = pages.value as any;

if (pages.value && documents.data && documents.data.length === 0) {
  throw new Error("Page not found!");
}

const sectionsData = sections.value as any;
const page = documents.data[0];
page.sections = sectionsData.data[0].sections;

useHead({
  title: page.metadata?.metaTitle || page.name,
  meta: [
    { name: "description", content: page.metadata?.metaDescription || "" },
  ],
  bodyAttrs: {
    class: `page-type-${props.type}`,
  },
});

const shareImage = page.metadata?.shareImage?.url ? `${process.env.API_BASE_URL}${page.metadata?.shareImage?.url}` : null;

useSeoMeta({
  title: page.metadata?.metaTitle || page.name,
  ogTitle: page.metadata?.metaTitle || page.name,
  description: page.metadata?.metaDescription || '',
  ogDescription: page.metadata?.metaDescription || '',
  ogImage: shareImage,
  twitterCard: 'summary_large_image',
})

</script>
<template>
  <AppHeader :slug="slug"></AppHeader>
  <div class="main-content">
    <h1>Page</h1>
    <p>{{ $t("welcome") }} '{{ slug }}'</p>
    <pre>
      {{ page }}
    </pre>
  </div>
  <AppFooter :slug="slug"></AppFooter>
</template>
