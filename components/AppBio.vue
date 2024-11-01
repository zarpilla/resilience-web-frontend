<script setup lang="ts">
const { locale } = useI18n();

const props = defineProps<{
  slug: string;
}>();

const populate = {
  "populate[localizations]": "*",
  "populate[mainImage]": "*",
  "populate[largeImage]": "*",
  status: "published",
  locale,
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

onMounted(() => {
  setTimeout(() => {
    window.dispatchEvent(new Event("init-theme"));
  }, 200);

  document.body.classList.add("page-bio");
  if (page.pageCss) {
    document.body.classList.add(page.pageCss);
  }
});

onBeforeUnmount(() => {
  document.body.classList.remove("page-bio");
  if (page.pageCss) {
    document.body.classList.remove(page.pageCss);
  }
});

const columnsHero = {
  id: 1,
  __component: "sections.columns",
  styles: {
    backgroundColor: "#f0f0f0",
    height: "70vh",
    cssClass: "align-bottom-left",
    backgroundImage: page.mainImage,
  },
  columns: [
    {
      id: 1,
      title: page.title,
      titleHeading: "h1",
      styles: {
        cssClass: "col col-6",
      },
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
              css: "mb-0",
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
              css: "mb-0",
            },
          ],
        },
      ],
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
        cssClass: "col col-4",
      },
    },
    {
      id: 3,
      text: page.content,
      styles: {
        cssClass: "col col-8",
      },
    },
  ],
};

const columnsMedia = {
  id: 4,
  __component: "sections.columns",
  styles: {
    cssClass: "pt-2 my-0",
  },
  columns: [
    {
      id: 5,      
      styles: {        
        cssClass: "media-border-radius",
      },
      media: page.largeImage,
    },
  ],
};
</script>
<template>
  <AppCursor></AppCursor>
  <AppHeader color-mode="dark" :slug="slug"></AppHeader>
  <div class="main-content">
    <div class="section">
      <AppSection :section="columnsHero">
        <SectionsColumns :section="columnsHero"></SectionsColumns>
      </AppSection>

      <AppSection :section="columnsContent">
        <SectionsColumns :section="columnsContent"></SectionsColumns>
      </AppSection>

      <AppSection :section="columnsMedia">
        <SectionsColumns :section="columnsMedia"></SectionsColumns>
      </AppSection>
      
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
    background-size: 25%;
    background-position: 80% bottom;
  }

  @media (min-width: 768px) {
  }
  @media (min-width: 992px) {
    .container {
      max-width: 700px !important;
    }
  }
  @media (min-width: 1200px) {
    .container {
      max-width: 1046px !important;
    }
  }
}
</style>
