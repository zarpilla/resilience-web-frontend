<script setup lang="ts">
const { locale } = useI18n();

const props = defineProps<{
  slug: string;
  type: string;
}>();

const populate = {
  // "populate[metadata][shareImage]": "*",
  // "populate[localizations]": "*",
  // "populate[sections][populate]": "*",
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
page.metadata = sectionsData.metadata;
page.localizations = sectionsData.localizations;

const { data: templates } = await useAPI(
  "/api/pages/templates/" + page.type,
  {}
);

const templatesData = templates.value as any;

if (templatesData && templatesData.sections) {
  // contact templatesData.sections to page sections
  for (const section of templatesData.sections) {
    const existingSection = page.sections.find(
      (s: any) => s.id === section.id
    );
    if (!existingSection) {
      page.sections.push(section);
    }
  }

}


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

  setTimeout(() => {
    window.dispatchEvent(new Event("init-theme"));
  }, 200);

  // console.log('set page.headerColorMode', page.headerColorMode);

  // if (page.headerColorMode) {
  //   modeStore.setPageHeaderColorMode(page.headerColorMode);
  //   document.body.classList.add('header-' + page.headerColorMode);
  // }

  if (page.pageCss) {
    document.body.classList.add(page.pageCss);
  }
});

onBeforeUnmount(() => {
  if (page.headerColorMode) {
    document.body.classList.remove('header-' + page.headerColorMode);
  }
  if (page.pageCss) {
    document.body.classList.remove(page.pageCss);
  }
});
</script>
<template>
  <AppCursor></AppCursor>
  <AppHeader :slug="slug" :color-mode="page.headerColorMode"></AppHeader>
  <div class="main-content">
    <template v-for="(section, i) in page.sections" :key="section.id">
      <div class="section">
        <AppSection :section="section" :slug="slug" :type="props.type">
          <SectionsScroller
            v-if="section.__component === 'sections.scroller'"
            :section="section"
          >
          </SectionsScroller>
          <SectionsHero
            v-if="section.__component === 'sections.hero'"
            :section="section"
            :section-index="i"
            :type="props.type"
            :slug="slug"
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
          <SectionsBlurbs
            v-else-if="section.__component === 'sections.blurbs'"
            :section="section"
          >
          </SectionsBlurbs>
          <SectionsBios
            v-else-if="section.__component === 'sections.bios'"
            :section="section"
          >
          </SectionsBios>
          <SectionsBlog
            v-else-if="section.__component === 'sections.blog'"
            :section="section"
          >
          </SectionsBlog>
          <SectionsMasonry
            v-else-if="section.__component === 'sections.masonry'"
            :section="section"
          >
          </SectionsMasonry>
          <SectionsCapabilities
            v-else-if="section.__component === 'sections.capabilities'"
            :section="section"
          >
          </SectionsCapabilities>
          <SectionsTimeline
            v-else-if="section.__component === 'sections.timeline'"
            :section="section"
          >
          </SectionsTimeline>
        </AppSection>
      </div>
    </template>
  </div>
  <AppFooter :slug="slug"></AppFooter>
</template>
<style scoped lang="scss">
.main-content{
  width: 100vw;  
}
</style>
