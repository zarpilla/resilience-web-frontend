<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();

const runtimeConfig = useRuntimeConfig();

const localePath = useLocalePath();

const { $bs } = useNuxtApp() as any;

const playing = ref(-1);
const audio = ref<any>(null);

const play = (id: number, url: string) => {
  if (playing.value === id) {
    audio.value?.pause();
    playing.value = -1;
  } else {
    if (audio.value) {
      audio.value.pause();
    }
    playing.value = id;
    audio.value = new Audio(url);
    audio.value.play();
  }
};

onMounted(() => {
  try {
    var collapseElementList = [].slice.call(
      document.querySelectorAll(".collapse")
    );
    var collapseList = collapseElementList.map(function (collapseEl) {
      return new $bs.Collapse(collapseEl, { toggle: false });
    });
  } catch (e) {
    console.log("Bootstrap error: ", e);
  }
});
</script>
<template>
  <div class="section-capabilities">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-6">
          <h2 v-if="section.title" v-html="section.title"></h2>
          <h3
            class="mt-5"
            v-if="section.subtitle"
            v-html="section.subtitle"
          ></h3>
        </div>
        <div class="col-12 col-md-6">
          <div class="bio-list">
            <div
              v-for="(item, index) in section.capabilities"
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
                  {{ item.name }}
                </span>

                <svg
                  v-if="item.audio && playing === index"
                  @click="
                    play(index, runtimeConfig.public.apiBase + item.audio.url)
                  "
                  class="svg-audio hoverable"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_208_1789"
                    style="mask-type: alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_208_1789)">
                    <path
                      d="M14 20.725V18.675C15.5 18.2417 16.7083 17.4083 17.625 16.175C18.5417 14.9417 19 13.5417 19 11.975C19 10.4083 18.5417 9.00834 17.625 7.77501C16.7083 6.54167 15.5 5.70834 14 5.27501V3.22501C16.0667 3.69167 17.75 4.73751 19.05 6.36251C20.35 7.98751 21 9.85834 21 11.975C21 14.0917 20.35 15.9625 19.05 17.5875C17.75 19.2125 16.0667 20.2583 14 20.725ZM3 15V9.00001H7L12 4.00001V20L7 15H3ZM14 16V7.95001C14.7833 8.31667 15.3958 8.86667 15.8375 9.60001C16.2792 10.3333 16.5 11.1333 16.5 12C16.5 12.85 16.2792 13.6375 15.8375 14.3625C15.3958 15.0875 14.7833 15.6333 14 16ZM10 8.85001L7.85 11H5V13H7.85L10 15.15V8.85001Z"
                      fill="#1C1B1F"
                    />
                  </g>
                </svg>
                <svg
                  v-if="item.audio && playing !== index"
                  class="svg-audio hoverable"
                  @click="
                    play(index, runtimeConfig.public.apiBase + item.audio.url)
                  "
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_570_515"
                    style="mask-type: alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_570_515)">
                    <path
                      d="M5 15V9H9L14 4V20L9 15H5ZM16 16V7.95C16.75 8.3 17.3542 8.84167 17.8125 9.575C18.2708 10.3083 18.5 11.1167 18.5 12C18.5 12.8833 18.2708 13.6833 17.8125 14.4C17.3542 15.1167 16.75 15.65 16 16ZM12 8.85L9.85 11H7V13H9.85L12 15.15V8.85Z"
                      fill="#1C1B1F"
                    />
                  </g>
                </svg>

                <svg
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
                    {{ item.description }}
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
.section-capabilities {
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

    .svg-audio {
      margin-top: -1px;
      margin-right: 10px;
    }
  }
  .bio-body {
    padding-bottom: 2rem;
  }
  .bio-link {
    color: var(--Turquesa, #409c8c);
    font-family: "PP Neue Montreal";
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 27px */
    letter-spacing: 0.36px;
  }
}
</style>
