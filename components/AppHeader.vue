<script setup lang="ts">
import { useHeaderStore } from "~/stores/header";
const { locale, setLocale, availableLocales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();

defineProps<{
  slug: string;
  colorMode?: "dark" | "light";
}>();

const headerStore = useHeaderStore();
const header = computed(() =>
  headerStore.headers.find((h) => h.locale === locale.value)
);

const runtimeConfig = useRuntimeConfig();

const showMenu = ref(false);

const clickShowMenu = () => {
  showMenu.value = true;
  document.body.style.overflow = "hidden";
  // set overflow hidden to html
  document.documentElement.style.overflow = "hidden";
};

const onClose = () => {
  showMenu.value = false;
  document.body.style.overflow = "auto";
  // set overflow auto to html
  document.documentElement.style.overflow = "auto";
};

const modeStore = useModeStore();

const pageHeaderColorMode = ref("light");

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



watch(
  () => modeStore.pageHeaderColorMode,
  (value) => {
    pageHeaderColorMode.value = value;
  }
);
</script>
<template>
  <header class="d-flex hide-on-footer" :class="`text-${colorMode}`">
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
      <div class="menu-text me-4">
        <a class="zone-color d-none d-md-flex clickable" :href="header?.value?.emailLink.href">{{
          header?.value?.email
        }}</a>
      </div>
      <svg
        class="clickable hoverable zone-color zone-color-stroke"
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
    </div>
  </header>  
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
  z-index: 1;

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
    padding: 20px 20px;
    position: absolute;
    
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
