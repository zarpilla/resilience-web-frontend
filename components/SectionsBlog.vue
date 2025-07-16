<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

const { locale } = useI18n();

const textStore = useTextStore();
const texts = computed(() =>
  textStore.texts.find((h) => h.locale === locale.value)
);

const filterStore = useFilterStore();
const filter = computed(() => filterStore.filterResources);

const expanded = ref<boolean>(false);

const selectedScope = ref<number>(0);
const selectedTypology = ref<number>(0);
const selectedYear = ref<number>(0);

const currentPage = ref(1);
const isLoading = ref(false);

const toggleScope = async (scope: number) => {
  selectedScope.value = selectedScope.value === scope ? 0 : scope;
  const resourcesSearched = await queryResources();
  if (resourcesSearched && (resourcesSearched as any).data) {
    resources.value = resourcesSearched;
    props.section.blogPage = (resourcesSearched as any).data.map(
      (resource: any) => ({
        width: "threethirds",
        page: resource,
      })
    );
  }
};

const toggleTypology = async (typology: number) => {
  selectedTypology.value = selectedTypology.value === typology ? 0 : typology;
  const resourcesSearched = await queryResources();
  if (resourcesSearched && (resourcesSearched as any).data) {
    resources.value = resourcesSearched;
    props.section.blogPage = (resourcesSearched as any).data.map(
      (resource: any) => ({
        width: "threethirds",
        page: resource,
      })
    );
  }
};

const toggleYear = async (year: number) => {
  selectedYear.value = selectedYear.value === year ? 0 : year;
  const resourcesSearched = await queryResources();
  if (resourcesSearched && (resourcesSearched as any).data) {
    resources.value = resourcesSearched;
    props.section.blogPage = (resourcesSearched as any).data.map(
      (resource: any) => ({
        width: "threethirds",
        page: resource,
      })
    );
  }
};

const queryResources = async () => {
  const query: any = {
    locale: locale.value,
    "filters[type][$eq]": "resource",
    "populate[0]": "scopes",
    "populate[1]": "year",
    "populate[2]": "typology",
    "populate[3]": "metadata",
    "populate[4]": "metadata.shareImage",
    "pagination[page]": 1,
    "pagination[pageSize]": 25,
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

  const { data: resourcesInfo } = await useAPI("/api/pages", {
    query: query,
  });

  currentPage.value = 1;

  return resourcesInfo.value;
};

// Initialize resources data on component load
const initializeResources = async () => {
  const resourcesData = await queryResources();
  if (resourcesData && (resourcesData as any).data) {
    resources.value = resourcesData;
    // Update section blogPage with the initial resources
    props.section.blogPage = (resourcesData as any).data.map(
      (resource: any) => ({
        width: "threethirds", // Default width, adjust as needed
        page: resource,
      })
    );
  }
};

const resources = ref<any>(null);

const loadMoreButtonIsVisible = computed(() => {
  return (
    resources.value &&
    (resources.value as any).data &&
    (resources.value as any).data.length > 0 &&
    (resources.value as any).meta.pagination.pageCount > currentPage.value
  );
});

const loadMore = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  currentPage.value += 1;

  try {
    const query: any = {
      locale: locale.value,
      "filters[type][$eq]": "resource",
      "populate[0]": "scopes",
      "populate[1]": "year",
      "populate[2]": "typology",
      "populate[3]": "metadata",
      "populate[4]": "metadata.shareImage",
      "pagination[page]": currentPage.value,
      "pagination[pageSize]": 25,
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

    const { data: moreResources } = await useAPI("/api/pages", {
      query: query,
    });

    if (moreResources.value && (moreResources.value as any).data) {
      // Append new resources to existing ones
      (resources.value as any).data.push(...(moreResources.value as any).data);
      (resources.value as any).meta = (moreResources.value as any).meta;

      // Update section blogPage with all resources
      props.section.blogPage = (resources.value as any).data.map(
        (resource: any) => ({
          width: "threethirds", // Default width, adjust as needed
          page: resource,
        })
      );
    }
  } catch (error) {
    console.error("Error loading more resources:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Initialize resources if filtering is enabled
  if (props.section.filter) {
    initializeResources();
  }

  setItemsHeight();

  window.addEventListener("resize", () => {
    setItemsHeight();
  });
});

const setItemsHeight = () => {
  if (window.innerWidth < 768) {
    return;
  }

  document.querySelectorAll(".blog-item").forEach((item: any) => {
    item.style.minHeight = "auto";
  });

  // for each .blog-item-col, get the attribute data-w, acumulate it, and get mod 12 to know if it is in the same row. All the elements in the same row should have the same height
  const blogItems = document.querySelectorAll(".blog-item-col");
  let acum = 0;
  let row = 0;
  blogItems.forEach((item: any, i) => {
    acum += parseInt(item.getAttribute("data-w"));
    if (acum > 12) {
      row++;
      acum = acum - 12;
    }
    item.setAttribute("data-row", row.toString());
  });
  const blogItemsArray = Array.from(blogItems);
  // for each item in the same row (data-row), get the max height and set it to all the items in the same row
  const rows = Array.from(
    new Set(blogItemsArray.map((item: any) => item.getAttribute("data-row")))
  );
  rows.forEach((row: any) => {
    const itemsInRow = blogItemsArray.filter(
      (item: any) => item.getAttribute("data-row") === row
    );
    let maxHeight = 0;
    itemsInRow.forEach((item: any) => {
      if (item.clientHeight > maxHeight) {
        maxHeight = item.clientHeight;
      }
    });
    itemsInRow.forEach((item: any) => {
      // get the .blog-item element inside the .blog-item-col and set the height
      if (itemsInRow.length > 1) {
        item.querySelector(".blog-item").style.minHeight = `${
          maxHeight - 40
        }px`;
      }
    });
  });
};
</script>
<template>
  <div class="section-blog">
    <div class="container">
      <!-- Filter Section -->
      <div
        class="row masonry-filter"
        v-if="filter && props.section.filter"
        :class="{ expanded: expanded }"
      >
        <div class="d-flex">
          <div
            class="collapse-toogle hoverable"
            data-bs-toggle="collapse"
            :href="`#collapse-section${section.id}-blog`"
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

        <div class="collapse" :id="`collapse-section${section.id}-blog`">
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

      <div class="row gx-blog zgx-5" :class="{ 'mt-5': !props.section.filter }">
        <div
          v-if="section.blogPage.length === 0"
          class="col-12 text-center no-results-container"
        >
          <MetaMedia css="no-results-image" :media="section.noResultsImage" />

          <div class="no-results">
            <h3 v-html="texts?.value.data.noResults"></h3>
          </div>
        </div>
        <div
          v-for="(blogPage, i) in section.blogPage"
          :key="i"
          class="blog-item-col col-12"
          :class="{
            'col-sm-6 col-md-4': blogPage.width === 'onethird',
            'col-sm-6 col-md-8': blogPage.width === 'twothirds',
            'col-sm-12 col-md-12': blogPage.width === 'threethirds',
          }"
          :data-w="
            blogPage.width === 'onethird'
              ? 4
              : blogPage.width === 'twothirds'
              ? 8
              : 12
          "
        >
          <div class="blog-item" :class="`blog-${blogPage.width}`">
            <div class="row">
              <div
                class="col-12"
                :class="{
                  'col-md-6': blogPage.width === 'threethirds',
                  'col-md-12': blogPage.width !== 'threethirds',
                }"
              >
                <MetaLink :page="blogPage.page">
                  <MetaMedia
                    css="media"
                    :media="blogPage.page.metadata.shareImage"
                  />
                </MetaLink>
              </div>
              <div
                class="col-12"
                :class="{
                  'col-md-6': blogPage.width === 'threethirds',
                  'col-md-12': blogPage.width !== 'threethirds',
                }"
              >
                <div class="info position-relative">
                  <div class="more-info d-flex align-items-center mb-3">
                    <div class="typology w-100">
                      <div class="typology-label">
                        {{ texts?.value?.data.tipology }}
                      </div>
                      <div class="typology-value">
                        {{
                          blogPage.page.typology
                            ? blogPage.page.typology.name
                            : ""
                        }}
                      </div>
                    </div>
                    <!-- <div class="typology w-100">
                      <div class="typology-label">
                        {{ texts?.value?.data.author }}
                      </div>
                      <div class="typology-value">
                        {{ blogPage.page.author }}
                      </div>
                    </div> -->
                    <div class="typology w-100">
                      <div class="typology-label">
                        {{ texts?.value?.data.year }}
                      </div>
                      <div class="typology-value">
                        {{ blogPage.page.year ? blogPage.page.year.name : "" }}
                      </div>
                    </div>
                  </div>
                  <div class="main-info">
                    <h3
                      :class="{
                        'mb-4': blogPage.width === 'threethirds',
                        'mb-0': blogPage.width !== 'threethirds',
                      }"
                    >
                      <MetaLink :page="blogPage.page" css-class="n-link">
                        <svg
                          v-if="blogPage.width === 'threethirds'"
                          class="mb-1"
                          width="41"
                          height="41"
                          viewBox="0 0 41 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_1232_16488"
                            style="mask-type: alpha"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="41"
                            height="41"
                          >
                            <rect
                              x="0.525391"
                              y="0.736328"
                              width="40"
                              height="40"
                              fill="#D9D9D9"
                            />
                          </mask>
                          <g mask="url(#mask0_1232_16488)">
                            <path
                              d="M10.8033 30.5696L8.85876 28.625L25.6367 11.8475H10.3588V9.06958H30.3588V29.0696H27.5808V13.7917L10.8033 30.5696Z"
                              fill="#F5825E"
                            />
                          </g>
                        </svg>
                        <svg
                          v-if="blogPage.width !== 'threethirds'"
                          width="31"
                          height="31"
                          viewBox="0 0 31 31"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_1236_17892"
                            style="mask-type: alpha"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="31"
                            height="31"
                          >
                            <rect
                              x="0.525391"
                              y="0.0761719"
                              width="30"
                              height="30"
                              fill="#D9D9D9"
                            />
                          </mask>
                          <g mask="url(#mask0_1236_17892)">
                            <path
                              d="M8.23383 22.4512L6.77539 20.9927L19.3588 8.40961H7.90039V6.32617H22.9004V21.3262H20.817V9.86773L8.23383 22.4512Z"
                              fill="#F5825E"
                            />
                          </g>
                        </svg>
                        <div v-text="blogPage.page.name"></div>
                      </MetaLink>
                    </h3>

                    <div
                      class="meta-short"
                      v-if="
                        blogPage.width === 'threethirds' &&
                        blogPage.page.metadata.metaDescriptionShort
                      "
                    >
                      {{ blogPage.page.metadata.metaDescriptionShort }}
                    </div>
                    <div
                      class="meta"
                      v-if="
                        blogPage.width === 'threethirds' &&
                        !blogPage.page.metadata.metaDescriptionShort
                      "
                    >
                      {{ blogPage.page.metadata.metaDescription }}
                    </div>
                    <div
                      class="meta-short-normal mt-2"
                      v-if="
                        blogPage.width !== 'threethirds' &&
                        blogPage.page.metadata.metaDescriptionShort
                      "
                    >
                      {{ blogPage.page.metadata.metaDescriptionShort }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="blog-hr">
            <hr />
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
.section-blog {
  .blog-item {
    background: #fff;
    border-radius: 20px;
    margin-bottom: 40px;

    .media {
      border-radius: 20px 0 0 20px;
      height: 442px;
      @media screen and (max-width: 768px) {
        border-radius: 20px 20px 0 0 !important;
      }
    }

    .info {
      padding: 40px !important;

      h3 {
        a {
          text-decoration: none !important;
        }
      }
    }

    &.blog-onethird {
      .media {
        height: 246px;
        border-radius: 20px 20px 0 0;
      }
      .info {
        padding: 30px;
      }
    }
    &.blog-twothirds {
      .media {
        height: 246px;
        border-radius: 20px 20px 0 0;
      }
      .info {
        padding: 30px;
      }
    }
  }

  .blog-hr {
    margin-bottom: 40px;
    color: #898989;

    hr {
      opacity: 1;
      color: #898989;
    }
  }
  .more-info {
    gap: 16px;
  }
  .typology-label {
    color: #898989;
    font-variant-numeric: lining-nums proportional-nums;
    font-family: "PP Neue Montreal";
    font-size: 15px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 18px */
    letter-spacing: 0.15px;
    margin-bottom: 10px;
  }
  .typology {
    color: #898989;
    font-variant-numeric: lining-nums proportional-nums;
    font-family: "PP Neue Montreal";
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 18px */
    letter-spacing: 0.15px;
  }
  .typology-value {
    min-height: 32px;
  }
  .info {
    height: 100%;
  }
  .main-info {
    position: absolute;
    bottom: 0;
    left: 0;
    margin-bottom: 40px;
    margin-left: 40px;
    margin-right: 40px;
    width: calc(100% - 80px);

    a {
      svg {
        transition: transform 0.15s ease-in-out;
        transform: translateX(0px) translateY(0px);
        will-change: transform;
        backface-visibility: hidden;
        perspective: 1000px;
      }
      &:hover svg {
        transform: translateX(5px) translateY(-5px);
      }
    }
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
.blog-item {
  .media {
    object-fit: cover;
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
</style>
