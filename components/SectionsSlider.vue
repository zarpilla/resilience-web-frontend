<script setup lang="ts">
import { horizontalLoop } from "../utils/horizontal-loop";
const { $gsap } = useNuxtApp();
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

const loop = ref<any>(null);

onMounted(() => {
  try {
    // const boxes = gsap.utils.toArray(`#carousel-${props.section.id} .carousel-box`);

    // if (boxes.length === 0) {
    //   return;
    // }
    // const box0: any = boxes[0];
    // this.itemWidth = box0.offsetWidth;

    //loop.value = horizontalLoop(boxes, { paused: true });

    if (props.section.preset === "three" && window.innerWidth > 768) {
      // get all section-slider-carousel-3 elements
      let carousels = document.querySelectorAll(
        ".section-slider-carousel-3-" + props.section.id
      );
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
          el.style.height = `${maxHeight + 80}px`;
        });
      });

      let items = document.querySelectorAll(
        ".section-slider-carousel-3-" +
          props.section.id +
          " .carousel .carousel-item"
      );
      items.forEach((el) => {
        const minPerSlide = window.innerWidth > 1024 ? 3 : 1;
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

      // var myCarousel = document.querySelector(`#carousel-${props.section.id}`);
      // const carousel = new $bs.Carousel(myCarousel);
    } else if (props.section.preset === "services") {
      const boxes = $gsap.utils.toArray(
        `#carousel-${props.section.id} .a-carousel-item`
      );

      loop.value = horizontalLoop($gsap, boxes, { paused: true });

      const next = document.querySelector(".a-carousel-next");

      if (next) {
        next.addEventListener("click", () =>
          loop.value.next({ duration: 0.4, ease: "power1.inOut" })
        );
      }
      const prev = document.querySelector(".a-carousel-prev");
      if (prev) {
        prev.addEventListener("click", () =>
          loop.value.previous({ duration: 0.4, ease: "power1.inOut" })
        );
      }
    } else {
      // var myCarousel = document.querySelector(`#carousel-${props.section.id}`);
      // const carousel = new $bs.Carousel(myCarousel);
    }
  } catch (e) {
    console.log("Bootstrap error: ", e);
  }
});
</script>
<template>
  <div class="section-slider" :id="`section-slider-${section.id}`">
    <div
      class="container"
      :class="{
        'container-xxl':
          section.preset === 'one' || section.preset === 'services',
      }"
      :style="backgroundStyle"
      v-if="
        section.menu && section.menu.children && section.menu.children.length
      "
    >
      <template v-if="section.preset === 'one'">
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
                <div class="carousel-inner d-flex">
                  <div
                    class="carousel-item"
                    v-for="(item, i) in section.menu.children"
                    :key="i"
                    :class="{ active: i === 0 }"
                  >
                    <div class="carousel-item-inner">
                      <div class="row">
                        <div class="col-12 col-md-7 py-0 px-0 pe-md-0">
                          <MetaLink
                            :page="item.page"
                            css-class="hoverable"
                            v-if="item?.page?.metadata"
                          >
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
                            <div
                              class="meta-description mt-4"
                              v-if="item?.page?.metadata"
                            >
                              {{ item?.page?.metadata?.metaDescription }}
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
      <template v-else-if="section.preset === 'services'">
        <div class="container mb-5">
          <div class="row text-left">
            <div class="col-12 col-lg-4">
              <h2
                class="mb-3 text-left me-auto ms-0"
                v-html="section.title"
              ></h2>
              <div class="subtitle-outter mb-4">
                <div class="subtitle-none" v-html="section.subTitle"></div>
              </div>
            </div>
            <div class="col-12 col-md-8 position-relative">
              <div
                class="d-flex justify-content-center justify-content-md-end buttons-services"
              >
                <button
                  class="carousel-control-prev carousel-control-prev-3 hoverable a-carousel-prev"
                  type="button"
                  :zdata-bs-target="`#carousel-${section.id}`"
                  zdata-bs-slide="prev"
                >
                  <span
                    class="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button
                  class="carousel-control-next carousel-control-next-3 hoverable a-carousel-next"
                  type="button"
                  :zdata-bs-target="`#carousel-${section.id}`"
                  zdata-bs-slide="next"
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
        </div>

        <div
          :class="`section-slider-carousel-3 section-slider-carousel-3-${section.id} mx-auto my-auto justify-content-center`"
        >
          <div class="zcol-12">
            <div
              :id="`carousel-${section.id}`"
              class="a-carousel slide"
              zdata-bs-ride="carousel"
              :zdata-bs-interval="section.intervalMilliseconds || 8000"
            >
              <div class="a-carousel-inner d-flex a-fake-row" role="listbox">
                <div
                  class="a-carousel-item zcol-12 px-0"
                  v-for="(item, i) in section.menu.children"
                  :key="i"
                >
                  <div class="z">
                    <div class="carousel-blog-item-services mx-services">
                      <div
                        class="metacolor mb-4"
                        :class="`metacolor-${i % 7}`"
                      ></div>
                      <div>
                        <div class="info">
                          <h3 class="mb-0">
                            <MetaLink :page="item.page" css-class="n-link">
                              <span>{{ item.page.name }}</span>
                              <svg
                                class="svg-hoverable ms-2"
                                width="25"
                                height="25"
                                viewBox="0 0 25 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <mask
                                  id="mask0_1229_11482"
                                  style="mask-type: alpha"
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="0"
                                  width="25"
                                  height="25"
                                >
                                  <rect
                                    width="24"
                                    height="24"
                                    transform="matrix(-1 0 0 1 24.4922 0.418091)"
                                    fill="#D9D9D9"
                                  />
                                </mask>
                                <g mask="url(#mask0_1229_11482)">
                                  <path
                                    d="M6.89219 18.4181L16.4922 8.81809V17.4181H18.4922V5.41809H6.49219V7.41809H15.0922L5.49219 17.0181L6.89219 18.4181Z"
                                    fill="#1C1B1F"
                                  />
                                </g>
                              </svg>
                            </MetaLink>
                          </h3>
                        </div>

                        <div
                          class="meta-description mt-4"
                          v-if="item?.page?.metadata"
                        >
                          <MetaLink
                            :page="item.page"
                            :text="item?.page?.metadata?.metaDescription"
                            css-class="text-link"
                          >
                            {{ item?.page?.metadata?.metaDescription }}
                          </MetaLink>
                        </div>
                      </div>
                    </div>
                    <svg
                      class="circle-bottom"
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="9.32227" cy="9.05188" r="9" fill="black" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="row text-left mb-0 mb-md-5">
          <div class="col-12 col-md-8 col-lg-4">
            <div class="the-sub-title">
              <h3>{{ section.subTitle }}</h3>
            </div>
          </div>
          <div class="col-12 col-md-4 col-lg-8">
            <div
              class="d-flex w-100 justify-content-center justify-content-md-end the-arrows"
            >
              <button
                class="carousel-control-prev carousel-control-prev-3 hoverable"
                type="button"
                :data-bs-target="`#carousel-${section.id}`"
                data-bs-slide="prev"
              >
                <span
                  class="carousel-control-prev-icon carousel-control-prev-icon-orange"
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
                  class="carousel-control-next-icon carousel-control-next-icon-orange"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>

        <div
          :class="`section-slider-carousel-3 section-slider-carousel-3-${section.id} mx-auto my-auto justify-content-center`"
        >
          <div class="zcol-12">
            <div
              :id="`carousel-${section.id}`"
              class="carousel slide"
              data-bs-ride="carousel"
              :data-bs-interval="section.intervalMilliseconds || 8000"
            >
              <div class="carousel-inner fake-row d-flex" role="listbox">
                <div
                  class="carousel-item zcol-12 px-0"
                  v-for="(item, i) in section.menu.children.filter((item: any) => item.page)"
                  :key="i"
                  :class="{ active: i === 0 }"
                >
                  <div class="zcol-md-4 mb-4 blog-onethird">
                    <div class="carousel-blog-item mx-custom">
                      <div class="carousel-blog-item-media">
                        <MetaLink :page="item.page">
                          <MetaMedia
                            v-if="
                              item.page &&
                              item.page.metadata &&
                              item.page.metadata.shareImage
                            "
                            css="media"
                            :media="item.page?.metadata?.shareImage"
                          />
                        </MetaLink>
                      </div>
                      <div>
                        <div class="info">
                          <h3 class="mb-0">
                            <MetaLink :page="item.page" css-class="n-link">
                              <svg
                                class="arrow"
                                width="31"
                                height="30"
                                viewBox="0 0 31 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <mask
                                  id="mask0_1232_16628"
                                  style="mask-type: alpha"
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="-1"
                                  width="31"
                                  height="31"
                                >
                                  <rect
                                    x="0.349609"
                                    y="-0.00219727"
                                    width="30"
                                    height="30"
                                    fill="#D9D9D9"
                                  />
                                </mask>
                                <g mask="url(#mask0_1232_16628)">
                                  <path
                                    d="M8.05805 22.3728L6.59961 20.9144L19.183 8.33124H7.72461V6.2478H22.7246V21.2478H20.6412V9.78937L8.05805 22.3728Z"
                                    fill="#F5825E"
                                  />
                                </g>
                              </svg>
                              <div>
                                {{ item.page.name }}
                              </div>
                            </MetaLink>
                          </h3>

                          <div
                            class="meta-description mt-3"
                            v-if="item?.page.metadata?.metaDescriptionShort"
                          >
                            {{ item?.page?.metadata?.metaDescriptionShort }}
                          </div>
                          <div class="typology-name" v-if="item.page.typology">
                            {{ item.page.typology?.name }}
                          </div>
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
  // padding-top: 60px;
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

.subtitle-none {
  color: var(--negre, #000);
  font-family: "PP Neue Montreal";
  font-size: 1.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 2.375rem; /* 126.667% */
  letter-spacing: 0.01875rem;
  margin-bottom: 50px;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
}

h2 {
  width: 30%;
  margin: auto;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
}

h3,
h3 a {
  color: #000;
  font-size: 25px;
  line-height: 32px;
  font-weight: 500;
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

  .arrow {
    transition: all 0.15s ease-in-out;
  }

  &:hover {
    .arrow {
      transform: translateX(5px) translateY(-5px);
    }
  }
}
.blog-onethird {
  width: 33.3333%;
  @media screen and (max-width: 1024px) {
    width: 100%;
  }
}
.a-carousel-item {
  width: 324px;
  @media screen and (min-width: 2200px) {
    width: 364px;
  }
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  padding-bottom: 82px;

  h3,
  h3 a,
  h3 a span {
    color: var(--negre, #000);
    font-family: "PP Neue Montreal";
    font-size: 25px !important;
    font-style: normal !important;
    font-weight: 500 !important;
    line-height: 30px !important; /* 120% */
    letter-spacing: 0.25px !important;
  }
}
.a-fake-row {
  flex-wrap: nowrap;
  width: fit-content;
}
.circle-bottom {
  position: absolute;
  right: -11px;
  bottom: -11px;
}
.buttons-services {
  @media screen and (min-width: 768px) {
    margin-top: 110px;
  }
}

.typology-name {
  color: #898989;
  font-variant-numeric: lining-nums tabular-nums;
  font-family: "PP Neue Montreal";
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; /* 18px */
  letter-spacing: 0.15px;
  margin-top: 0.5rem;
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

.slider-three-black {
  .carousel-control-next-icon-orange {
    background-image: url("data:image/svg+xml,%3Csvg width='92' height='92' viewBox='0 0 92 92' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_208_2122' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='92' height='93'%3E%3Crect y='0.000244141' width='92' height='92' fill='%23D9D9D9'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_208_2122)'%3E%3Cpath d='M67.6586 47.0544H20.3169V44.9461H67.6586L44.5627 21.8502L46.0002 20.3169L71.6836 46.0002L46.0002 71.6836L44.5627 70.1502L67.6586 47.0544Z' fill='%23F5825E'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 1;
  }
  .carousel-control-prev-icon-orange {
    background-image: url("data:image/svg+xml,%3Csvg width='92' height='92' viewBox='0 0 92 92' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_208_2125' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='92' height='93'%3E%3Crect width='92' height='92' transform='matrix(-1 0 0 1 92 0.000244141)' fill='%23D9D9D9'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_208_2125)'%3E%3Cpath d='M24.3414 47.0544H71.6831V44.9461H24.3414L47.4373 21.8502L45.9998 20.3169L20.3164 46.0002L45.9998 71.6836L47.4373 70.1502L24.3414 47.0544Z' fill='%23F5825E'/%3E%3C/g%3E%3C/svg%3E");
  }
}

.carousel-control-next-icon,
.carousel-control-prev-icon {
  width: 6rem;
  height: 6rem;
}
.carousel-control-next,
.carousel-control-prev {
  opacity: 1;
  width: 85px;
  cursor: none !important;
  @media screen and (max-width: 768px) {
    //width: 30%;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

.carousel-control-prev {
  transition: all 0.3s ease-in-out;
  &:hover {
    left: 0px !important;
  }
}
.carousel-control-next {
  transition: all 0.3s ease-in-out;
  &:hover {
    right: -30px !important;
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
  left: 10px;
  @media screen and (max-width: 768px) {
    left: -10px;
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

    .blog-twofifths {
      width: 45%;
    }

    @media (min-width: 1230px) {
      .blog-twofifths {
        width: 20%;
      }
    }

    @media (min-width: 1930px) {
      .blog-twofifths {
        width: 16%;
      }
    }
  }

  .carousel-inner .carousel-item-end,
  .carousel-inner .carousel-item-start {
    transform: translateX(0);
  }

  .metacolor {
    background: #b06047;
    height: 0.75rem;
  }

  .metacolor-0 {
    background: #d9c05d;
  }
  .metacolor-1 {
    background: #b06047;
  }
  .metacolor-2 {
    background: #9a5567;
  }
  .metacolor-3 {
    background: #bbc4c3;
  }
  .metacolor-4 {
    background: #999b65;
  }
  .metacolor-5 {
    background: #6e5655;
  }
  .metacolor-6 {
    background: #b2896e;
  }
  .text-link {
    text-decoration: none !important;
    color: #000 !important;
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
.mx-services {
  margin-right: 42px !important;
  margin-left: 42px !important;
}
.fake-row {
  padding: 0 !important;
  @media screen and (min-width: 769px) {
    width: 102%;
    margin-left: -16px;
    margin-right: -16px;
  }
}

.slider-three-black {
  h3 {
    color: var(--Blanc, #fff) !important;
    font-family: "PP Neue Montreal" !important;
    font-size: 40px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    line-height: 45px !important; /* 112.5% */
    letter-spacing: 0.4px !important;
  }
  .carousel-blog-item {
    border-radius: 0.3125rem;
    background: #1f1f1f;
    position: relative;

    h3,
    h3 a {
      color: var(--Blanc, #fff);
      font-variant-numeric: lining-nums tabular-nums;
      font-family: "PP Neue Montreal";
      font-size: 1.40625rem !important; /* 22.5px */
      font-style: normal;
      font-weight: 500;
      line-height: 120%; /* 1.6875rem */
      letter-spacing: 0.01406rem;
    }
    .carousel-blog-item-media {
      height: 246px;
      overflow: hidden;
    }
    img {
      border-radius: 6px 6px 0 0 !important;
    }
    .info {
      padding-bottom: 4rem;
    }
    .meta-description {
      color: #898989;
      font-variant-numeric: lining-nums tabular-nums;
      font-family: "PP Neue Montreal";
      font-size: 1.17188rem;
      font-style: normal;
      font-weight: 400;
      line-height: 120%; /* 1.40625rem */
      letter-spacing: 0.01175rem;
    }
    .typology-name{
      position: absolute;
      bottom: 30px;
      left: 30px;
    }
  }
}
.slider-three-black-kaos {
  .the-sub-title h3 {
    color: var(--Taronja, #f5825e) !important;
    font-family: "PP Neue Montreal" !important;
    font-size: 40px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    line-height: 45px !important; /* 112.5% */
    letter-spacing: 0.4px !important;
  }
  .the-arrows {
    margin-top: -24px;
  }
  .carousel-blog-item-media {
    height: 480px !important;
    border-radius: 0 !important;
  }
  .carousel-blog-item img {
    height: 480px;
    border-radius: 0 !important;
  }
  .carousel-blog-item {
    background: #000;
    border-radius: 0 !important;

    .info {
      padding: 30px 0 0 0;
    }
  }
  .arrow {
    display: none;
  }

  .carousel-blog-item h3 a{
    color: var(--Blanc, #fff) !important;
    font-variant-numeric: lining-nums tabular-nums;
    font-family: "PP Neue Montreal" !important;
    font-size: 20px !important;
    font-style: normal !important;
    font-weight: 500 !important;
    line-height: 120% !important; /* 24px */
    letter-spacing: 0.2px !important;
  }
  .typology-name{
      position: relative!important;
      bottom: auto!important;
      left: auto!important;
    }
}
</style>
