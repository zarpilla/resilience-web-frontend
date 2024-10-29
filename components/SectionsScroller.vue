<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

const runtimeConfig = useRuntimeConfig();

const hasBackground = computed(() => {
  return props.section.background ? true : false;
});

const backgrondStyle = computed(() => ({
  background: props.section.background ? props.section.background : "none",
}));

const { $bs } = useNuxtApp() as any;

onMounted(() => {
  try {
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
      :style="backgrondStyle"
      v-if="
        section.menu && section.menu.children && section.menu.children.length
      "
    >
      <div class="row text-center">
        <div class="subtitle-outter mb-4">
          <div class="subtitle">{{ section.subTitle }}</div>
        </div>
        <h2 class="mb-5">{{ section.title }}</h2>
      </div>
      <div class="row section-scroller">
        <div class="col-12">
          <div :id="`scroller-${section.id}`" class="scroller">
            <div class="scroller-inner">
              <div
                class="scroller-item"
                v-for="(item, i) in section.menu.children"
                :key="i"
              >
                <div class="scroller-item-inner">
                  <div class="row">
                    <div class="col-12 col-md-7 py-0 px-0 pe-md-0">
                      <img
                        :src="
                          runtimeConfig.public.apiBase +
                          item?.page?.metadata?.shareImage?.url
                        "
                        :alt="item?.page.name"
                      />
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.section-scroller > .container {
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

h3 a {
  color: #000;
}

.section-slider-carousel {
  padding-top: 50px;
}

.scroller-inner {
  @media screen and (max-width: 768px) {
    padding-left: 60px;
    padding-right: 60px;
  }
}

.scroller-item-inner {
  width: 80%;
  margin: auto;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
}
.scroller-item {
  width: 100%;
}

img {
  width: 100%;
  height: 550px;
  object-fit: cover;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  @media screen and (max-width: 767px) {
    height: 300px;
    border-bottom-left-radius: 0px;
    border-top-right-radius: 30px;
  }
}
.scroller-item-inner-column-text {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  border: 1px solid #000;
  border-left: 0;
  background: #fff;

  @media screen and (max-width: 767px) {
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
    border-left: 1px solid #000;
    border-top: 0;
  }

  &.has-background-true {
    border: 0;
  }
}

.scroller-item-inner-text {
  padding: 80px 80px 0 80px;
  @media screen and (max-width: 768px) {
    padding: 30px;
  }
}
.caroscrollerusel-item-inner .col {
  padding: 0 !important;
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
<style lang="css">
.section-scroller-carousel {
  min-height: 665px;
}
</style>
