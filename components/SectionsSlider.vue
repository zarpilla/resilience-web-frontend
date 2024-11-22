<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

const runtimeConfig = useRuntimeConfig();

const hasBackground = computed(() => {
  return props.section.background ? true : false;
});

const backgroundStyle = computed(() => ({
  background: props.section.background ? props.section.background : "none",
}));

const { $bs } = useNuxtApp() as any;

onMounted(() => {
  try {
    if (props.section.preset === "three" && window.innerWidth > 768) {
      // get all section-slider-carousel-3 elements
      let carousels = document.querySelectorAll(".section-slider-carousel-3");
      carousels.forEach((carousel) => {
        // get the max height of the items within this carousel and set it to all the items
        let citems = carousel.querySelectorAll(".carousel-blog-item");
        let maxHeight = 0;
        citems.forEach((el) => {
          const elHeight = el.clientHeight;
          if (elHeight > maxHeight) {
            maxHeight = elHeight;
          }
        });
        citems.forEach((el: any) => {
          el.style.height = `${maxHeight + 25}px`;
        });
      });

      let items = document.querySelectorAll(".carousel .carousel-item");
      items.forEach((el) => {
        const minPerSlide = 3;
        let next = el.nextElementSibling;
        for (var i = 1; i < minPerSlide; i++) {
          if (!next) {
            // wrap carousel by using first child
            next = items[0];
          }
          let cloneChild: any = next.cloneNode(true);
          el.appendChild(cloneChild.children[0]);
          next = next.nextElementSibling;
        }
      });
    }

    var myCarousel = document.querySelector(`#carousel-${props.section.id}`);
    const carousel = new $bs.Carousel(myCarousel);
  } catch (e) {
    console.log("Bootstrap error: ", e);
  }
});
</script>
<template>
  <div class="section-slider">
    <div
      class="container"
      :class="{ 'container-xxl': section.preset !== 'three' }"
      :style="backgroundStyle"
      v-if="
        section.menu && section.menu.children && section.menu.children.length
      "
    >
      <template v-if="section.preset !== 'three'">
        <div class="row text-center">
          <div class="subtitle-outter mb-4">
            <div class="subtitle" v-html="section.subTitle"></div>
          </div>
          <h2 class="mb-5" v-html="section.title"></h2>
        </div>
        <div class="row section-slider-carousel">
          <div class="col-12">
            <div class="container">
              <div
                :id="`carousel-${section.id}`"
                class="carousel slide"
                data-bs-ride="carousel"
                :data-bs-interval="section.intervalMilliseconds || 8000"
              >
                <div class="carousel-inner">
                  <div
                    class="carousel-item"
                    v-for="(item, i) in section.menu.children"
                    :key="i"
                    :class="{ active: i === 0 }"
                  >
                    <div class="carousel-item-inner">
                      <div class="row">
                        <div class="col-12 col-md-7 py-0 px-0 pe-md-0">
                          <MetaLink :page="item.page" css-class="hoverable">
                            <NuxtImg
                              :src="
                                runtimeConfig.public.apiBase +
                                item?.page?.metadata?.shareImage?.url
                              "
                              :alt="item?.page.name"
                            />
                          </MetaLink>
                        </div>
                        <div
                          class="col-12 col-md-5 ps-md-0 carousel-item-inner-column-text"
                          :class="`has-background-${hasBackground}`"
                        >
                          <div class="carousel-item-inner-text">
                            <h3>
                              <MetaLink
                                :page="item.page"
                                :text="item?.page.name"
                                href="#"
                                target=""
                                css-class="hoverable"
                              ></MetaLink>
                            </h3>
                            <div class="meta-description mt-4">
                              {{ item?.page.metadata?.metaDescription }}
                            </div>
                            <div class="mt-4">
                              <MetaLink
                                :page="item.page"
                                :text="section.goToText"
                                href="#"
                                target=""
                                css-class="n-link"
                              ></MetaLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  class="carousel-control-prev hoverable"
                  type="button"
                  :data-bs-target="`#carousel-${section.id}`"
                  data-bs-slide="prev"
                >
                  <span
                    class="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button
                  class="carousel-control-next hoverable"
                  type="button"
                  :data-bs-target="`#carousel-${section.id}`"
                  data-bs-slide="next"
                >
                  <span
                    class="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="container">
              <div class="carousel-c2a text-center mt-3" v-if="section.c2a">
                <MetaC2A :c2a="section.c2a" :section="section"></MetaC2A>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="row text-left mb-0 mb-md-5">
          <div class="col-12 col-md-3">
            <div class="z">
              <h3>{{ section.subTitle }}</h3>
            </div>
          </div>
          <div class="col-12 col-md-9">
            <div class="d-flex justify-content-center justify-content-md-end">
              <button
                class="carousel-control-prev carousel-control-prev-3 hoverable"
                type="button"
                :data-bs-target="`#carousel-${section.id}`"
                data-bs-slide="prev"
              >
                <span
                  class="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button
                class="carousel-control-next carousel-control-next-3 hoverable"
                type="button"
                :data-bs-target="`#carousel-${section.id}`"
                data-bs-slide="next"
              >
                <span
                  class="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>

        <div
          class="zrow section-slider-carousel-3 mx-auto my-auto justify-content-center"
        >
          <div class="zcol-12">
            <div
              :id="`carousel-${section.id}`"
              class="carousel slide"
              data-bs-ride="carousel"
              :data-bs-interval="section.intervalMilliseconds || 8000"
            >
              <div class="carousel-inner fake-row" role="listbox">
                <div
                  class="carousel-item zcol-12 px-0"
                  v-for="(item, i) in section.menu.children"
                  :key="i"
                  :class="{ active: i === 0 }"
                >
                  <div class="col-md-4 mb-4 blog-onethird">
                    <div class="carousel-blog-item mx-custom">
                      <div>
                        <MetaLink :page="item.page">
                          <MetaMedia
                            css="media"
                            :media="item.page.metadata.shareImage"
                          />
                        </MetaLink>
                      </div>
                      <div>
                        <div class="info">
                          <h3 class="mb-0">
                            <MetaLink
                              :page="item.page"
                              :text="item.page.name"
                              css-class="n-link"
                            >
                            </MetaLink>
                          </h3>
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
    </div>
  </div>
</template>
<style scoped lang="scss">
.section-slider > .container {
  padding-top: 60px;
  padding-bottom: 60px;
}
.subtitle {
  color: var(--Negre, #000);
  text-align: center;
  font-family: "PP Neue Montreal";
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: 40px; /* 181.818% */
  letter-spacing: 0.22px;
  padding-bottom: 0px;
  border-bottom: 1px solid #000;
  display: inline-block;
}

h2 {
  width: 30%;
  margin: auto;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
}

h3, h3 a {
  color: #000;
  font-size: 25px;
  line-height: 32px;
}

.section-slider-carousel {
  padding-top: 50px;
}

.carousel-inner {
  @media screen and (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
}

.carousel-item-inner {
  width: 80%;
  margin: auto;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
}
.carousel-item {
  width: 100%;
}

img {
  width: 100%;
  height: 550px;
  object-fit: cover;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  @media screen and (max-width: 767px) {
    height: 300px;
    border-bottom-left-radius: 0px;
    border-top-right-radius: 20px;
  }
}
.carousel-item-inner-column-text {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  border: 1px solid #000;
  border-left: 0;
  background: #fff;

  @media screen and (max-width: 767px) {
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
    border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-left: 1px solid #000;
    border-top: 0;
  }

  &.has-background-true {
    border: 0;
  }
}

.carousel-item-inner-text {
  padding: 80px 80px 0 80px;
  @media screen and (max-width: 768px) {
    padding: 30px;
  }
}
.carousel-item-inner .col {
  padding: 0 !important;
}
.carousel-c2a {
  width: 80% !important;
  padding: 0;
  margin: auto;
}
.n-link {
  color: var(--Negre, #000);
  font-family: "PP Neue Montreal";
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */
  letter-spacing: 0.18px;
}
</style>
<style lang="scss">
.carousel-control-next-icon {
  background-image: url("data:image/svg+xml,%3Csvg width='92' height='92' viewBox='0 0 92 92' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_208_2122' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='92' height='93'%3E%3Crect y='0.000244141' width='92' height='92' fill='%23D9D9D9'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_208_2122)'%3E%3Cpath d='M67.6586 47.0544H20.3169V44.9461H67.6586L44.5627 21.8502L46.0002 20.3169L71.6836 46.0002L46.0002 71.6836L44.5627 70.1502L67.6586 47.0544Z' fill='%231C1B1F'/%3E%3C/g%3E%3C/svg%3E");
  opacity: 1;
}
.carousel-control-prev-icon {
  background-image: url("data:image/svg+xml,%3Csvg width='92' height='92' viewBox='0 0 92 92' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_208_2125' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='92' height='93'%3E%3Crect width='92' height='92' transform='matrix(-1 0 0 1 92 0.000244141)' fill='%23D9D9D9'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_208_2125)'%3E%3Cpath d='M24.3414 47.0544H71.6831V44.9461H24.3414L47.4373 21.8502L45.9998 20.3169L20.3164 46.0002L45.9998 71.6836L47.4373 70.1502L24.3414 47.0544Z' fill='%231C1B1F'/%3E%3C/g%3E%3C/svg%3E");
}
.carousel-control-next-icon,
.carousel-control-prev-icon {
  width: 4rem;
  height: 4rem;
}
.carousel-control-next,
.carousel-control-prev {
  opacity: 1;
  width: 10%;
  cursor: none !important;
}

.carousel-control-prev {  
  transition: all 0.3s ease-in-out;
  &:hover {
    left: -10px!important;
  }
}
.carousel-control-next {  
  transition: all 0.3s ease-in-out;
  &:hover {
    right: -10px!important;
  }
}

.section-slider-carousel {
  min-height: 665px;
}

.carousel-control-next-3,
.carousel-control-prev-3 {
  position: relative !important;
}
.carousel-control-prev-3 {
  left: 20px;
  @media screen and (max-width: 768px) {
    left: -20px;
  }
}
.carousel-control-next-3 {
  right: -20px;
}

.section-slider-carousel-3 {
  @media (max-width: 767px) {
    .carousel-inner .carousel-item > div {
      display: none;
    }
    .carousel-inner .carousel-item > div:first-child {
      display: block;
    }
  }

  .carousel-inner .carousel-item.active,
  .carousel-inner .carousel-item-next,
  .carousel-inner .carousel-item-prev {
    display: flex;
  }

  /* medium and up screens */
  @media (min-width: 768px) {
    .carousel-inner .carousel-item-end.active,
    .carousel-inner .carousel-item-next {
      transform: translateX(33.3333%);
    }

    .carousel-inner .carousel-item-start.active,
    .carousel-inner .carousel-item-prev {
      transform: translateX(-33.3333%);
    }
  }

  .carousel-inner .carousel-item-end,
  .carousel-inner .carousel-item-start {
    transform: translateX(0);
  }
}
.justify-content-end {
  justify-content: flex-end;
}
.mx-custom {
  @media screen and (min-width: 769px) {
    margin-right: 18px !important;
    margin-left: 18px !important;
  }
}
.fake-row {
  padding: 0 !important;
  @media screen and (min-width: 769px) {
    width: 100%;
    margin-left: -10px;
    margin-right: -10px;
  }
}
</style>
