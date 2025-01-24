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

const expanded = ref<boolean[]>(props.section.capabilities.map(() => false));

onMounted(() => {
  try {
    var collapseElementList = [].slice.call(
      document.querySelectorAll(".collapse")
    );
    var collapseList = collapseElementList.map((el: any, i) => {
      const collapsible = new $bs.Collapse(el, { toggle: false });      
      el.addEventListener('show.bs.collapse', function () {
        expanded.value[i] = true;
      })
      el.addEventListener('hide.bs.collapse', function () {
        expanded.value[i] = false;
      })
      return collapsible;
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
          <div v-if="section.description" class="capabilities-description">
            <MetaText :text="section.description" styles="" />
          </div>
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
                    id="mask0_664_613"
                    style="mask-type: alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_664_613)">
                    <path
                      d="M13 19V5H19V19H13ZM5 19V5H11V19H5ZM15 17H17V7H15V17ZM7 17H9V7H7V17Z"
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
                    id="mask0_664_602"
                    style="mask-type: alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_664_602)">
                    <path
                      d="M14 20.725V18.675C15.5 18.2417 16.7083 17.4083 17.625 16.175C18.5417 14.9417 19 13.5417 19 11.975C19 10.4083 18.5417 9.00834 17.625 7.77501C16.7083 6.54167 15.5 5.70834 14 5.27501V3.22501C16.0667 3.69167 17.75 4.73751 19.05 6.36251C20.35 7.98751 21 9.85834 21 11.975C21 14.0917 20.35 15.9625 19.05 17.5875C17.75 19.2125 16.0667 20.2583 14 20.725ZM3 15V9.00001H7L12 4.00001V20L7 15H3ZM14 16V7.95001C14.7833 8.31667 15.3958 8.86667 15.8375 9.60001C16.2792 10.3333 16.5 11.1333 16.5 12C16.5 12.85 16.2792 13.6375 15.8375 14.3625C15.3958 15.0875 14.7833 15.6333 14 16ZM10 8.85001L7.85 11H5V13H7.85L10 15.15V8.85001Z"
                      fill="#1C1B1F"
                    />
                  </g>
                </svg>

                <svg
                  width="16"
                  :class="{ 'rotate-180': expanded[index]  }"
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
                <div v-if="item.page" class="mb-4 text-end">
                  <MetaLink
                    :page="item.page"                    
                    css-class="hoverable">
                  
                    <svg
                    class="arrow"
                    width="52"
                    height="52"
                    viewBox="0 0 52 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M47.6586 27.0544H0.316895V24.9461H47.6586L24.5627 1.85023L26.0002 0.316895L51.6836 26.0002L26.0002 51.6836L24.5627 50.1502L47.6586 27.0544Z"
                      fill="#1C1B1F"
                    />
                  </svg>

                  </MetaLink>
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
  .rotate-180 {
    transform: rotate(180deg);
  }
}
</style>
