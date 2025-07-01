<script setup lang="ts">
const { locale } = useI18n();

const props = defineProps<{
  slug: string;
}>();

const populate = {
  populate: "*",
  //"populate[mainImage]": "*",
  //"populate[largeImage]": "*",
  status: "published",
  locale: locale.value,
};
const { data: pages } = await useAPI("/api/bios", {
  query: {
    "filters[slug][$eq]": props.slug,
    ...populate,
  },
});

const documents = pages.value as any;

if (pages.value && documents.data && documents.data.length === 0) {
  throw new Error("Bio Page not found!");
}

const page = documents.data[0];

const { data: templates } = await useAPI("/api/pages/templates/bio", {
  query: {
    locale: locale.value,
  },
});

const templatesData = templates.value as any;

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
    class: `page-type-bio`,
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

  modeStore.setPageHeaderColorMode("dark");

  document.body.classList.add("page-bio");
  document.body.classList.add("header-dark");
  if (page.pageCss) {
    document.body.classList.add(page.pageCss);
  }
});

onBeforeUnmount(() => {
  document.body.classList.remove("page-bio");
  document.body.classList.remove("header-dark");
  if (page.pageCss) {
    document.body.classList.remove(page.pageCss);
  }
});

const columnsHero0 = {
  id: 0,
  __component: "sections.hero",
  styles: {
    backgroundColor: "#F2EEEA",
    //height: "75vh",
    cssClass: "align-bottom-left bio-hero cite",
    backgroundImage: page.mainImage,
    zcontainer: "small",
  },
  title: "<span class='orange lh-min'>“</span>" + page.title,
  titleHeading: "h1",
  align: "bottom-left",
  text: [
    {
      type: "paragraph",
      level: 1,
      css: "mb-0 mt-5",
      children: [
        {
          text: page.name,
          type: "text",
          bold: true,
          css: "mb-0 no-cite fw-500",
        },
      ],
    },
    {
      type: "paragraph",
      level: 1,
      children: [
        {
          text: page.position,
          type: "text",
          css: "mb-0 no-cite",
        },
      ],
    },
  ],
};

const columnsImage = {
  id: 1,
  __component: "sections.columns",
  styles: {
    backgroundColor: "#f0f0f0",
    cssClass: "bio-image d-block d-md-none",
  },
  columns: [
    {
      id: 1,
      styles: {
        cssClass: "col col-6 align-bottom-left",
      },
      media: page.mainImage,
    },
  ],
};

const columnsContent = {
  id: 2,
  __component: "sections.columns",
  columns: [
    {
      id: 2,
      title: page.excerpt,
      titleHeading: "h3",
      styles: {
        cssClass: "col-12 col-md-4 cite",
      },
    },
    {
      id: 3,
      text: "",
      styles: {
        cssClass: "col-12 col-md-1",
      },
    },
    {
      id: 4,
      text: page.content,
      styles: {
        cssClass: "col-12 col-md-7",
      },
    },
  ],
};

const columnsMedia = {
  id: 3,
  __component: "sections.columns",
  styles: {
    cssClass: "pt-2 my-0",
  },
  columns: [
    {
      id: 6,
      styles: {
        cssClass: "media-border-radius",
      },
      media: page.largeImage,
    },
  ],
};

console.log("page", page.more2);

const columnsMore = {
  id: 4,
  __component: "sections.columns",
  styles: {
    cssClass: "pt-2 my-0",
  },
  columns: [
    {
      id: 7,
      text: page.more1,
      styles: {
        cssClass: "col-12 col-md-5",
      },
    },
    {
      id: 8,
      text: "",
      styles: {
        cssClass: "col-12 col-md-2",
      },
    },
    {
      id: 9,
      text: page.more2,
      styles: {
        cssClass: "col-12 col-md-5",
      },
    },
  ],
};
</script>
<template>
  <AppCursor></AppCursor>
  <AppHeader color-mode="dark" :slug="slug"></AppHeader>
  <div class="main-content">
    <div class="section">
      <AppSection :section="columnsHero0" type="bio" :index="0">
        <SectionsHero
          :section="columnsHero0"
          :section-index="1"
          type="bio"
          slug="bio-item"
        ></SectionsHero>
      </AppSection>

      <AppSection :section="columnsImage" type="bio" :index="1">
        <SectionsColumns
          :section="columnsImage"
          type="bio"
          slug="bio-item"
        ></SectionsColumns>
      </AppSection>

      <AppSection :section="columnsContent" type="bio" :index="2">
        <SectionsColumns
          :section="columnsContent"
          type="bio"
          slug="bio-item"
        ></SectionsColumns>
      </AppSection>

      <AppSection :section="columnsMedia" type="bio" :index="3">
        <SectionsColumns
          :section="columnsMedia"
          type="bio"
          slug="bio-item"
        ></SectionsColumns>
      </AppSection>

      <AppSection
        :section="columnsMore"
        type="bio"
        v-if="page.more1 || page.more2"
        :index="4"
      >
        <SectionsColumns
          :section="columnsMore"
          type="bio"
          slug="bio-item"
        ></SectionsColumns>
      </AppSection>

      <template
        v-for="(section, i) in templatesData.sections"
        :key="section.id"
      >
        <div class="section">
          <AppSection :section="section" :slug="slug" type="bio" :index="i + 5">
            <SectionsScroller
              v-if="section.__component === 'sections.scroller'"
              :section="section"
            >
            </SectionsScroller>
            <SectionsHero
              v-if="section.__component === 'sections.hero'"
              :section="section"
              :section-index="i + 5"
              type="bio"
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
  </div>
  <AppFooter :slug="slug"></AppFooter>
</template>
<style lang="scss">
.align-bottom-left {
  text-align: left;
  align-items: flex-end;
}
.zbg-image-right {
  background-position: right;
  height: 350px;
  width: 100%;
  bottom: 0;
  background-size: contain;
  background-repeat: no-repeat;
}

.page-bio {
  .main-content > .section > .section-inner > .section-columns {
    height: 100%;
  }
  .main-content > .section > .section-inner {
    background-size: 650px auto;
    background-position: 75% bottom;

    &.bio-hero {
      @media (max-width: 767px) {
        background-image: none !important;
        height: auto !important;
        background-size: 100%;
        background-position: top center;
      }
    }
  }
  .section-inner-index-0 {
    .section-hero-inner {
      padding-top: 200px;
    }
  }
  .section-hero-inner {
    background-color: inherit !important;
    width: 45%;
    height: 650px !important;
    @media (max-width: 767px) {
      height: auto !important;
      padding-top: 140px;
    }
  }
  .section-sections-hero {
    h1 {
      margin-bottom: 4rem;
    }
    p {
      margin-bottom: 0rem;
    }
  }

  h6 {
    color: #898989;
    font-family: "PP Neue Montreal";
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 27px */
    letter-spacing: 0.18px;

    margin-bottom: 21px;
  }
}
</style>
