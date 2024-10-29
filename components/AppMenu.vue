<script setup lang="ts">
import { useHeaderStore } from "~/stores/header";
const { locale, setLocale, availableLocales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();

const headerStore = useHeaderStore();
const header = computed<any>(() =>
  headerStore.headers.find((h) => h.locale === locale.value)
);

const setLocaleLanguage = async (lang: string) => {
  setLocale(lang);
};

const runtimeConfig = useRuntimeConfig();

const emits = defineEmits(["close"]);

const emitClose = () => {
  emits("close");
};

const contact = computed(() => {
  return header.value.value?.contact?.replace(/\n/g, "<br>");
});
</script>
<template>
  <div class="full-page-menu ztext-dark">
    <div class="close text-dark" @click="emitClose">
      <svg
        width="87"
        height="87"
        viewBox="0 0 87 87"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="65.0671"
          y1="64.8541"
          x2="21.7601"
          y2="21.5471"
          stroke="black"
          stroke-width="2"
        />
        <path
          d="M64.6465 21.3394L21.3395 64.6464"
          stroke="black"
          stroke-width="2"
        />
      </svg>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-12">
          <ul class="languages d-flex">
            <li
              v-for="(loc, i) in availableLocales"
              :key="loc"
              class="language"
              :class="{ current: loc === locale }"
            >
              <nuxt-link :to="switchLocalePath(loc)" @click="emitClose">
                {{ $t(loc) }}
              </nuxt-link>
              <span class="separator" v-if="i < availableLocales.length - 1">
                |
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="menu mt-5">
            <ul class="first-level">
              <li
                class="first-level"
                v-for="(item, index) in header?.value.mainMenu?.children"
                :key="index"
              >
                <h2>
                  <MetaLink
                    :page="item.page"
                    :text="item.page?.name || item.title"
                    :target="item.target"
                    :href="item.href"
                    css-class="item"
                    :on-click="emitClose"
                  />
                </h2>

                <ul
                  class="second-level d-flex flex-wrap d-none d-md-flex"
                  v-if="
                    item.submenu &&
                    item.submenu.children &&
                    item.submenu.children.length
                  "
                >
                  <li
                    v-for="(subitem, index) in item.submenu.children"
                    :key="index"
                    class="second-level"
                  >
                    <h3>
                      <MetaLink
                        :page="subitem.page"
                        :text="subitem.page?.name || subitem.title"
                        :target="subitem.target"
                        :href="subitem.href"
                        css-class="item"
                        :on-click="emitClose"
                      />
                    </h3>
                    <span
                      class="separator"
                      v-if="index < item.submenu.children.length - 1"
                      >/
                    </span>
                  </li>
                </ul>
                <ul
                  v-else-if="item.children"
                  class="second-level"
                  v-if="item.children.length"
                >
                  <li
                    v-for="(child, index) in item.children"
                    :key="index"
                    class="second-level"
                  >
                    <h3>
                      <MetaLink
                        :page="child.page"
                        :text="child.page.name || child.title"
                        :target="child.target"
                        :href="child.href"
                        css-class="item"
                        :on-click="emitClose"
                      />
                    </h3>
                    <span
                      class="separator"
                      v-if="index < item.submenu.children.length - 1"
                      >/
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row" v-if="contact">
        <div class="col-12">
          <div class="contact" v-html="contact"></div>
        </div>
      </div>

      <div class="row mt-70px">
        <div class="col-12 col-md-9">
          <ul class="secondary-menu d-flex flex-wrap">
            <li
              v-for="(item, index) in header?.value.secondaryMenu?.children"
              :key="index"
              class="secondary-menu-item"
            >
              <MetaLink
                :page="item.page"
                :text="item.page?.name || item.title"
                :target="item.target"
                :href="item.href"
                css-class="item"
                :on-click="emitClose"
              />
            </li>
          </ul>
        </div>
        <div class="col-12 col-md-3">
          <div class="social d-flex justify-content-start justify-content-md-end mt-5 mt-md-0">
            <a
              v-for="(social, index) in header?.value.social"
              :key="index"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
            >
              <img
                :src="runtimeConfig.public.apiBase + social.icon.url"
                :alt="social.name"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.full-page-menu {
  background: #f2eeea;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  padding: 54px 0;
  overflow-y: auto;
  overflow-x: hidden;
  // display: flex;
  // justify-content: center;
  // align-items: center;

  .close {
    position: fixed;
    top: 30px;
    right: 30px;
    cursor: none;

    @media screen and (max-width: 768px) {
      position: absolute;
      top: 10px;      
      right: 10px;
    }
  }

  .languages {
    margin: 0;
    padding: 0;
    list-style: none;

    li,
    li a,
    .separator {
      color: var(--Negre, #000);
      font-family: "PP Neue Montreal";
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: 30px;
      letter-spacing: 0.4px;
      text-decoration: none;
      text-transform: uppercase;
    }

    li.current a {
      font-weight: 700 !important;
    }
    .separator {
      text-align: center;
      width: 12px;
      display: inline-block;
    }
  }

  .menu {
    ul {
      list-style: none;
    }
    ul.first-level {
      margin: 0;
      padding: 0;
      list-style: none;

      li.first-level {
        border-bottom: 1px solid #000;
        padding: 15px 0;
        @media screen and (max-width: 768px) {
          padding: 10px 0;
        }

        h2 {
          margin-bottom: 0 !important;
          padding: 0px 0 !important;
        }
      }
    }

    h2 a {
      color: var(--negre, #000);
      font-family: "PP Neue Montreal";
      font-size: 60px;
      font-style: normal;
      font-weight: 400;
      line-height: 23px; /* 38.333% */
      letter-spacing: 0.6px;
      text-decoration: none;
      margin-bottom: 0 !important;
      @media screen and (max-width: 768px) {
        font-size: 40px;
      }
    }

    ul.second-level {
      margin: 0;
      margin-top: 15px;
      padding: 0;
      width: 80%;
    }

    h3 {
      display: inline-block;
    }
    h3 a,
    .separator {
      color: var(--negre, #000);
      font-family: "PP Neue Montreal";
      font-size: 30px;
      font-style: normal;
      font-weight: 400;
      line-height: 23px; /* 76.667% */
      letter-spacing: 0.3px;
      text-decoration: none;
      margin-bottom: 0 !important;
      display: inline-block;
      @media screen and (max-width: 768px) {
        font-size: 20px;
      }
    }
    h3 a:hover {
      text-decoration: underline;
    }
    .separator {
      text-align: center;
      width: 32px;
      display: inline-block;
    }
  }

  .contact {
    color: var(--Negre, #000);
    font-family: "PP Neue Montreal";
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    line-height: 130%; /* 28.6px */
    letter-spacing: 0.44px;
    margin-top: 130px;
  }

  .mt-70px {
    margin-top: 70px;
  }

  .secondary-menu {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      margin-right: 30px;

      a {
        color: var(--negre, #000);
        font-family: "PP Neue Montreal";
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 180%; /* 32.4px */
        letter-spacing: 0.18px;
        text-decoration: none;
      }
    }
  }

  .social-link {
    margin-right: 20px;
  }
  .text-right {
    text-align: right;
  }
}
</style>
<style lang="scss">
.node-webkit .full-page-menu .close {
  right: 50px;
  @media screen and (max-width: 768px) {
    right: 0px;    
  }
}
</style>