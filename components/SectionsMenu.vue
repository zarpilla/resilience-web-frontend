<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

import { computed } from "vue";
</script>
<template>
  <div class="section-menu">
    <div
      class="container"
      v-if="
        section.menu &&
        section.menu.children &&
        section.menu.children.length &&
        (!section.preset ||
          section.preset === 'default' ||
          section.preset === 'tags-cloud')
      "
    >
      <div class="row">
        <div
          v-if="
            section.menu &&
            section.menu.children &&
            section.menu.children.length &&
            (!section.preset || section.preset === 'default')
          "
          class="d-flex section-menu-default flex-wrap"
        >
          <div
            v-for="(menu, menuIndex) in section.menu.children"
            :key="menuIndex"
            class="item-col me-5 mb-3"
          >
            <MetaLink
              :page="menu.page"
              :text="menu.title"
              :target="menu.target"
              :href="menu.href"
              css-class="item"
            />
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 0.5V12.675L1.4 7.075L0 8.5L8 16.5L16 8.5L14.6 7.075L9 12.675V0.5H7Z"
                fill="black"
              />
              <path
                d="M7 0.5V12.675L1.4 7.075L0 8.5L8 16.5L16 8.5L14.6 7.075L9 12.675V0.5H7Z"
                fill="black"
                fill-opacity="0.2"
              />
              <path
                d="M7 0.5V12.675L1.4 7.075L0 8.5L8 16.5L16 8.5L14.6 7.075L9 12.675V0.5H7Z"
                fill="black"
                fill-opacity="0.2"
              />
              <path
                d="M7 0.5V12.675L1.4 7.075L0 8.5L8 16.5L16 8.5L14.6 7.075L9 12.675V0.5H7Z"
                fill="black"
                fill-opacity="0.2"
              />
              <path
                d="M7 0.5V12.675L1.4 7.075L0 8.5L8 16.5L16 8.5L14.6 7.075L9 12.675V0.5H7Z"
                fill="black"
                fill-opacity="0.2"
              />
              <path
                d="M7 0.5V12.675L1.4 7.075L0 8.5L8 16.5L16 8.5L14.6 7.075L9 12.675V0.5H7Z"
                fill="black"
                fill-opacity="0.2"
              />
              <path
                d="M7 0.5V12.675L1.4 7.075L0 8.5L8 16.5L16 8.5L14.6 7.075L9 12.675V0.5H7Z"
                fill="black"
                fill-opacity="0.2"
              />
            </svg>
          </div>
        </div>
        <div
          v-else-if="
            section.menu &&
            section.menu.children &&
            section.menu.children.length &&
            section.preset === 'tags-cloud'
          "
          class="d-flex section-menu-tags-cloud flex-wrap"
        >
          <div
            v-for="(item, menuIndex) in section.menu.children"
            :key="menuIndex"
            class="item-col zme-5"
          >
            <MetaLink
              :page="item.page"
              :text="item.page?.name || item.title"
              :target="item.target"
              :href="item.href"
              css-class="item"
            />
            <span
              class="separator"
              v-if="menuIndex !== section.menu.children.length - 1"
              >/</span
            >
          </div>
        </div>
      </div>
    </div>
    <div
      class="marquee"
      v-else-if="
        section.menu &&
        section.menu.children &&
        section.menu.children.length &&
        section.preset === 'marquee'
      "
    >
      <ul class="marquee__inner">
        <li
          v-for="(item, menuIndex) in section.menu.children"
          :key="menuIndex"
          class="marquee__item"
          :class="{ marquee__item__image: item.image !== null }"
        >
          <div class="marquee-logo" v-if="item.image">
            <MetaLink
              v-if="item.href"
              target="_blank"
              :href="item.href"
              css-class="z"
            >
              <MetaMedia
                :media="item.image"
                :alt="item.image.alt"
                css-class="marquee-logo-img"
              />
            </MetaLink>
            <MetaMedia
              v-else
              :media="item.image"
              :alt="item.image.alt"
              css-class="marquee-logo-img"
            />
          </div>
          <template v-else>
            <MetaLink
              :page="item.page"
              :text="item.page?.name || item.title"
              :target="item.target"
              :href="item.href"
              css-class="item"
            />
            <span
              class="separator"              
              >/</span
            ></template
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss">
.section-menu {
  background-size: cover;

  .section-menu-default {
    .item-col {
      svg {
        vertical-align: 0px;
      }
    }

    .item {
      color: var(--negre, #000);
      font-family: "PP Neue Montreal";
      font-size: 22px;
      font-style: normal;
      font-weight: 500;
      line-height: 23px; /* 104.545% */
      letter-spacing: 0.22px;
      text-decoration: none;
      padding-right: 0.5rem;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .section-menu-tags-cloud {
    .separator {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
    .item,
    .separator {
      display: inline-block;

      color: var(--negre, #000);
      font-family: "PP Neue Montreal";
      font-size: 30px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%;
      letter-spacing: 0.3px;
      text-decoration: none;
    }

    .item {
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .marquee {
    width: 100%;
    overflow: hidden;

    .marquee__inner {
      display: flex;
      list-style: none;
      // animation: scrolling 30s linear infinite;
      margin: 0 !important;
      // @media screen and (max-width: 768px) {
      //   animation: scrolling 5s linear infinite;        
      // }

      .marquee__item__image {
        margin-right: 50px;
      }
    }

    @keyframes scrolling {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-100%);
      }
    }

    li {
      .separator {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      }

      .item,
      .separator {
        color: var(--negre, #000);
        font-variant-numeric: lining-nums tabular-nums;
        font-family: "PP Neue Montreal";
        font-size: 30px;
        font-style: normal;
        font-weight: 400;
        line-height: 60px; /* 200% */
        letter-spacing: 0.3px;
        text-decoration: none;

        padding-left: 0.25rem;
        padding-right: 0.25rem;
      }

      flex-shrink: 0;

      .item {
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
