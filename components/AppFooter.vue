<script setup lang="ts">
import { useFooterStore } from "~/stores/footer";
const { locale, setLocale } = useI18n();

defineProps<{
  slug: string;
}>();

const localePath = useLocalePath();

const footerStore = useFooterStore();
const footer = computed(() =>
  footerStore.footers.find((h) => h.locale === locale.value)
);
</script>
<template>
  <footer id="footer">
    <div class="text-light">
      <div class="bb-white">
        <div class="container py-5">
          <div class="row">
            <div
              class="col-12 col-md-3 justify-content-center justify-content-md-start d-flex"
            >
              <div class="pt-5">
                <nuxt-link :to="localePath('/')">
                  <MetaMedia
                    css="media-primary"
                    :media="footer?.value.primaryLogo"
                  ></MetaMedia>
                </nuxt-link>
              </div>
            </div>
            <div
              class="col-12 col-md-6 main-text justify-content-center justify-content-md-start px-5 py-5 px-120px text-center text-md-start"
            >
              {{ footer?.value.mainText }}
            </div>
            <div
              class="col-12 col-md-3 justify-content-center justify-content-md-end d-flex"
            >
              <div class="pt-5">
                <a
                  :href="footer?.value.secondaryLogoHref"
                  target="_blank"
                  class="n-link"
                >
                  <MetaMedia
                    css="media-secondary"
                    :media="footer?.value.secondaryLogo"
                  ></MetaMedia>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bb-white">
        <div class="container">
          <div class="row">
            <div
              class="col-12 col-md-3 br-white py-5 justify-content-center justify-content-md-start"
            >
              <div>
                <div class="text-title pb-4 text-center text-md-start">
                  {{ footer?.value.middle1Title }}
                </div>
                <div class="main-text text-center text-md-start">
                  <span v-html="footer?.value.middle1Text"></span>
                </div>
              </div>
            </div>
            <div
              class="col-12 col-md-6 main-text py-5 px-120px text-title text-center text-md-start"
            >
              {{ footer?.value.middle2Text }}
            </div>
            <div class="col-12 col-md-3 text-center text-md-end py-5 bl-white">
              <div>
                <div class="text-title pb-4">
                  {{ footer?.value.middle3Title }}
                </div>
                <div class="main-text">
                  <div
                    v-for="(logo, index) in footer?.value.middle3Logos"
                    :key="index"
                    class="mb-5"
                  >
                    <a :href="logo.href" target="_blank" class="n-link">
                      <MetaMedia :media="logo.icon" css="media-real"></MetaMedia>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container py-5">
        <div class="row mt-70px">
          <div class="col-12 col-md-9">
            <ul
              class="secondary-menu d-block d-md-flex flex-wrap justify-content-center justify-content-md-start"
            >
              <li
                v-for="(item, index) in footer?.value.menu?.children"
                :key="index"
                class="secondary-menu-item text-center pe-0 pe-md-5"
              >
                <MetaLink
                  :page="item.page"
                  :text="item.page?.name || item.title"
                  :target="item.target"
                  :href="item.href"
                  css-class="menu-item"
                />
              </li>
            </ul>
          </div>
          <div class="col-12 col-md-3">
            <div
              class="social d-flex justify-content-center justify-content-md-end mt-5 mt-md-0"
            >
              <a
                v-for="(social, index) in footer?.value.social"
                :key="index"
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link ms-3 n-link"
              >
                <MetaMedia :media="social.icon" css="media-real"></MetaMedia>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
footer {
  background-color: #000;

  .media-primary {
    width: 145px;
  }
  .media-secondary {
    width: 100px;
  }
  .media-real {
    width: inherit;
  }

  .main-text {
    font-family: "PP Neue Montreal";
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 26.4px */
    letter-spacing: 0.22px;
  }

  .px-120px {
    @media screen and (min-width: 768px) {
      padding-left: 120px !important;
      padding-right: 120px !important;
    }
  }

  .bb-white {
    border-bottom: 1px solid #fff;
  }

  .text-title {
    font-family: "PP Neue Montreal";
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: 130%; /* 28.6px */
    letter-spacing: 0.22px;
  }

  .br-white {
    border-right: 1px solid #fff;
  }
  .bl-white {
    border-left: 1px solid #fff;
  }

  .secondary-menu {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .menu-item {
    color: var(--Blanc, #fff);
    font-family: "PP Neue Montreal";
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 180%; /* 32.4px */
    letter-spacing: 0.18px;
    text-decoration: none;
  }
}
</style>
