<script setup lang="ts">
import { computed } from "vue";

const { locale, setLocale } = useI18n();
const props = defineProps<{
  section: any;
}>();

const textStore = useTextStore();
const texts = computed(() =>
  textStore.texts.find((h) => h.locale === locale.value)
);

const filterStore = useFilterStore();
const filter = computed(() => filterStore.filter);

const columns = ref<any[]>([]);

const expanded = ref<boolean>(false);

const selectedScope = ref<number>(0);
const selectedTypology = ref<number>(0);
const selectedYear = ref<number>(0);

const currentPage = ref(1);
const isLoading = ref(false);
const pageSize = 16;
const toggleScope = async (scope: number) => {
  selectedScope.value = selectedScope.value === scope ? 0 : scope;
  const articlesSearched = await queryArticles();
  columns.value = splitArticlesOnColumns((articlesSearched as any).data);
};
const toggleTypology = async (typology: number) => {
  selectedTypology.value = selectedTypology.value === typology ? 0 : typology;
  const articlesSearched = await queryArticles();
  columns.value = splitArticlesOnColumns((articlesSearched as any).data);
};
const toggleYear = async (year: number) => {
  selectedYear.value = selectedYear.value === year ? 0 : year;
  const articlesSearched = await queryArticles();
  columns.value = splitArticlesOnColumns((articlesSearched as any).data);
};

const queryArticles = async () => {
  const query: any = {
    locale: locale.value,
    "filters[type][$eq]": "article",
    "populate[0]": "scopes",
    "populate[1]": "year",
    "populate[2]": "typology",
    "populate[3]": "metadata",
    "populate[4]": "metadata.shareImage",
    "pagination[page]": 1, // Always start with page 1 for filtering
    "pagination[pageSize]": pageSize, // Adjust page size as needed
  };
  if (selectedScope.value) {
    query["filters[scopes][$eq]"] = selectedScope.value;
  }
  if (selectedTypology.value) {
    query["filters[typology][$eq]"] = selectedTypology.value;
  }
  if (selectedYear.value) {
    query["filters[year][$eq]"] = selectedYear.value;
  }
  const { data: pagesInfo } = await useAPI("/api/pages", {
    query: query,
  });

  // Reset current page when filtering
  currentPage.value = 1;

  // console.log("pagesInfo.value", pagesInfo.value);

  return pagesInfo.value;
};

const articles = ref<any>(null);
articles.value = await queryArticles();

const splitArticlesOnColumns = (articles: any[]) => {
  const columnCount =
    window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
  const columns: any[] = Array.from({ length: columnCount }, () => []);
  let column = columnCount - 1;
  for (let i = 0; i < articles.length; i++) {
    columns[column].push(articles[i]);
    column = (column - 1 + columnCount) % columnCount;
  }
  return columns;
};

const loadMoreButtonIsVisible = computed(() => {
  return (
    articles.value &&
    articles.value.data &&
    articles.value.data.length > 0 &&
    articles.value.meta.pagination.pageCount > currentPage.value
  );
});

const loadMore = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  currentPage.value += 1;

  try {
    const query: any = {
      locale: locale.value,
      "filters[type][$eq]": "article",
      "populate[0]": "scopes",
      "populate[1]": "year",
      "populate[2]": "typology",
      "populate[3]": "metadata",
      "populate[4]": "metadata.shareImage",
      "pagination[page]": currentPage.value,
      "pagination[pageSize]": pageSize, // Adjust page size as needed
    };

    if (selectedScope.value) {
      query["filters[scopes][$eq]"] = selectedScope.value;
    }
    if (selectedTypology.value) {
      query["filters[typology][$eq]"] = selectedTypology.value;
    }
    if (selectedYear.value) {
      query["filters[year][$eq]"] = selectedYear.value;
    }

    const { data: moreArticles } = await useAPI("/api/pages", {
      query: query,
    });

    if (moreArticles.value && (moreArticles.value as any).data) {
      // Append new articles to existing ones
      (articles.value as any).data.push(...(moreArticles.value as any).data);
      (articles.value as any).meta = (moreArticles.value as any).meta;

      // Redistribute all articles in columns
      columns.value = splitArticlesOnColumns((articles.value as any).data);
    }
  } catch (error) {
    console.error("Error loading more articles:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // for < 768px, one column
  // for < 1024px, two columns
  // for > 1024px, 4 columns
  // starting from right to left, add items to the columns
  // console.log("props.section.pages", props.section.pages);
  //const articles = await queryArticles();
  console.log("articles", articles.value);
  columns.value = splitArticlesOnColumns((articles.value as any).data);
});
</script>
<template>
  <div class="section-masonry">
    <div class="container">
      <div class="row text-center">
        <div class="subtitle-outter mb-4" v-if="section.subtitle">
          <h3 class="subtitle">{{ section.subtitle }}</h3>
        </div>
        <h2
          class="mb-4 w-100 w-md-50"
          v-if="section.title"
          v-html="section.title"
        ></h2>
      </div>
      <div
        class="row masonry-filter"
        v-if="filter && props.section.filter"
        :class="{ expanded: expanded }"
      >
        <div class="d-flex">
          <div
            class="collapse-toogle hoverable"
            data-bs-toggle="collapse"
            :href="`#collapse-section${section.id}-masonry`"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
            @click="expanded = !expanded"
          >
            {{ texts?.value.data.filter }}
            <svg
              class="arrow"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.75 0.0874023L7.75 12.2624L2.15 6.6624L0.75 8.0874L8.75 16.0874L16.75 8.0874L15.35 6.6624L9.75 12.2624L9.75 0.0874023L7.75 0.0874023Z"
                fill="#F5825E"
              />
            </svg>
          </div>
          <div class="clear-filters ms-auto">
            <span
              class="filter-clear hoverable"
              v-show="selectedScope || selectedTypology || selectedYear"
              @click="
                selectedScope = 0;
                selectedTypology = 0;
                selectedYear = 0;
                toggleScope(0);
              "
            >
              {{ texts?.value.data.filterClear }}
            </span>
          </div>
        </div>

        <div class="collapse" :id="`collapse-section${section.id}-masonry`">
          <div class="row mt-4 filter-block">
            <div class="d-flex">
              <div class="filter-title">
                {{ texts?.value.data.filterScopes }}
              </div>
              <div class="filter-values d-flex flex-wrap">
                <div v-for="(item, index) in filter.scopes" :key="index">
                  <span
                    class="badge bg-filter me-2"
                    @click="toggleScope(item.id)"
                    :class="{ selected: selectedScope === item.id }"
                  >
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="row filter-block">
            <div class="d-flex">
              <div class="filter-title">
                {{ texts?.value.data.filterType }}
              </div>
              <div class="filter-values d-flex flex-wrap">
                <div v-for="(item, index) in filter.typologies" :key="index">
                  <span
                    class="badge bg-filter me-2"
                    @click="toggleTypology(item.id)"
                    :class="{
                      selected: selectedTypology === item.id,
                    }"
                  >
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="row filter-block">
            <div class="d-flex">
              <div class="filter-title">
                {{ texts?.value.data.filterYear }}
              </div>
              <div class="filter-values d-flex flex-wrap">
                <div v-for="(item, index) in filter.years" :key="index">
                  <span
                    class="badge bg-filter me-2"
                    @click="toggleYear(item.id)"
                    :class="{ selected: selectedYear === item.id }"
                  >
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="row gx-blog masonry-row"
        :class="{ 'mt-5': !props.section.filter }"
      >
        <div
          v-for="(column, i) in columns"
          :key="i"
          class="col-12"
          :class="{
            'col-sm-6 col-md-12': columns.length === 1,
            'col-sm-6 col-md-6': columns.length === 2,
            'col-sm-6 col-md-3': columns.length === 4,
          }"
        >
          <div
            v-for="(blogPage, i) in column"
            :key="i"
            class="masonry-item-wrapper"
          >
            <div class="masonry-item">
              <MetaLink :page="blogPage">
                <MetaMedia css="media" :media="blogPage.metadata.shareImage" />
              </MetaLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div class="row mt-5" v-if="section.filter && loadMoreButtonIsVisible">
        <div class="col-12 text-center">
          <div class="cta">
            <a
              class="hoverable btn btn-dark btn-dark-border-white btn-100 mt-4 zw-100 btn-with-arrow-down button button--stroke"
              data-block="button"
              @click="loadMore"
              :disabled="isLoading"
            >
              <span class="button__flair"></span>
              <span class="button__label">{{
                texts?.value.data.loadMore || "Carregar més"
              }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.section-masonry {
  .subtitle {
    color: var(--Taronja, #f5825e);
    text-align: center;
    font-family: "PP Neue Montreal";
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 4.375rem; /* 437.5% */
    letter-spacing: 0.05rem;
    text-transform: uppercase;
  }
}
@media screen and (min-width: 768px) {
  .w-md-50 {
    width: 50% !important;
    margin: auto;
  }
}

.masonry-row {
  > :first-child {
    margin-top: 13rem;
  }
  > :nth-child(2) {
    margin-top: 4rem;
  }
  > :nth-child(3) {
    margin-top: 10rem;
  }
}

.masonry-item {
  margin-bottom: 2.5rem;
  .media {
    height: 380px;
    object-fit: cover;
    @media screen and (max-width: 768px) {
      height: 440px;
    }
  }
}
.gx-blog {
  --bs-gutter-x: 38px !important;
}
.masonry-filter {
  border-bottom: 1px solid #898989;
  padding-bottom: 20px;
  margin-bottom: 60px;

  &.expanded {
    border-bottom: none;
    padding-bottom: 0;
  }
  .collapse-toogle {
    color: var(--Blanc, #fff);
    font-family: "PP Neue Montreal";
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 33px */
    letter-spacing: 0.22px;

    &:hover {
      color: var(--Taronja, #f5825e);
    }

    .arrow {
      margin-left: 0.5rem;
      transition: transform 0.3s ease;
    }

    &:not(.collapsed) {
      .arrow {
        transform: rotate(180deg);
      }
    }
  }
  .filter-block {
    border-top: 1px solid #898989;
    padding-top: 20px;
  }

  .filter-title {
    color: #898989;
    font-family: "PP Neue Montreal";
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 22.5px */
    letter-spacing: 0.15px;
    margin-right: 20px;
    min-width: 80px;
  }

  .badge.bg-filter {
    border-radius: 25.651px;
    background: #1c1b1f;
    padding: 9px 16.527px 8px 17.473px;
    margin-bottom: 20px;

    color: var(--Blanc, #fff);
    font-family: "PP Neue Montreal";
    font-size: 15.391px;
    font-style: normal;
    font-weight: 500;
    line-height: 19.666px; /* 127.778% */
    letter-spacing: 0.154px;
    margin-right: 10px !important;

    &:hover,
    &.selected {
      color: var(--Taronja, #f5825e);
    }
  }

  .filter-clear {
    color: #898989;
    font-family: "PP Neue Montreal";
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 22.5px */
    letter-spacing: 0.15px;

    &:hover {
      color: var(--Taronja, #f5825e);
    }
  }
}

.btn-load-more {
  background: transparent;
  border: 2px solid var(--Taronja, #f5825e);
  color: var(--Taronja, #f5825e);
  font-family: "PP Neue Montreal";
  font-size: 16px;
  font-weight: 500;
  padding: 12px 32px;
  border-radius: 25px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05rem;

  &:hover:not(:disabled) {
    background: var(--Taronja, #f5825e);
    color: white;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner-border-sm {
    width: 1rem;
    height: 1rem;
  }
}
</style>
