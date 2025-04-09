<script setup lang="ts">
import { computed } from "vue";
const { $gsap } = useNuxtApp();

const props = defineProps<{
  section: any;
  sectionIndex: number;
  type: string;
  slug: string;
}>();
const { locale, setLocale } = useI18n();

const runtimeConfig = useRuntimeConfig();

const heightStyle = computed(() => ({
  height: props.section.styles?.height ? props.section.styles?.height : "auto",
}));

const backgroundImageStyle = computed(() => ({
  backgroundImage: props.section.backgroundImage?.url
    ? `url(${runtimeConfig.public.apiBase + props.section.backgroundImage.url})`
    : "none",
}));

const imageStyleArticle = computed(() => {
  return props.type === "article" && props.section.styles.backgroundImage?.url
    ? runtimeConfig.public.apiBase + props.section.styles.backgroundImage.url
    : null;
});

const backgroundColorStyle = computed(() => ({
  backgroundColor: props.section.styles?.backgroundColor
    ? props.section.styles?.backgroundColor
    : null,
}));

const isScope = computed(() => props.type === "scope");
const isService = computed(() => props.type === "service");
const isCapability = computed(() => props.type === "capability");
const isArticle = computed(() => props.type === "article");

const textStore = useTextStore();
const texts = computed(() =>
  textStore.texts.find((h) => h.locale === locale.value)
);

const isHome = computed(() => props.slug === "home");
const home1 = ref<string>("");
const home2 = ref<string>("");

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const dowhile = ref<boolean>(true);

const homeTitleTransition = async () => {
  const home0El = document.getElementById("home0");
  const home1El = document.getElementById("home1");
  const home2El = document.getElementById("home2");

  if (home0El && home1El && home2El) {
    // Fade in home0 and home2 with GSAP
    await $gsap.to(home0El, { opacity: 1, duration: 1, delay: 0 });
    await $gsap.to(home1El, { opacity: 1, duration: 1, delay: 0.5 });
    await $gsap.to(home2El, { opacity: 1, duration: 1, delay: 1 });

    // Wait for home2El animation to complete
    // await $gsap.to(home2El, { duration: 1, delay: 3.5 });

    while (dowhile.value) {
      console.log("Starting loop...");

      await delay(2000);
      // Remove letters from home2El
      await removeLetters("home2");
      await delay(500);

      // Fade in home1El
      // await $gsap.to(home1El, { opacity: 1, duration: 1 });

      // Add letters for home3
      await addLetters((texts?.value as any).value.data.home3);

      await delay(2000);

      await removeLetters("home2");

      await delay(500);

      // Add letters for home4
      await addLetters((texts?.value as any).value.data.home4);

      await delay(2000);

      await removeLetters("home2");

      await delay(500);

      // Add letters for home5
      // await addLetters((texts?.value as any).value.data.home5);

      // await delay(2000);

      // await removeLetters("home2");

      // await $gsap.to(home1El, { opacity: 0, duration: 1, delay: 0.5 });

      await addLetters((texts?.value as any).value.data.home2);

      // await delay(2000);
    }
  }
};

const removeLetters = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    const home2El = document.getElementById(id);
    if (!home2El) return resolve();

    const removeNextLetter = () => {
      if (home2El.innerText.length > 0) {
        home2El.innerText = home2El.innerText.slice(0, -1); // Remove the last character

        if (home2El.innerText.length === 0) {
          return resolve();
        }

        const randomNumberBetween = (min: number, max: number) =>
          Math.floor(Math.random() * (max - min + 1) + min);

        setTimeout(removeNextLetter, randomNumberBetween(100, 140)); // Call the function again after a random time
      } else {
        console.warn("All letters removed?");
        resolve();
      }
    };

    removeNextLetter();
  });
};

const addLetters = (word: string): Promise<void> => {
  return new Promise((resolve) => {
    const home2El = document.getElementById("home2");
    if (!home2El) return resolve();

    const addNextLetter = () => {
      
      const currentLength = home2El.innerText.replace(/\u00A0/g, " ").length; // Replace non-breaking spaces for comparison

      if (currentLength < word.length) {
        const nextChar =
          word[currentLength] === " " ? "\u00A0" : word[currentLength]; // Use non-breaking space for spaces
        home2El.innerText += nextChar; // Add the next character

        if (currentLength + 1 === word.length) {
          return resolve();
        }

        const randomNumberBetween = (min: number, max: number) =>
          Math.floor(Math.random() * (max - min + 1) + min);

        setTimeout(addNextLetter, randomNumberBetween(100, 140)); // Call the function again after a random time
      } else {
        console.warn("All letters added?");
        resolve();
      }
    };

    addNextLetter();
  });
};

onMounted(() => {
  if (isHome && texts.value && props.sectionIndex === 0) {
    home1.value = (texts?.value as any).value.data.home1;
    home2.value = (texts?.value as any).value.data.home2;
    homeTitleTransition();
  }
});

onUnmounted(() => {
  dowhile.value = false;
});
</script>
<template>
  <div
    class="section-hero"
    :class="{
      'first-hero': props.sectionIndex === 0,
    }"
  >
    <div class="container">
      <div class="row" v-if="isScope || isService">
        <div class="col-12 col-lg-5">
          <div
            class="section-hero-inner d-flex"
            :class="`align-${section.align}`"
            :style="[heightStyle, backgroundImageStyle, backgroundColorStyle]"
          >
            <div class="scope-hero">
              <b class="scope-title" v-if="isScope">{{
                texts?.value.data.scopes
              }}</b>
              <b class="scope-title" v-if="isService">{{
                texts?.value.data.services
              }}</b>
              <MetaTitleSubTitle :section="section" :type="type" />
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-7"></div>
      </div>
      <div
        v-else-if="isArticle"
        class="section-hero-inner d-flex w-100"
        :class="`align-${section.align}`"
        :style="[heightStyle, backgroundImageStyle, backgroundColorStyle]"
      >
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="scope-hero-caos" v-if="isArticle">
              <b class="scope-title">{{ texts?.value.data.articles }}</b>
            </div>
            <MetaTitleSubTitle :section="section" :type="type" />
          </div>
          <div v-if="imageStyleArticle" class="col-12 col-md-1"></div>
          <div
            v-if="imageStyleArticle"
            class="col-12 col-md-5 align-top-right zmt-5"
          >
            <div class="align-top-right">
              <img
                :src="imageStyleArticle"
                :alt="props.section.styles.backgroundImage.alternativeText"
                class="article-image"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="section-hero-inner d-flex"
        :class="`align-${section.align}`"
        :style="[heightStyle, backgroundImageStyle, backgroundColorStyle]"
      >
        <div>
          <div class="scope-hero-capability" v-if="isCapability">
            <b class="scope-title">{{ texts?.value.data.capabilities }}</b>
          </div>
          <template v-if="isHome">
            <h1 class="home-h1">
              <div id="home0" style="opacity: 0">{{
                texts?.value.data.home0
              }}</div>
              <div id="home1" style="opacity: 0">{{ home1 }}</div>              
              <span id="home2" style="opacity: 0">{{ home2 }}</span>
            </h1>
            <!-- <span>{{texts?.value.data.home3}}</span>
            <span>{{texts?.value.data.home4}}</span>
            <span>{{texts?.value.data.home5}}</span> -->
          </template>
          <template v-else>
            <MetaTitleSubTitle :section="section" :type="type" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.section-hero {
  background-size: cover;

  &.first-hero {
    @media screen and (max-width: 768px) {
      padding-top: 100px;
    }
  }
  .bold {
    font-weight: 500;
  }
}
.section-hero-inner {
  padding: 100px 0;
  @media screen and (max-width: 768px) {
    padding: 50px 0;
  }
}
.align-bottom-left {
  text-align: left;
  align-items: flex-end;
}
.align-top-right .align-centered, .align-centered {
  text-align: center;
  align-items: center;
  margin: auto;
  justify-content: center;
}
.scope-hero {
  .scope-title {
    color: var(--Negre, #000);
    font-family: "PP Neue Montreal";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 70px; /* 437.5% */
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
}
.scope-hero-capability {
  .scope-title {
    font-family: "PP Neue Montreal";
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 70px; /* 437.5% */
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
}
.home-h1 span {
  display: inline-block;
  min-height: 70px;
}
</style>
<style lang="scss">
.section-inner-type-scope,
.section-inner-type-service,
.section-inner-type-article {
  .align-centered {
    text-align: left;
  }
  .scope-title {
    text-align: left !important;
    margin-top: 2rem;
  }
  h1 {
    margin-bottom: 3rem;
  }
  .scope-hero {
    p {
      color: var(--Negre, #000);
      font-family: "Queens";
      font-size: 26px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%; /* 33.8px */
      letter-spacing: 0.26px;
    }
  }
}
.scope-hero-caos {
  color: var(--Taronja, #f5825e);
  font-family: "PP Neue Montreal";
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 70px; /* 437.5% */
  letter-spacing: 0.8px;
  text-transform: uppercase;
}
.article-image {
  width: 100%;
}
</style>
