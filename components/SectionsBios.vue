<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

const runtimeConfig = useRuntimeConfig();

const localePath = useLocalePath();

const { $bs } = useNuxtApp() as any;

const expanded = ref<boolean[]>(props.section.bios.map(() => false));

onMounted(() => {
  try {
    var collapseElementList = [].slice.call(
      document.querySelectorAll(".collapse")
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
  <div class="section-bios">
    <div class="container" v-if="section.preset === 'grid'">
      <div class="row">
        <div class="col-12 col-md-6 offset-md-3 text-center mb-5">
          <h1
            v-if="section.title && section.titleHeading === 'h1'"
            v-html="section.title"
          ></h1>
          <h2
            v-if="section.title && section.titleHeading === 'h2'"
            v-html="section.title"
          ></h2>
          <h3
            v-if="section.title && section.titleHeading === 'h3'"
            v-html="section.title"
          ></h3>
          <h4
            v-if="section.title && section.titleHeading === 'h4'"
            v-html="section.title"
          ></h4>
          <h5
            v-if="section.title && section.titleHeading === 'h5'"
            v-html="section.title"
          ></h5>
          <p
            v-if="section.title && section.titleHeading === 'p'"
            v-html="section.title"
          ></p>
        </div>
      </div>
      <div class="row mt-5">
        <div
          v-for="(bio, index) in section.bios"
          :key="index"
          class="col-12 col-md-4 mb-5"
        >
          <div class="bio-card mb-5">
            <nuxt-link
              :to="localePath({ name: 'bio-slug', params: { slug: bio.slug } })"
              class="bio-link hoverable"
            >
              <div
                class="bio-image mb-3"
                v-if="bio.mainImage && bio.mainImage.url"
                :style="`background: url(${
                  runtimeConfig.public.apiBase + bio.mainImage.url
                }) lightgray 50% / cover no-repeat;background: url(${
                  runtimeConfig.public.apiBase + bio.mainImage.url
                }) lightgray 50% / cover no-repeat;`"
              ></div>
            </nuxt-link>
            <div class="name">
              <nuxt-link
                :to="
                  localePath({ name: 'bio-slug', params: { slug: bio.slug } })
                "
                class="bio-link hoverable"
                >{{ bio.name }}</nuxt-link
              >
            </div>
            <div class="position">
              <nuxt-link
                :to="
                  localePath({ name: 'bio-slug', params: { slug: bio.slug } })
                "
                class="bio-link hoverable"
              >
                {{ bio.position }}
              </nuxt-link>
            </div>
            <nuxt-link
              :to="localePath({ name: 'bio-slug', params: { slug: bio.slug } })"
              class="bio-link bio-link-arrow hoverable"
            >
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M-3.0598e-07 9.93359L12.175 9.93359L6.575 15.5336L8 16.9336L16 8.93359L8 0.933593L6.575 2.33359L12.175 7.93359L-3.93403e-07 7.93359L-3.0598e-07 9.93359Z"
                  fill="black"
                />
                <path
                  d="M-3.0598e-07 9.93359L12.175 9.93359L6.575 15.5336L8 16.9336L16 8.93359L8 0.933593L6.575 2.33359L12.175 7.93359L-3.93403e-07 7.93359L-3.0598e-07 9.93359Z"
                  fill="black"
                  fill-opacity="0.2"
                />
                <path
                  d="M-3.0598e-07 9.93359L12.175 9.93359L6.575 15.5336L8 16.9336L16 8.93359L8 0.933593L6.575 2.33359L12.175 7.93359L-3.93403e-07 7.93359L-3.0598e-07 9.93359Z"
                  fill="black"
                  fill-opacity="0.2"
                />
                <path
                  d="M-3.0598e-07 9.93359L12.175 9.93359L6.575 15.5336L8 16.9336L16 8.93359L8 0.933593L6.575 2.33359L12.175 7.93359L-3.93403e-07 7.93359L-3.0598e-07 9.93359Z"
                  fill="black"
                  fill-opacity="0.2"
                />
                <path
                  d="M-3.0598e-07 9.93359L12.175 9.93359L6.575 15.5336L8 16.9336L16 8.93359L8 0.933593L6.575 2.33359L12.175 7.93359L-3.93403e-07 7.93359L-3.0598e-07 9.93359Z"
                  fill="black"
                  fill-opacity="0.2"
                />
                <path
                  d="M-3.0598e-07 9.93359L12.175 9.93359L6.575 15.5336L8 16.9336L16 8.93359L8 0.933593L6.575 2.33359L12.175 7.93359L-3.93403e-07 7.93359L-3.0598e-07 9.93359Z"
                  fill="black"
                  fill-opacity="0.2"
                />
                <path
                  d="M-3.0598e-07 9.93359L12.175 9.93359L6.575 15.5336L8 16.9336L16 8.93359L8 0.933593L6.575 2.33359L12.175 7.93359L-3.93403e-07 7.93359L-3.0598e-07 9.93359Z"
                  fill="black"
                  fill-opacity="0.2"
                />
              </svg>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-if="section.preset === 'list'">
      <div class="row">
        <div class="col-12 col-md-6">
          <h1
            v-if="section.title && section.titleHeading === 'h1'"
            v-html="section.title"
          ></h1>
          <h2
            v-if="section.title && section.titleHeading === 'h2'"
            v-html="section.title"
          ></h2>
          <h3
            v-if="section.title && section.titleHeading === 'h3'"
            v-html="section.title"
          ></h3>
          <h4
            v-if="section.title && section.titleHeading === 'h4'"
            v-html="section.title"
          ></h4>
          <h5
            v-if="section.title && section.titleHeading === 'h5'"
            v-html="section.title"
          ></h5>
          <p
            v-if="section.title && section.titleHeading === 'p'"
            v-html="section.title"
          ></p>
          <h2
            class="mt-5"
            v-if="section.subtitle && section.titleHeading === 'h1'"
            v-html="section.subtitle"
          ></h2>
          <h3
            class="mt-5"
            v-if="section.subtitle && section.titleHeading === 'h2'"
            v-html="section.subtitle"
          ></h3>
          <h4
            class="mt-5"
            v-if="section.subtitle && section.titleHeading === 'h3'"
            v-html="section.subtitle"
          ></h4>
          <h5
            class="mt-5"
            v-if="section.subtitle && section.titleHeading === 'h4'"
            v-html="section.subtitle"
          ></h5>
          <p
            class="mt-5"
            v-if="section.subtitle && section.titleHeading === 'p'"
            v-html="section.subtitle"
          ></p>
        </div>
        <div class="col-12 col-md-6">
          <div class="bio-list">
            <div
              v-for="(bio, index) in section.bios"
              :key="index"
              class="bio-item"
            >
              <a
                class="toogle-bio d-flex hoverable"
                :class="{
                  'bt-0': index === 0,
                }"
                data-bs-toggle="collapse"
                :href="`#collapse-section${section.id}-bio-${index}`"
                role="button"
                aria-expanded="false"
                aria-controls="collapseExample"
              >
                <span class="me-auto">
                  {{ bio.name }}
                </span>
                <svg
                  :class="{ 'rotate-180': expanded[index] }"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 0V12.175L1.4 6.575L0 8L8 16L16 8L14.6 6.575L9 12.175V0H7Z"
                    fill="black"
                  />
                  <path
                    d="M7 0V12.175L1.4 6.575L0 8L8 16L16 8L14.6 6.575L9 12.175V0H7Z"
                    fill="black"
                    fill-opacity="0.2"
                  />
                  <path
                    d="M7 0V12.175L1.4 6.575L0 8L8 16L16 8L14.6 6.575L9 12.175V0H7Z"
                    fill="black"
                    fill-opacity="0.2"
                  />
                  <path
                    d="M7 0V12.175L1.4 6.575L0 8L8 16L16 8L14.6 6.575L9 12.175V0H7Z"
                    fill="black"
                    fill-opacity="0.2"
                  />
                  <path
                    d="M7 0V12.175L1.4 6.575L0 8L8 16L16 8L14.6 6.575L9 12.175V0H7Z"
                    fill="black"
                    fill-opacity="0.2"
                  />
                  <path
                    d="M7 0V12.175L1.4 6.575L0 8L8 16L16 8L14.6 6.575L9 12.175V0H7Z"
                    fill="black"
                    fill-opacity="0.2"
                  />
                  <path
                    d="M7 0V12.175L1.4 6.575L0 8L8 16L16 8L14.6 6.575L9 12.175V0H7Z"
                    fill="black"
                    fill-opacity="0.2"
                  />
                </svg>
              </a>

              <div
                class="collapse"
                :id="`collapse-section${section.id}-bio-${index}`"
              >
                <div class="bio-body">
                  <div>
                    {{ bio.position }}
                  </div>
                  <div class="mt-3">
                    <nuxt-link
                      :to="
                        localePath({
                          name: 'bio-slug',
                          params: { slug: bio.slug },
                        })
                      "
                      class="bio-link hoverable"
                    >
                      <MetaMedia
                        :media="bio.mainImage"
                        :css-class="'bio-image'"
                      ></MetaMedia>
                    </nuxt-link>
                    <div class="mt-3">
                      <nuxt-link
                        :to="
                          localePath({
                            name: 'bio-slug',
                            params: { slug: bio.slug },
                          })
                        "
                        class="bio-link hoverable"
                      >
                        {{ section.c2aText }}
                      </nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scroped lang="scss">
.section-bios {
  .bio-image {
    width: 100%;
    height: 375px;
  }
  .name a {
    color: var(--Negre, #000);
    font-family: "PP Neue Montreal";
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    line-height: 23px; /* 104.545% */
    letter-spacing: 0.22px;
    text-decoration: none !important;
  }
  .position a {
    color: var(--Negre, #000);
    font-family: "PP Neue Montreal";
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 23px;
    letter-spacing: 0.2px;
    text-decoration: none;
  }

  .toogle-bio {
    color: var(--Negre, #000);
    font-family: "PP Neue Montreal";
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    line-height: 23px; /* 104.545% */
    letter-spacing: 0.22px;
    text-decoration: none;
    border-top: 1px solid #000;
    padding: 1.5rem 0;
    display: block;

    &.bt-0 {
      border-top: 0;
    }
    &.bb-1 {
      border-bottom: 1px solid #000;
    }

    svg {
      margin-top: 2px;
    }
  }
  .bio-body {
    padding-bottom: 2rem;
  }
  .bio-link {
    color: #000;
    font-family: "PP Neue Montreal";
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 27px */
    letter-spacing: 0.36px;
  }
  .rotate-180 {
    transform: rotate(180deg);
  }
  .bio-card {
    .bio-link-arrow {
      margin-left: 0;
      transition: all 0.1s ease-in-out;
    }

    &:hover {
      .name a {
        background: #000;
        color: #fff !important;
      }
      .bio-link-arrow {
        margin-left: 10px;
      }
    }
  }
}
</style>
