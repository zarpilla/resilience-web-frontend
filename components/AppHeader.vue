<script setup lang="ts">
import { useHeaderStore } from "~/stores/header";
const { locale, setLocale, availableLocales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();
const { $gsap } = useNuxtApp();

const props = defineProps<{
  slug: string;
  colorMode?: "dark" | "light";
}>();

const headerStore = useHeaderStore();
const header = computed(() =>
  headerStore.headers.find((h) => h.locale === locale.value)
);

const runtimeConfig = useRuntimeConfig();

const showMenu = ref(false);

const cursorCss = ref("cursor-text-light");

const clickShowMenu = () => {
  showMenu.value = !showMenu.value;
  const cursor = document.querySelector(".cursor");
  if (showMenu.value) {
    cursorCss.value = cursor?.classList.contains("cursor-text-dark")
      ? "cursor-text-dark"
      : "cursor-text-light";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add("menu-open");
    //document.body.classList.add("text-dark");
    const appMenu = document.querySelector(".app-menu");
    appMenu?.classList.add("text-dark");
    cursor?.classList.add("cursor-text-dark");
    cursor?.classList.remove("cursor-text-light");
    convertToCross();
  } else {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.classList.remove("menu-open");
    //document.body.classList.remove("text-dark");
    const appMenu = document.querySelector(".app-menu");
    appMenu?.classList.remove("text-dark");
    cursor?.classList.remove("cursor-text-dark");    
    cursor?.classList.add(cursorCss.value);    
    revertToLines();
  }
};

const duration = 0.3;
const convertToCross = () => {
  const menu = document.querySelector(".menu-click");
  if (menu) {
    const lines = menu.querySelectorAll("line");
    if (lines.length === 2) {
      $gsap.to(lines[0], {
        duration,
        attr: { x1: 64.7118, y1: 65.2057, x2: 21.4048, y2: 21.8987 },
      });
      $gsap.to(lines[1], {
        duration,
        attr: { x1: 64.7118, y1: 21.8987, x2: 21.4048, y2: 65.2057 },
      });
      // set width, height and stroke of the menu click to the end values
      $gsap.to(menu, {
        duration,
        attr: { width: 87, height: 87 },
      });
      // set the viewbox
      $gsap.to(menu, {
        duration,
        attr: { viewBox: "0 0 87 87" },
      });
      // translate 20px up
      $gsap.to(menu, {
        duration,
        y: window.innerWidth > 768 ? -27 : 27,
      });
      // translate 20px right
      $gsap.to(menu, {
        duration,
        x: 25,
      });
    }
  }
};
const revertToLines = () => {
  const menu = document.querySelector(".menu-click");
  if (menu) {
    const lines = menu.querySelectorAll("line");
    if (lines.length === 2) {
      $gsap.to(lines[0], {
        duration,
        attr: { x1: 1.05859, y1: 15.2547, x2: 24.4413, y2: 1.75467 },
      });
      $gsap.to(lines[1], {
        duration,
        attr: { x1: 7.05859, y1: 25.6468, x2: 30.4413, y2: 12.1468 },
      });
      // set width, height and stroke of the menu click to the end values
      $gsap.to(menu, {
        duration,
        attr: { width: 32, height: 27 },
      });
      // set the viewbox
      $gsap.to(menu, {
        duration,
        attr: { viewBox: "0 0 32 27" },
      });
      // translate 20px up
      $gsap.to(menu, {
        duration,
        y: 0,
      });
      // translate 20px right
      $gsap.to(menu, {
        duration,
        x: 0,
      });
    }
  }
};

const onClose = () => {
  showMenu.value = false;
  document.body.style.overflow = "auto";
  // set overflow auto to html
  document.documentElement.style.overflow = "auto";
  document.body.classList.remove("menu-open");
};

const modeStore = useModeStore();

const pageHeaderColorMode = ref(props.colorMode || "light");

if (header.value) {
  const css = header.value ? header.value.value.css : "";
  useHead({
    style: css,
    link: [
      {
        rel: "icon",
      },
    ],
  });
  if (header.value.value.favicon) {
    useHead({
      link: [
        {
          rel: "icon",
          href: runtimeConfig.public.apiBase + header.value.value.favicon.url,
          type: "image/x-icon",
        },
      ],
    });
  }
}

// watch(
//   () => modeStore.pageHeaderColorMode,
//   (value) => {
//     pageHeaderColorMode.value = value;
//     console.log("pageHeaderColorMode: ", pageHeaderColorMode.value);
//   }
// );
</script>
<template>
  <header class="d-flex hide-on-footer bg-dark" :class="`text-${colorMode}`">
    <div class="me-auto">
      <nuxt-link :to="localePath('/')" class="logo hoverable clickable">
        <img
          class="hide-on-text-light"
          :class="{ 'd-none': pageHeaderColorMode === 'light' }"
          :src="runtimeConfig.public.apiBase + header?.value?.logo?.url"
          :alt="header?.value?.logo?.alternativeText"
        />
        <img
          class="hide-on-text-dark"
          :class="{ 'd-none': pageHeaderColorMode === 'dark' }"
          :src="runtimeConfig.public.apiBase + header?.value?.logoDark?.url"
          :alt="header?.value?.logo?.alternativeText"
        />
      </nuxt-link>
    </div>
    <div class="menu d-flex mt-3">
      <div class="menu-text me-5">
        <a
          class="zone-color d-none d-md-flex clickable me-2"
          :href="header?.value?.emailLink.href"
          >{{ header?.value?.email }}</a
        >
      </div>
    </div>
  </header>
  <svg
    class="clickable hoverable zone-color zone-color-stroke menu-click"
    :class="`text-${colorMode}`"
    @click="clickShowMenu"
    width="32"
    height="27"
    viewBox="0 0 32 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="1.05859"
      y1="15.2547"
      x2="24.4413"
      y2="1.75467"
      stroke="white"
      stroke-width="3"
    />
    <line
      x1="7.05859"
      y1="25.6468"
      x2="30.4413"
      y2="12.1468"
      stroke="white"
      stroke-width="3"
    />
  </svg>
  <teleport to="body">
    <AppMenu v-show="showMenu" @close="onClose" />
  </teleport>
</template>
<style scoped lang="scss">
header {
  padding: 43px 61px;
  display: flex;
  position: fixed;
  width: 100%;
  pointer-events: none;
  z-index: 10;

  &.bg-light{
    background-color: transparent!important;
  }
  &.bg-dark{
      background-color: transparent!important;
  }

  .clickable {
    pointer-events: all;
  }

  .menu {
    transform: rotate(0deg);

    .menu-text a {
      color: var(--Negre, #000);
      text-align: right;
      font-family: "PP Neue Montreal";
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: 30px; /* 150% */
      letter-spacing: 0.4px;
      text-decoration: none;
    }
    svg line {
      stroke: #000;
    }
  }

  @media screen and (max-width: 768px) {
    width: calc(100% - 40px);
    margin: 20px 20px 0 20px;
    padding: 17px 26px;
    border-radius: 10px;
    position: fixed;
    background: #fff;
    bottom: 20px;

    &.bg-light{
      background-color: #fff!important;
      background-blend-mode: multiply;
    }
    &.bg-dark{
        background-color: #000!important;
        background-blend-mode: multiply;
    }

    .logo{
      img {
        height: 47px;
      }
    }
  }
}

.menu-click {
  z-index: 2000;
  position: fixed;
  right: 61px;
  top: 59px;

  @media screen and (max-width: 768px) {
    right: 48px;
    top: inherit;
    bottom: 48px;
  }
}
</style>
<style lang="scss">
.header-dark {
  header {
    .menu {
      .menu-text a {
        color: var(--Blanc, #fff);
      }
      svg line {
        stroke: #fff;
      }
    }
  }
}
</style>
