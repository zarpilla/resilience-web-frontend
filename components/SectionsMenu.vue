<script setup lang="ts">
const { $gsap, $ScrollTrigger, $Observer } = useNuxtApp();
const props = defineProps<{
  section: any;
}>();

import { computed } from "vue";

/*
This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.

Features:
 - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
 - When each item animates to the left or right enough, it will loop back to the other side
 - Optionally pass in a config object with values like "speed" (default: 1, which travels at roughly 100 pixels per second), paused (boolean),  repeat, reversed, and paddingRight.
 - The returned timeline will have the following methods added to it:
   - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
   - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
   - current() - returns the current index (if an animation is in-progress, it reflects the final index)
   - times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
 */
const horizontalLoop = (items: any, config: any) => {
  items = $gsap.utils.toArray(items);
  if (!items.length) {
    return;
  }
  config = config || {};
  let tl = $gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: (): any =>
        tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times: any[] = [],
    widths: any[] = [],
    xPercents: any[] = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap =
      config.snap === false
        ? (v: any) => v
        : $gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;
  $gsap.set(items, {
    // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
    xPercent: (i, el) => {
      // @ts-ignore
      let w = (widths[i] = parseFloat($gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap(
        // @ts-ignore
        (parseFloat($gsap.getProperty(el, "x", "px")) / w) * 100 +
          // @ts-ignore
          $gsap.getProperty(el, "xPercent")
      );
      return xPercents[i];
    },
  });
  $gsap.set(items, { x: 0 });
  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      // @ts-ignore
      $gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);
  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;

    distanceToLoop =
      // @ts-ignore
      distanceToStart + widths[i] * $gsap.getProperty(item, "scaleX");
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
  // @ts-ignore
  function toIndex(index, vars) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length); // always go in the shortest direction
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      // if we're wrapping the timeline's playhead, make the proper adjustments
      vars.modifiers = { time: $gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }
  tl.next = (vars: any) => toIndex(curIndex + 1, vars);
  tl.previous = (vars: any) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index: number, vars: any) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    // @ts-ignore
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  return tl;
};

const loop = ref<any>(null);

const activeImages = ref<string[]>([]);

const runtimeConfig = useRuntimeConfig();

const mouseEnter = (item: any) => {
  if (item.page && item.page.metadata && item.page.metadata.shareImage) {
    // create an image in the section-menu-tags-cloud-${section.id}-placeholder
    const placeholder = document.getElementById(
      `section-menu-tags-cloud-${props.section.id}-placeholder`
    );
    if (placeholder) {
      const id = `section-menu-tags-cloud-${props.section.id}-image-${item.page.id}`;
      if (!document.getElementById(id)) {
        const img = document.createElement("img");
        img.id = `section-menu-tags-cloud-${props.section.id}-image-${item.page.id}`;
        const url = item.page.metadata.shareImage.formats ? item.page.metadata.shareImage.formats.small.url : item.page.metadata.shareImage.url;
        img.src =
          runtimeConfig.public.apiBase + url;
        img.alt = item.page.metadata.shareImage.altertativeText;
        img.classList.add("active-image");
        placeholder.appendChild(img);

        // random position between -40vh and 40vh, and 0 and 40vw
        img.style.top = `${Math.random() * 60 - 30}vh`;
        img.style.left = `${Math.random() * 40}vw`;
        console.log("top", img.style.top, "left", img.style.left);

        setTimeout(() => {
          img.style.opacity = "1";
          img.style.visibility = "visible";
        }, 100);
      }
    }
  }
};

const mouseLeave = (item: any) => {
  if (item.page && item.page.metadata && item.page.metadata.shareImage) {
    const img = document.getElementById(
      `section-menu-tags-cloud-${props.section.id}-image-${item.page.id}`
    );
    const randomBetween800And1200 = Math.floor(
      Math.random() * (1200 - 800) + 800
    );
    if (img) {      
      setTimeout(() => {
        img.remove();
      }, randomBetween800And1200);
    }
  }
};

onMounted(() => {
  // const script = document.createElement("script");
  // script.src = "https://cdn.jsdelivr.net/npm/scrollreveal";
  // script.async = true;
  // document.body.appendChild(script);

  const boxes = $gsap.utils.toArray(
    `#section-menu-${props.section.id} .marquee li`
  );
  if (boxes.length) {
    setTimeout(() => {
      loop.value = horizontalLoop(boxes, {
        paused: false,
        repeat: -1,
        speed: 1,
      });
    }, 500);
  }
});

onUnmounted(() => {
  if (loop.value) {
    loop.value.kill();
  }
});
</script>
<template>
  <div class="section-menu" :id="`section-menu-${section.id}`">
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
          class="d-flex section-menu-tags-cloud flex-wrap position-relative"
        >
          <div
            v-for="(item, menuIndex) in section.menu.children"
            :key="menuIndex"
            class="item-col zme-5"
            @mouseenter="mouseEnter(item)"
            @mouseleave="mouseLeave(item)"
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
          <div :id="`section-menu-tags-cloud-${section.id}-placeholder`"></div>
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
            <span class="separator">/</span></template
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

  .active-image {
    width: 280px;
    height: auto;
    position: absolute;
    z-index: 20;
    opacity: 0;
    visibility: hidden;
    border-radius: 20px;
    pointer-events: none;
  }
}
</style>
