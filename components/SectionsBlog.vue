<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

import { computed } from "vue";

onMounted(() => {
  
  if (window.innerWidth < 768) {
    return;
  }
  // for each .blog-item-col, get the attribute data-w, acumulate it, and get mod 12 to know if it is in the same row. All the elements in the same row should have the same height
  const blogItems = document.querySelectorAll(".blog-item-col");
  let acum = 0;
  let row = 0;
  blogItems.forEach((item: any, i) => {
    acum += parseInt(item.getAttribute("data-w"));
    if (acum > 12) {
      row++;
      acum = acum - 12;
      console.log("acum 2", acum);
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
      item.querySelector(".blog-item").style.height = `${maxHeight - 25}px`;
      //item.style.height = `${maxHeight}px`;
    });
  });
});
</script>
<template>
  <div class="section-blog">
    <div class="container">
      <div class="row">
        <div
          v-for="(blogPage, i) in section.blogPage"
          :key="i"
          class="blog-item-col col-12"
          :class="{
            'col-md-4': blogPage.width === 'onethird',
            'col-md-8': blogPage.width === 'twothirds',
            'col-md-12': blogPage.width === 'threethirds',
          }"
          :data-w="
            blogPage.width === 'onethird'
              ? 4
              : blogPage.width === 'twothirds'
              ? 8
              : 12
          "
        >
          <div class="blog-item mb-4" :class="`blog-${blogPage.width}`">
            <div class="row">
              <div
                class="col-12"
                :class="{
                  'col-md-5': blogPage.width === 'threethirds',
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
                  'col-md-7': blogPage.width === 'threethirds',
                  'col-md-12': blogPage.width !== 'threethirds',
                }"
              >
                <div class="info">
                  <h3 :class="{ 'mb-5': blogPage.width === 'threethirds', 'mb-0': blogPage.width !== 'threethirds' }">
                    <MetaLink
                      :page="blogPage.page"
                      :text="blogPage.page.name"
                      css-class="n-link"
                    >
                    </MetaLink>
                  </h3>
                  <div class="meta" v-if="blogPage.width === 'threethirds'">
                    {{ blogPage.page.metadata.metaDescription }}
                  </div>
                </div>
              </div>
            </div>
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

    .media {
      border-radius: 20px 0 0 20px;
      height: 442px;
      @media screen and (max-width: 768px) {
        border-radius: 20px 20px 0 0!important;
      }
    }

    .info {
      padding: 70px 50px;

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
}
.blog-item {
  .media {
    object-fit: cover;
  }
}
</style>
