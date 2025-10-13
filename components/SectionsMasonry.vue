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
const filter = computed(() => filterStore.filterArticles);

const columns = ref<any[]>([]);

const expanded = ref<boolean>(false);

const selectedScope = ref<number>(0);
const selectedTypology = ref<number>(0);
const selectedYear = ref<number>(0);

const currentPage = ref(1);
const isLoading = ref(false);
const pageSize = 16;

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
    "sort[0]": "updatedAt:desc",
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

const toggleScope = async (scope: number) => {
  selectedScope.value = selectedScope.value === scope ? 0 : scope;
  const articlesSearched = await queryArticles();
  articles.value = articlesSearched;
  columns.value = splitArticlesOnColumns((articlesSearched as any).data);
};
const toggleTypology = async (typology: number) => {
  selectedTypology.value = selectedTypology.value === typology ? 0 : typology;
  const articlesSearched = await queryArticles();
  articles.value = articlesSearched;
  columns.value = splitArticlesOnColumns((articlesSearched as any).data);
};
const toggleYear = async (year: number) => {
  selectedYear.value = selectedYear.value === year ? 0 : year;
  const articlesSearched = await queryArticles();
  articles.value = articlesSearched;
  columns.value = splitArticlesOnColumns((articlesSearched as any).data);
};

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
      "sort[0]": "updatedAt:desc",
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
              width="20"
              height="17"
              viewBox="0 0 20 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.7227 16.9595C14.6727 16.9595 13.7852 16.597 13.0602 15.872C12.3352 15.147 11.9727 14.2595 11.9727 13.2095C11.9727 12.1595 12.3352 11.272 13.0602 10.547C13.7852 9.82197 14.6727 9.45947 15.7227 9.45947C16.7727 9.45947 17.6602 9.82197 18.3852 10.547C19.1102 11.272 19.4727 12.1595 19.4727 13.2095C19.4727 14.2595 19.1102 15.147 18.3852 15.872C17.6602 16.597 16.7727 16.9595 15.7227 16.9595ZM15.7227 14.9595C16.206 14.9595 16.6185 14.7886 16.9602 14.447C17.3018 14.1053 17.4727 13.6928 17.4727 13.2095C17.4727 12.7261 17.3018 12.3136 16.9602 11.972C16.6185 11.6303 16.206 11.4595 15.7227 11.4595C15.2393 11.4595 14.8268 11.6303 14.4852 11.972C14.1435 12.3136 13.9727 12.7261 13.9727 13.2095C13.9727 13.6928 14.1435 14.1053 14.4852 14.447C14.8268 14.7886 15.2393 14.9595 15.7227 14.9595ZM1.97266 14.2095V12.2095H9.97266V14.2095H1.97266ZM4.22266 7.95947C3.17266 7.95947 2.28516 7.59697 1.56016 6.87197C0.835156 6.14697 0.472656 5.25947 0.472656 4.20947C0.472656 3.15947 0.835156 2.27197 1.56016 1.54697C2.28516 0.821973 3.17266 0.459473 4.22266 0.459473C5.27266 0.459473 6.16016 0.821973 6.88516 1.54697C7.61016 2.27197 7.97266 3.15947 7.97266 4.20947C7.97266 5.25947 7.61016 6.14697 6.88516 6.87197C6.16016 7.59697 5.27266 7.95947 4.22266 7.95947ZM4.22266 5.95947C4.70599 5.95947 5.11849 5.78864 5.46016 5.44697C5.80182 5.10531 5.97266 4.69281 5.97266 4.20947C5.97266 3.72614 5.80182 3.31364 5.46016 2.97197C5.11849 2.63031 4.70599 2.45947 4.22266 2.45947C3.73932 2.45947 3.32682 2.63031 2.98516 2.97197C2.64349 3.31364 2.47266 3.72614 2.47266 4.20947C2.47266 4.69281 2.64349 5.10531 2.98516 5.44697C3.32682 5.78864 3.73932 5.95947 4.22266 5.95947ZM9.97266 5.20947V3.20947H17.9727V5.20947H9.97266Z"
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
        v-if="articles.data.length === 0"
        class="col-12 text-center no-results-container"
      >
        <MetaMedia css="no-results-image" :media="section.noResultsImage" />

        <div class="no-results">
          <h3 v-html="texts?.value.data.noResults"></h3>
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

  .no-results-container {
    margin-bottom: 159px;
  }
  .no-results {
    h3 {
      color: var(--Blanc, #fff);
      text-align: center;
      font-family: "PP Neue Montreal";
      font-size: 33px !important;
      font-style: normal !important;
      font-weight: 500 !important;
      line-height: 120% !important; /* 39.6px */
      letter-spacing: 0.33px !important;
      margin-top: -250px;
    }
  }
}
@media screen and (min-width: 768px) {
  .w-md-50 {
    width: 50% !important;
    margin: auto;
  }
}
@media screen and (min-width: 768px) {
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
