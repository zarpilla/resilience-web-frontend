<script setup lang="ts">
const { locale } = useI18n();

const props = defineProps<{
  slug: string;
  type: string;
}>();

const populate = {
  status: "published",
  locale: locale.value,
  populate: "*",
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
  const { data: pages } = await useAPI("/api/pages", {
  query: {
    "filters[slug][$eq]": "page-not-found",
    "filters[type][$eq]": "page",
    ...populate,
  },
  });
  // throw new Error("Page not found!");
  documents.data = (pages.value as any).data;
}

const page = documents.data[0];

const { data: sections } = await useAPI(
  "/api/pages/sections/" + page.documentId,
  { query: { locale: locale.value } }
);

const sectionsData = sections.value as any;
const pageSections = [...sectionsData.sections];

const { data: templateInfo } = await useAPI(
  "/api/pages/templates/" + page.type + "-information",
  {
    query: {
      locale: locale.value,
    },
  }
);

// sectionInfo
const sectionInfoIndex = props.type === "resource" ? 2 : 1;

if (templateInfo.value && pageSections.length >= sectionInfoIndex) {
  let section = JSON.parse(JSON.stringify(pageSections[sectionInfoIndex]));
  if (section.__component === "sections.columns") {
    const templateInfoData = templateInfo.value as any;

    if (templateInfoData.sections) {
      const templateColumn0 = templateInfoData.sections[0].columns[0];
      const templateColumn1 = templateInfoData.sections[0].columns[1];
      if (templateColumn0.text && templateColumn0.text.length) {
        const type = page.typology?.name;
        const author = page.author;
        const year = page.year?.name;
        const tags = page.tags;
        const tagsString = tags
          ? tags.map((tag: any) => tag.name).join(", ")
          : "-";
        const scopes = page.scopes;
        const scopesString = scopes
          ? scopes.map((scope: any) => scope.name).join(", ")
          : "-";
        for (const textNode of templateColumn0.text) {
          if (textNode && textNode.children) {
            for (const child of textNode.children) {
              if (child && child.text) {
                if (child.text.includes("{type}")) {
                  child.text = child.text.replace("{type}", type ?? "-");
                }
                if (child.text.includes("{authors}")) {
                  child.text = child.text.replace("{authors}", author ?? "-");
                }
                if (child.text.includes("{year}")) {
                  child.text = child.text.replace("{year}", year ?? "-");
                }
                if (child.text.includes("{tags}")) {
                  child.text = child.text.replace("{tags}", tagsString ?? "-");
                }
                if (child.text.includes("{scopes}")) {
                  child.text = child.text.replace(
                    "{scopes}",
                    scopesString ?? "-"
                  );
                }
              }
            }
          }
        }
      }
      section.columns.unshift(templateColumn1);
      section.columns.unshift(templateColumn0);

      pageSections[sectionInfoIndex] = section;
      pageSections[sectionInfoIndex].styles.container = "normal";
    }
  }
}

// listenElement

switch (props.type) {
  case "resource":
    // get the 3rd section and last column
    if (
      pageSections.length > 2 &&
      pageSections[2].__component === "sections.columns" &&
      pageSections[2].columns.length
    ) {
      pageSections[2].columns[
        pageSections[2].columns.length - 1
      ].listenAudioBefore = true;
    }
    break;
  case "zscope":
    // get the 2rd section and 1st column
    if (
      pageSections.length > 1 &&
      pageSections[1].__component === "sections.columns" &&
      pageSections[1].columns.length
    ) {
      pageSections[1].columns[0].listenAudioAfter = true;
    }
    break;
  case "capability":
    if (
      pageSections.length > 1 &&
      pageSections[1].__component === "sections.columns" &&
      pageSections[1].columns.length
    ) {
      pageSections[1].columns[0].listenAudioBefore = true;
    }
    break;
  case "article":
  case "service":
    // get the 1st section and 1st column
    pageSections[0].listenAudioAfter = true;
    break;
  default:
    // do nothing for other types
    break;
}

page.sections = pageSections;
page.metadata = sectionsData.metadata;
page.localizations = sectionsData.localizations;

const { data: templates } = await useAPI("/api/pages/templates/" + page.type, {
  query: {
    locale: locale.value,
  },
});

const templatesData = templates.value as any;

if (templatesData && templatesData.sections) {
  // contact templatesData.sections to page sections
  for (const section of templatesData.sections) {
    const existingSection = page.sections.find((s: any) => s.id === section.id);
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

  if (page.pageCss) {
    document.body.classList.add(page.pageCss);
  }
});

onBeforeUnmount(() => {
  if (page.headerColorMode) {
    document.body.classList.remove("header-" + page.headerColorMode);
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
        <AppSection
          v-if="section.__component !== 'sections.template'"
          :section="section"
          :slug="slug"
          :type="props.type"
          :index="i"
        >
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
            :audio="page.audio"
          ></SectionsHero>
          <SectionsColumns
            v-else-if="section.__component === 'sections.columns'"
            :section="section"
            :audio="page.audio"
          ></SectionsColumns>
          <SectionsTabs
            v-else-if="section.__component === 'sections.tabs'"
            :section="section"
          ></SectionsTabs>
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
            :page-size="section.pageSize"
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
          <SectionsVideo
            v-else-if="section.__component === 'sections.video'"
            :section="section"
          >
          </SectionsVideo>
          <SectionsEcosystem
            v-else-if="section.__component === 'sections.ecosystem'"
            :section="section"
          >
          </SectionsEcosystem>
          <SectionsLeadForm
            v-else-if="section.__component === 'sections.lead-form'"
            :section="section"
          >
          </SectionsLeadForm>
        </AppSection>
      </div>
    </template>
  </div>
  <AppFooter :slug="slug"></AppFooter>
</template>
<style scoped lang="scss">
.main-content {
  width: 100vw;
}
</style>
