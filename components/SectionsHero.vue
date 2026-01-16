<script setup lang="ts">
import { computed, nextTick } from "vue";
const { $gsap } = useNuxtApp();

const props = defineProps<{
  section: any;
  sectionIndex: number;
  type: string;
  slug: string;
  audio?: any;
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

const imageStyleService = computed(() => {
  return props.type === "zservice" && props.section.styles.backgroundImage?.url
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
const isResource = computed(() => props.type === "resource");

const textStore = useTextStore();
const texts = computed(() =>
  textStore.texts.find((h) => h.locale === locale.value)
);

const isHome = computed(() => props.slug === "home");
const home1 = ref<string>("");
const home2 = ref<string>("");
const showEffects = ref<boolean>(true);
const homeTexts = ref<string[]>([]); // Will hold home3, home4, home5, etc.

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const dowhile = ref<boolean>(true);

const homeTitleTransition = async () => {
  // Wait for DOM to be ready
  await nextTick();

  const runAnimation = () => {
    // Get fresh references to DOM elements each time
    const txt0El = document.querySelector(".txt0");
    const txt1El = document.querySelector(".txt1");
    const barEl = document.querySelector(".bar");
    const bar2El = document.querySelector(".bar2");
    
    if (!txt0El || !txt1El || !barEl || !bar2El || !texts.value) {
      console.warn("Required elements not found for GSAP animation");
      return;
    }

    // Reset all elements to initial state
    const resetElements = () => {
      // Re-split txt1 into characters for each loop
      const splitTextToChars = (element: Element) => {
        const text = element.textContent || '';
        element.innerHTML = '';
        const chars: HTMLElement[] = [];
        
        for (let i = 0; i < text.length; i++) {
          const char = document.createElement('span');
          char.textContent = text[i] === ' ' ? '\u00A0' : text[i];
          char.style.display = 'inline-block';
          element.appendChild(char);
          chars.push(char);
        }
        
        return chars;
      };

      // Reset txt1 content and split again
      txt1El.textContent = (texts?.value as any).value.data.home1;
      const t2 = splitTextToChars(txt1El);
      
      // Reset all elements to initial state
      $gsap.set([".txt0", ".txt1", ".txt2", ".txt3", ".txt4", ".txt5"], {
        opacity: 1,
        color: "transparent"
      });
      
      $gsap.set(".effects", { opacity: 1 });
      $gsap.set([".bar", ".bar2"], { 
        backgroundColor: "transparent", 
        left: 0 
      });

      return t2;
    };

    const t2 = resetElements();
    
    const color1 = "#fff";
    
    const moveBar = () => {
      const txt0Width = Number($gsap.getProperty(".txt0", "width")) || 0;
      $gsap.set(".bar", { backgroundColor: color1, left: txt0Width + 1 });
    };

    const moveBar2 = () => {
      const txt2Width = Number($gsap.getProperty(".txt2", "width")) || 0;
      $gsap.set(".bar2", { backgroundColor: color1, left: txt2Width + 1 });
    };

    const moveBar3 = () => {
      const txt3Width = Number($gsap.getProperty(".txt3", "width")) || 0;
      $gsap.set(".bar2", { backgroundColor: color1, left: txt3Width + 1 });
    };

    const moveBar4 = () => {
      const txt4Width = Number($gsap.getProperty(".txt4", "width")) || 0;
      $gsap.set(".bar2", { backgroundColor: color1, left: txt4Width + 1 });
    };

    // Dynamic moveBar functions for additional home texts
    const moveBarN = (index: number) => {
      const txtWidth = Number($gsap.getProperty(`.txt${index}`, "width")) || 0;
      $gsap.set(".bar2", { backgroundColor: color1, left: txtWidth + 1 });
    };

    // Create the timeline
    const tl = $gsap.timeline({ 
      delay: 0.1,
      onComplete: () => {
        // Check if component is still mounted before repeating
        if (dowhile.value) {
          // Hide effects div to reset DOM
          showEffects.value = false;
          
          // Wait 1 second, then show div and restart animation
          setTimeout(() => {
            showEffects.value = true;
            setTimeout(runAnimation, 100); // Small delay to ensure DOM is ready
          }, 500);
        }
      }
    });
      
    tl.set(".txt0", { color: color1, fontWeight: "regular" })
      .set(".txt2", { color: color1, fontWeight: "regular" })
      .set(".txt3", { color: color1, fontWeight: "regular" })    
      .set(".txt1", {
        color: color1,
        opacity: 0,
        x: 0,
        immediateRender: true,
      })
      .from(
        ".txt0",
        {
          duration: 1.0,
          width: 0,
          ease: "steps(" + (home1.value?.length || 10) + ")",
          onUpdate: moveBar,
        },
        1.5
      )
      .to(".txt1", { duration: 0.9, opacity: 1 }, "-=0.1")
      .to(".bar", { duration: 0.15, opacity: 0 })
      .from(
        t2,
        { duration: 0.8, opacity: 0, ease: "power3.inOut", stagger: 0.02 },
        "-=0.5"
      )
      .to(t2[15], { duration: 0.5, opacity: 0 }, "+=0.75")
      .to(t2[14], { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[13], { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[12], { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[10], { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[9],  { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[8],  { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[7],  { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[6],  { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[5],  { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[4],  { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[3],  { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[2],  { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[1],  { duration: 0.5, opacity: 0 }, "-=0.5")
      .to(t2[11], { 
        duration: 0.30, 
        x: () => {
          let totalWidth = 0;
          for (let i = 1; i <= 10; i++) {
            if (t2[i]) {
              totalWidth += t2[i].getBoundingClientRect().width;
            }
          }
          return -1 * totalWidth;
        }, 
        opacity: 1 
      }, "+=0.25")
      .from(
        ".txt2",
        {
          duration: 0.4,
          width: 0,
          ease: "steps(" + (home2.value ? (home2.value.length + 1) : 10) + ")",
          onUpdate: moveBar2,
        },
      )
      .set(".txt3", { 
        left: () => {
          const txt2Width = Number($gsap.getProperty(".txt2", "width")) || 0;
          let remainingWidth = 0;
          if (t2[0]) remainingWidth += t2[0].getBoundingClientRect().width;
          if (t2[11]) remainingWidth += t2[11].getBoundingClientRect().width;
          return remainingWidth + txt2Width;
        }
      })
      .from(
        ".txt3",
        {
          duration: 0.5,
          width: 0,
          ease: "steps(10)",
          onUpdate: moveBar3,
        },
      )
      .to(".txt3", { duration: 0.5, opacity: 0 }, "+=1")
      .set(".txt4", { 
        left: () => {
          const txt2Width = Number($gsap.getProperty(".txt2", "width")) || 0;
          let remainingWidth = 0;
          if (t2[0]) remainingWidth += t2[0].getBoundingClientRect().width;
          if (t2[11]) remainingWidth += t2[11].getBoundingClientRect().width;
          return remainingWidth + txt2Width;
        }
      })
      .set(".txt4", { color: color1, fontWeight: "regular" })
      .from(
        ".txt4",
        {
          duration: 0.5,
          width: 0,
          ease: "steps(10)",
          onUpdate: moveBar4,
        },
      )
      .to(".txt4", { duration: 0.5, opacity: 0 }, "+=1");
      
      // Dynamically add animations for home5, home6, home7, home8, home9
      for (let i = 5; i < 3 + homeTexts.value.length; i++) {
        const txtClass = `.txt${i}`;
        tl.set(txtClass, { 
          left: () => {
            const txt2Width = Number($gsap.getProperty(".txt2", "width")) || 0;
            let remainingWidth = 0;
            if (t2[0]) remainingWidth += t2[0].getBoundingClientRect().width;
            if (t2[11]) remainingWidth += t2[11].getBoundingClientRect().width;
            return remainingWidth + txt2Width;
          }
        })
        .set(txtClass, { color: color1, fontWeight: "regular" })
        .from(
          txtClass,
          {
            duration: 0.5,
            width: 0,
            ease: "steps(10)",
            onUpdate: () => moveBarN(i),
          },
        )
        .to(txtClass, { duration: 0.5, opacity: 0 }, "+=1");
      }
      
      tl.to(".effects", { duration: 1, opacity: 0 }, "+=1")
      .timeScale(0.95);
  };

  // Start the first animation
  runAnimation();
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

const addLetters = (word: string, elementId: string): Promise<void> => {
  return new Promise((resolve) => {
    const home2El = document.getElementById(elementId);
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

onMounted(async () => {
  if (isHome && texts.value && props.sectionIndex === 0) {
    home1.value = (texts?.value as any).value.data.home1;
    
    // Populate homeTexts array with home3 through home9 (stop at empty)
    homeTexts.value = [];
    for (let i = 3; i <= 9; i++) {
      const homeText = (texts?.value as any).value.data[`home${i}`];
      if (homeText && homeText.trim() !== '') {
        homeTexts.value.push(homeText);
      } else {
        break; // Stop at first empty value
      }
    }
    
    // Wait a bit for the DOM to be fully rendered
    await nextTick();
    setTimeout(() => {
      homeTitleTransition();
    }, 100);
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
      <div class="row" v-if="isService || isScope">
        <div class="col-12 col-lg-4">
          <div
            class="section-hero-inner d-flex"
            :class="`align-${section.align}`"
            :style="[heightStyle, backgroundImageStyle, backgroundColorStyle]"
          >
            <div class="scope-hero">
              <b class="scope-title" v-if="isService || isScope">{{
                texts?.value.data.services
              }}</b>
              <MetaTitleSubTitle :section="section" :type="type" />

              <div v-if="section.listenAudioAfter && audio" class="mt-5">
                <MetaListen
                  v-if="section.listenAudioAfter"
                  :audio="audio"
                ></MetaListen>
              </div>
            </div>
          </div>
        </div>
        <div v-if="imageStyleService" class="col-12 col-md-1"></div>
        <div
          v-if="imageStyleService"
          class="col-12 col-lg-7 align-top-right zmt-5"
        >
          <div class="section-hero-inner-image d-flex align-centered">
            <img
              :src="imageStyleService"
              :alt="props.section.styles.backgroundImage.alternativeText"
              class="service-image"
            />
          </div>
        </div>
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
              <b class="scope-title scope-title">
                <MetaLink
                  :page="texts?.value.data.articlesPage"
                  :text="texts?.value.data.articles"
                ></MetaLink>
              </b>
            </div>
            <MetaTitleSubTitle :section="section" :type="type" />

            <div v-if="section.listenAudioAfter && audio" class="mt-5">
              <MetaListen
                v-if="section.listenAudioAfter"
                :audio="audio"
                css="white"
              ></MetaListen>
            </div>
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
            <b class="scope-title" v-if="isScope">{{
              texts?.value.data.scopes
            }}</b>
            <b class="scope-title" v-else>{{
              texts?.value.data.capabilities
            }}</b>
          </div>
          <div class="scope-hero-resources" v-if="isResource">
            <b class="scope-title">
              <MetaLink
                :page="texts?.value.data.resourcesPage"
                :text="texts?.value.data.resources"
              ></MetaLink>
            </b>
          </div>

          <template v-if="isHome">
            <h1 class="home-h1">
              <div v-if="showEffects" class="effects">
                <div class="txt0" style="color: transparent">{{ texts?.value.data.home0 }}                                    
                </div>
                
                <div class="text d-flex position-relative">
                  <div class="txt2" style="color: transparent">{{ texts?.value.data.home2 + '&nbsp;' }}</div>
                  <div class="txt1" style="color: transparent">{{ texts?.value.data.home1 }}</div>
                  <div 
                    v-for="(homeText, index) in homeTexts" 
                    :key="`home-${index + 3}`"
                    :class="`txt${index + 3}`" 
                    class="position-absolute" 
                    style="color: transparent"
                  >
                    {{ homeText }}
                  </div>
                </div>
                
                <div class="bar" style="color: transparent"></div>
                <div class="bar2" style="color: transparent"></div>
              </div>

              <!-- <div id="home0" style="opacity: 0">
                {{ texts?.value.data.home0 }}
              </div>
              <div>
                <span id="home1" style="opacity: 0">{{ home1 }}</span
                >&nbsp;
                <span id="home2" style="opacity: 0">{{ home2 }}</span>
              </div> -->
            </h1>
          </template>
          <template v-else>
            <MetaTitleSubTitle :section="section" :type="type" />

            <div v-if="section.listenAudioAfter && audio" class="mt-5">
              <MetaListen
                v-if="section.listenAudioAfter"
                :audio="audio"
                css="white"
              ></MetaListen>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.section-hero {
  background-size: cover;

  // &.first-hero {
  //   @media screen and (max-width: 768px) {
  //     padding-top: 100px;
  //   }
  // }
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
.align-top-right .align-centered,
.align-centered {
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
.zsection-inner-type-scope,
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
.scope-hero-caos a {
  color: var(--Taronja, #f5825e);
  font-family: "PP Neue Montreal";
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 70px; /* 437.5% */
  letter-spacing: 0.8px;
  text-transform: uppercase;
}
.scope-hero-resources a {
  color: var(--Negre, #000);
  text-align: center;
  font-family: "PP Neue Montreal";
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 70px; /* 437.5% */
  letter-spacing: 0.8px;
  text-transform: uppercase;
  &:hover {
    color: var(--Taronja, #f5825e) !important;
  }
}
.article-image {
  width: 100%;
}
.page-type-article {
  .section-inner-index-0 {
    height: auto !important;
  }

  h1 {
    color: var(--Negre, #000);
    font-family: "PP Neue Montreal";
    font-size: 60px !important;
    font-style: normal !important;
    font-weight: 400 !important;
    line-height: 70px !important; /* 116.667% */
    letter-spacing: 0.6px !important;
  }

  .section-hero {
    &.first-hero {
      h1 {
        color: var(--Blanc, #fff) !important;
        font-family: "PP Neue Montreal";
        font-size: 50px !important;
        font-style: normal !important;
        font-weight: 500 !important;
        line-height: 110% !important; /* 55px */
        letter-spacing: 0.5px !important;
        margin-bottom: 2rem !important;
      }
      h3 {
        color: var(--Blanc, #fff);
        font-family: "Queens Trial";
        font-size: 26px;
        font-style: normal;
        font-weight: 400;
        line-height: 130%; /* 33.8px */
        letter-spacing: 0.26px;
      }

      .align-bottom-left {
        align-items: flex-start;

        .col-12:first-child {
          align-self: flex-end;
          padding-bottom: 4rem;
        }
      }
      .section-hero-inner {
        height: auto !important;
      }
    }
  }
}
.page-type-service,
.page-type-scope {
  .service-image {
    width: 100%;
    height: auto;
    min-height: 450px;
    object-fit: cover;
    object-position: center;
    max-width: 100%;
    border-radius: 20px;
  }
}
.effects {
  position: relative;
  display: inline-block;
  
  .txt0, .txt1 {
    display: block;
    white-space: nowrap;
    overflow: hidden;
  }
  .txt2 {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
  }

  // Support dynamic txt3, txt4, txt5, txt6, txt7, txt8, txt9
  [class^="txt"]:not(.txt0):not(.txt1):not(.txt2) {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    position: absolute;
    top: 0;
  }
  
  .txt1 span {
    display: inline-block;
  }

  .bar {
    width: 5px;
    height: 90px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;

    /*
    @media screen and (max-width: 1024px) {
        font-size: 60px;
        line-height: 70px;
    }
    @media screen and (max-width: 768px) {
        font-size: 32px;
        line-height: 40px;
    }
        */

    @media screen and (max-width: 1024px) {
      width: 4px;
      height: 70px;
    }

    @media screen and (max-width: 768px) {
      width: 3px;
      height: 32px;
      top: 6px;      
    }
  }
}
</style>
