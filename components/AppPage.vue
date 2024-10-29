<script setup lang="ts">
const { locale } = useI18n();

const props = defineProps<{
  slug: string;
  type: string;
}>();

const populate = {
  "populate[metadata][shareImage]": "*",
  "populate[localizations]": "*",
  "populate[sections][populate]": "*",
  status: "published",
  locale,
};
const { data: pages } = await useAPI("/api/pages", {
  query: {
    "filters[slug][$eq]": props.slug,
    "filters[type][$eq]": props.type,
    ...populate,
  },
});

const documents = pages.value as any;

if (pages.value && documents.data && documents.data.length === 0) {
  throw new Error("Page not found!");
}

const page = documents.data[0];

const { data: sections } = await useAPI(
  "/api/pages/sections/" + page.documentId,
  {}
);

const sectionsData = sections.value as any;
page.sections = sectionsData.sections;

const headerStore = useHeaderStore();
const header = computed<any>(() =>
  headerStore.headers.find((h) => h.locale === locale.value)
);

const seoTitleSufix = header.value.value?.seoTitleSufix;

useHead({
  title: (page.metadata?.metaTitle || page.name) + seoTitleSufix,
  meta: [
    { name: "description", content: page.metadata?.metaDescription || "" },
  ],
  bodyAttrs: {
    class: `page-type-${props.type} page-slug-${props.slug}`,
  },
});

const shareImage = page.metadata?.shareImage?.url
  ? `${process.env.API_BASE_URL}${page.metadata?.shareImage?.url}`
  : null;

useSeoMeta({
  title: (page.metadata?.metaTitle || page.name) + seoTitleSufix,
  ogTitle: (page.metadata?.metaTitle || page.name) + seoTitleSufix,
  description: page.metadata?.metaDescription || "",
  ogDescription: page.metadata?.metaDescription || "",
  ogImage: shareImage,
  twitterCard: "summary_large_image",
});

const modeStore = useModeStore();

onMounted(() => {  
  console.log("onMounted");
  setTimeout(() => {
    window.dispatchEvent(new Event("init-theme"));
  }, 200);
  
  if (page.headerColorMode){
    modeStore.setPageHeaderColorMode(page.headerColorMode);
  }
  
  if (page.pageCss) {
    document.body.classList.add(page.pageCss);
  }
});

onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
  if (page.pageCss) {
    document.body.classList.remove(page.pageCss);
  }
});

</script>
<template>
  <AppCursor></AppCursor>
  <AppHeader :color-mode="page.headerColorMode" :slug="slug"></AppHeader>
  <div class="main-content">
    <div class="section" v-for="section in page.sections" :key="section.id">
      <AppSection :section="section" :slug="slug">
        <SectionsHero
          v-if="section.__component === 'sections.hero'"
          :section="section"
        ></SectionsHero>
        <SectionsColumns
          v-else-if="section.__component === 'sections.columns'"
          :section="section"
        ></SectionsColumns>
        <SectionsMenu
          v-else-if="section.__component === 'sections.menu'"
          :section="section"
        >
        </SectionsMenu>
        <SectionsSlider
          v-else-if="section.__component === 'sections.slider'"
          :section="section"
        >
        </SectionsSlider>
        <SectionsScroller
          v-else-if="section.__component === 'sections.scroller'"
          :section="section"
        >
        </SectionsScroller>
        <SectionsBlurbs
          v-else-if="section.__component === 'sections.blurbs'"
          :section="section"
        >
        </SectionsBlurbs>
        <SectionsBios
          v-else-if="section.__component === 'sections.bios'"
          :section="section">
        </SectionsBios>
        <!-- <div v-else-if="section.__component === 'sections.image'"></div>
        <pre v-else>{{ section }}</pre> -->
      </AppSection>

      <!-- <h1>Page</h1>
    <p>{{ $t("welcome") }} '{{ slug }}'</p>
    <pre>
      {{ page }}
    </pre> -->
    </div>
  </div>
  <AppFooter :slug="slug"></AppFooter>
</template>
