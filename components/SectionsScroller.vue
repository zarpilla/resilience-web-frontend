<script setup lang="ts">
const { $gsap, $ScrollTrigger, $Observer } = useNuxtApp();
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

onMounted(() => {
  const scrollerInner = document.querySelector(".scroller-container");
  const sectionsScroller = document.querySelector(".section-sections-scroller");

  if (!scrollerInner || !sectionsScroller) {
    return;
  }

  let sections = $gsap.utils.toArray(".scroller-item");

  // add a random bg color to each section
  // sections.forEach((section: any, i) => {
  //   section.style.background = `hsl(${i * (360 / sections.length)}, 70%, 80%)`;
  // });

  // Calculate the total width of the horizontal scroll content
  const totalWidth = scrollerInner.scrollWidth;

  const xPercent = (-100 * totalWidth) / (window as any).innerWidth;

  const tl = $gsap.to(sections, {
    xPercent: xPercent * 1.2,
    ease: "none",
    scrollTrigger: {
      trigger: ".scroller-container",
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => "+=" + totalWidth,
      // markers: true,
      onUpdate(self: any) {
        // set sectionsScroller backuground-position to move with the scroll, but very slowly
        $gsap.set(sectionsScroller, {
          backgroundPosition: `${-1 * self.progress * 20}% 0px`,
        });
      },
    },
  });
});

onUnmounted(() => {
  $ScrollTrigger.getAll().forEach((trigger: any) => {
    trigger.kill();
  });
});
</script>
<template>
  <div class="section-scroller">
    <div
      class="container"
      :style="backgroundStyle"
      v-if="
        section.menu && section.menu.children && section.menu.children.length
      "
    >
      <div class="row text-center">
        <h2 class="mb-5">{{ section.title }}</h2>
        <div class="subtitle-outter mb-4" v-if="section.subtitle">
          <h3 class="subtitle">{{ section.subtitle }}</h3>
        </div>
      </div>
    </div>
  </div>

  <div class="scroller-container" v-if="section.preset !== 'images'">
    <div class="scroller-item" v-for="(item, i) in section.menu.children">
      <div class="carousel-item-inner" :class="`margin-rand-${i % 4}`">
        <div class="carousel-item-inner-1">
          <div class="div">
            <img
              :src="
                runtimeConfig.public.apiBase +
                item?.page?.metadata?.shareImage?.url
              "
              :alt="item?.page.name"
            />
          </div>
          <div class="div" :class="`has-background-${hasBackground}`">
            <div class="carousel-item-inner-text px-5 py-5">
              <h3>
                <MetaLink
                  :page="item.page"
                  :text="item.page.name"
                  href="#"
                  target=""
                  css-class="hoverable"
                ></MetaLink>
              </h3>
              <div class="meta-description mt-4">
                {{ item?.page.metadata?.metaDescription }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="scroller-container" v-else>
    <div class="scroller-item" v-for="(item, i) in section.menu.children">
      <div class="carousel-item-inner-image">
        <div class="carousel-item-inner-image-1">
          <img :src="runtimeConfig.public.apiBase + item?.image.url" :alt="item?.image.alternativeText" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.section-scroller {
  padding-bottom: 0px;
}

.subtitle {
  @media screen and (min-width: 768px) {
    width: 50%;
    margin: 0 auto;
  }
}

.scroller-container {
  height: 80vh;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    height: auto;
  }
}

.scroller-item-first {
  width: 5vw !important;
  flex: 0 0 auto;
  background: transparent;
  @media screen and (max-width: 768px) {
    width: 0 !important;
  }
}

.scroller-item {
  width: 33.33vw;
  flex: 0 0 auto;
  margin-top: 100px;
  @media screen and (max-width: 768px) {
    width: 100vw !important;
  }
}

.carousel-item-inner {
  margin: 0 60px;
  @media screen and (max-width: 768px) {
    margin: 0 20px;
  }

  &.margin-rand-0 {
    margin-top: 40px;
    @media screen and (max-width: 768px) {
      margin-top: 10px;
    }
  }
  &.margin-rand-1 {
    margin-top: 120px;
    @media screen and (max-width: 768px) {
      margin-top: 20px;
    }
  }
  &.margin-rand-2 {
    margin-top: 0px;
    @media screen and (max-width: 768px) {
      margin-top: 0px;
    }
  }
  &.margin-rand-3 {
    margin-top: 80px;
    @media screen and (max-width: 768px) {
      margin-top: 10px;
    }
  }

  .carousel-item-inner-1 {
    background-color: #fff;
    border-radius: 20px;
  }

  img {
    width: 100%;
    height: 232px;
    object-fit: cover;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
}

.carousel-item-inner-image {
  margin: 0 10px;

  img {
    width: 100%;
    height: 580px;
    object-fit: cover;
    border-radius: 20px;
  }
}
</style>
