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
  console.log("emitClose");
  emits("close");
};

const contact = computed(() => {
  return header.value.value?.contact?.replace(/\n/g, "<br>");
});

const { $bs } = useNuxtApp() as any;

const expanded = ref<boolean[]>(
  header?.value.value.mainMenu?.children.map(() => false)
);

onMounted(() => {
  try {
    var collapseElementList = [].slice.call(
      document.querySelectorAll(".toogle-menu .collapse")
    );

    var collapseList = collapseElementList.map((el: any, i) => {
      const collapsible = new $bs.Collapse(el, { toggle: false });
      el.addEventListener("show.bs.collapse", function () {
        expanded.value[i] = true;
      });
      el.addEventListener("hide.bs.collapse", function () {
        expanded.value[i] = false;
      });
      return collapsible;
    });
  } catch (e) {
    console.log("Bootstrap error: ", e);
  }
});
</script>
<template>
  <div class="full-page-menu">
    <div class="container container-menu">
      <div class="row">
        <div class="col-12">
          <ul class="languages d-flex">
            <li
              v-for="(loc, i) in availableLocales"
              :key="loc"
              class="language n-link"
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
                  <a
                    class="toogle-menu hoverable"
                    data-bs-toggle="collapse"
                    :href="`#collapse-menu-${item.id}`"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                    v-if="
                      item.submenu &&
                      item.submenu.children &&
                      item.submenu.children.length
                    "
                    :on-click="emitClose"
                  >
                    <span class="item">
                      {{ item.page?.name || item.title }}</span
                    >

                    <svg
                      class="arrow"
                      width="74"
                      height="74"
                      viewBox="0 0 74 74"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_1236_18974"
                        style="mask-type: alpha"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="75"
                        height="74"
                      >
                        <rect
                          x="0.339844"
                          y="73.6724"
                          width="73.6672"
                          height="73.6699"
                          transform="rotate(-90 0.339844 73.6724)"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_1236_18974)">
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                      </g>
                    </svg>
                  </a>

                  <MetaLink
                    v-else
                    :page="item.page"
                    :target="item.target"
                    :href="item.href"
                    css-class="item"
                    :on-click="emitClose"
                  >
                    <span>{{ item.page?.name || item.title }}</span>

                    <svg
                      class="arrow-right"
                      width="74"
                      height="74"
                      viewBox="0 0 74 74"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_1236_18974"
                        style="mask-type: alpha"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="75"
                        height="74"
                      >
                        <rect
                          x="0.339844"
                          y="73.6724"
                          width="73.6672"
                          height="73.6699"
                          transform="rotate(-90 0.339844 73.6724)"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_1236_18974)">
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                        <path
                          d="M38.0197 19.4959L38.0197 57.4038L36.3314 57.4038L36.3314 19.4959L17.8372 37.9894L16.6094 36.8384L37.1756 16.273L57.7418 36.8384L56.5139 37.9894L38.0197 19.4959Z"
                          fill="black"
                          fill-opacity="0.2"
                        />
                      </g>
                    </svg>
                  </MetaLink>
                </h2>

                <div
                  class="collapse"
                  :id="`collapse-menu-${item.id}`"
                  v-if="
                    item.submenu &&
                    item.submenu.children &&
                    item.submenu.children.length
                  "
                >
                  <ul class="second-level d-flex flex-wrap d-flex d-md-flex">
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
                  <!-- <ul
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
                </ul> -->
                </div>
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
          <div
            class="social d-flex justify-content-start justify-content-md-end mt-5 mt-md-0"
          >
            <a
              v-for="(social, index) in header?.value.social"
              :key="index"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link n-link"
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

  .close {
    position: fixed;
    top: 30px;
    right: 30px;
    cursor: none !important;

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
          padding: 16px 0;
        }

        h2 {
          margin-bottom: 0 !important;
          padding: 0px 0 !important;

          .arrow {
            opacity: 0;
            transition: all 0.3s;
            margin-left: 1rem !important;
            margin-bottom: 1rem;

            @media screen and (max-width: 768px) {
              display: none;
            }
          }

          .arrow-right {
            opacity: 0;
            transition: all 0.3s;
            transform: rotate(90deg);
            margin-left: 1rem !important;
            @media screen and (max-width: 768px) {
              display: none;
            }
          }

          .collapsed {
            .arrow {
              transform: rotate(180deg);
            }
          }

          &:hover {
            .arrow {
              opacity: 1;
              margin-left: 2rem !important;
            }
            .arrow-right {
              opacity: 1;
              transform: rotate(90deg);
              margin-left: 2rem !important;
            }
          }
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
      @media screen and (max-width: 768px) {
        width: 100%;
      }
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
