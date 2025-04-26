<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

import { computed } from "vue";

const columns = ref<any[]>([]);

onMounted(() => {
  // for < 768px, one column
  // for < 1024px, two columns
  // for > 1024px, 4 columns
  // starting from right to left, add items to the columns
  // console.log("props.section.pages", props.section.pages);

  const items: any[] = props.section.pages;
  const columnCount =
    window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
  for (let i = 0; i < columnCount; i++) {
    columns.value.push([]);
  }
  let column = columnCount - 1;
  for (let i = 0; i < items.length; i++) {
    columns.value[column].push(items[i]);
    column = (column - 1 + columnCount) % columnCount;
}
});
</script>
<template>
  <div class="section-masonry">
    <div class="container">
      <div class="row text-center">
        <div class="subtitle-outter mb-4" v-if="section.subtitle">
          <h3 class="subtitle">{{ section.subtitle }}</h3>
        </div>
        <h2 class="mb-4 w-100 w-md-50" v-if="section.title" v-html="section.title"></h2>
      </div>

      <div class="row gx-blog masonry-row">        
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
              <MetaLink :page="blogPage.page">
                <MetaMedia
                  css="media"
                  :media="blogPage.page.metadata.shareImage"
                />
              </MetaLink>
            </div>
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
</style>
