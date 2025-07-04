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
                <nuxt-link :to="localePath('/')" class="n-link">
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
              class="col-12 col-md-6 main-text py-5 px-120px text-title text-center text-md-start bt-mob bb-mob"
            >
              <span v-html="footer?.value.middle2Text"></span>
              <div class="mt-5">
                <AppSubscription
                  :email-text="footer?.value.subscriptionForm.email"
                  :button-text="footer?.value.subscriptionForm.button"
                  :accept-text="footer?.value.subscriptionForm.accept"
                  :message-ok="footer?.value.subscriptionForm.messageOk"
                  :message-ko="footer?.value.subscriptionForm.messageKo"
                ></AppSubscription>
              </div>
            </div>
            <div
              class="col-12 col-md-3 text-center text-md-start py-5 ps-5 pe-0 bl-white"
            >
              <div class="mb-3">
                <div class="text-title pb-3">
                  {{ footer?.value.middle3Title }}
                </div>
                <div
                  class="main-text d-flex flex-wrap media-logos-footer-wrapper mb-3 pb-3 bb-white"
                >
                  <div
                    v-for="(logo, index) in footer?.value.middle3Logos"
                    :key="index"
                    class="w-50 mb-1 pe-3 pb-40 media-logos-footer"
                  >
                    <a :href="logo.href" target="_blank" class="n-link">
                      <MetaMedia
                        :media="logo.icon"
                        css="media-real hoverable"
                      ></MetaMedia>
                    </a>
                  </div>
                </div>
              </div>
              <div class="mt-5 zpb-3 d-flex">
                <div class="text-title pt-3 zme-3">
                  {{ footer?.value.middle3BTitle }}
                </div>
                
                  <div
                    v-for="(logo, index) in footer?.value.middle3BLogos"
                    :key="index"
                    class="zw-50 zmb-5 zpe-3 media-logos-footer ms-5"
                  >
                    <a :href="logo.href" target="_blank" class="n-link">
                      <MetaMedia
                        :media="logo.icon"
                        css="media-real hoverable"
                      ></MetaMedia>
                    </a>
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
  border-top: 1px solid #fff;

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
    @media screen and (max-width: 768px) {
      border-right: 0;
    }
  }
  .bl-white {
    border-left: 1px solid #fff;
    @media screen and (max-width: 768px) {
      border-left: 0;
    }
  }

  .bt-white {
    border-top: 1px solid #fff;    
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
  .bt-mob {
    border-top: 1px solid #fff;
    @media screen and (min-width: 768px) {
      border-top: 0;
    }
  }
  .bb-mob {
    border-bottom: 1px solid #fff;
    @media screen and (min-width: 768px) {
      border-bottom: 0;
    }
  }

  .media-logos-footer-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  .media-logos-footer a img {
    display: table-cell;
    vertical-align: middle;
  }
  .social-link{
    width: 20px;
    img {
      width: 20px;
    }
  }
}
</style>
<style lang="scss">
footer {
  .media-primary {
    width: 145px;
    max-width: 145px;
  }
  .media-secondary {
    width: 125px;
    max-width: 125px;
  }
  .social-link{
    img {
      width: 20px;
    }
  }
}
.media-logos-footer-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.media-logos-footer a img {
  display: table-cell;
  vertical-align: middle;
  height: 62px;
}
.media-logos-footer a {
  display: table-cell;
  vertical-align: middle;
  height: 62px;
}
.media-logos-footer {
  display: table-cell;
  vertical-align: middle;
}
</style>
