<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

const runtimeConfig = useRuntimeConfig();

const hasBackground = computed(() => {
  return props.section.background ? true : false;
});

const backgrondStyle = computed(() => ({
  background: props.section.background
    ? props.section.background
    : "none",
}));
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
      <div class="row section-slider-carousel">
        <Carousel control>
          <CarouselInner>
            <CarouselItem
              v-for="(item, pageIndex) in section.menu.children"
              :key="pageIndex"
            >
              <div class="carousel-item-inner">
                <div class="row">
                  <div class="col col-7">
                    <img
                      :src="
                        runtimeConfig.public.apiBase +
                        item?.page?.metadata?.shareImage?.url
                      "
                      :alt="item?.page.name"
                    />
                  </div>
                  <div class="col col-5 carousel-item-inner-column-text" :class="`has-background-${hasBackground}`">
                    <div class="carousel-item-inner-text">
                      <h3>{{ item?.page.name }}</h3>
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
            </CarouselItem>
          </CarouselInner>
        </Carousel>
        
        <div>
        <div class="carousel-c2a text-center mt-3" v-if="section.c2a">
        <MetaC2A
          
          :c2a="section.c2a"
          :section="section"
          ></MetaC2A>
        </div>
      </div>
      </div>
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

.section-slider-carousel {
  padding-top: 50px;
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
.carousel-item-inner {
  border-radius: 30px;
}
img {
  width: 100%;
  height: 550px;
  object-fit: cover;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
}
.carousel-item-inner-column-text {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  border: 1px solid #000;
  border-left: 0;
  background: #fff;

  &.has-background-true{
    border: 0;
  }
}

.carousel-item-inner-text {
  padding: 80px 80px 0 80px;
}
.carousel-item-inner .col {
  padding: 0 !important;
}
.carousel-c2a{
  width: 80%!important;
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
<style lang="css">
.carousel-control-next-icon {
  background-image: url("data:image/svg+xml,%3Csvg width='92' height='92' viewBox='0 0 92 92' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_208_2122' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='92' height='93'%3E%3Crect y='0.000244141' width='92' height='92' fill='%23D9D9D9'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_208_2122)'%3E%3Cpath d='M67.6586 47.0544H20.3169V44.9461H67.6586L44.5627 21.8502L46.0002 20.3169L71.6836 46.0002L46.0002 71.6836L44.5627 70.1502L67.6586 47.0544Z' fill='%231C1B1F'/%3E%3C/g%3E%3C/svg%3E");
  opacity: 1;
}
.carousel-control-prev-icon{
  background-image: url("data:image/svg+xml,%3Csvg width='92' height='92' viewBox='0 0 92 92' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_208_2125' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='92' height='93'%3E%3Crect width='92' height='92' transform='matrix(-1 0 0 1 92 0.000244141)' fill='%23D9D9D9'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_208_2125)'%3E%3Cpath d='M24.3414 47.0544H71.6831V44.9461H24.3414L47.4373 21.8502L45.9998 20.3169L20.3164 46.0002L45.9998 71.6836L47.4373 70.1502L24.3414 47.0544Z' fill='%231C1B1F'/%3E%3C/g%3E%3C/svg%3E");
}
.carousel-control-next-icon, .carousel-control-prev-icon{
  width: 4rem;
  height: 4rem;
}
.carousel-control-next, .carousel-control-prev{
  opacity: 1;
  width: 10%;
}
</style>