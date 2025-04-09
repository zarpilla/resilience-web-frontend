<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

const { locale } = useI18n();

const textStore = useTextStore();
const texts = computed(() =>
  textStore.texts.find((h) => h.locale === locale.value)
);

onMounted(() => {
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
      <div class="row gx-blog zgx-5">
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
                      {{
                        blogPage.page.typology
                          ? blogPage.page.typology.name
                          : ""
                      }}
                    </div>
                    <div class="typology w-100">
                      <div class="typology-label">
                        {{ texts?.value?.data.author }}
                      </div>
                      {{ blogPage.page.author }}
                    </div>
                    <div class="typology w-100">
                      <div class="typology-label">
                        {{ texts?.value?.data.year }}
                      </div>
                      {{ blogPage.page.year ? blogPage.page.year.name : "" }}
                    </div>
                  </div>
                  <div class="main-info">
                    <h3
                      :class="{
                        'mb-4': blogPage.width === 'threethirds',
                        'mb-0': blogPage.width !== 'threethirds',
                      }"
                    >
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
                      <br />
                      <MetaLink
                        :page="blogPage.page"
                        :text="blogPage.page.name"
                        css-class="n-link"
                      >
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
            <hr>
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
      color: #898989
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
</style>
