import gsap from "gsap";

import ScrollTrigger from "gsap/ScrollTrigger";

export default class HorizontalScroller {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  start = () => {
    const scrollerInner = document.querySelector(".scroller-container");
    if (!scrollerInner) {
      console.log("no scrollerInner", scrollerInner);
      return;
    }
    console.log("scrollerInner", scrollerInner.offsetWidth);

    
// ScrollTrigger.defaults({
//   scroller: document.querySelector("#__nuxt"),
// });

// ScrollTrigger.config({
//   limitCallbacks: true,
//   ignoreMobileResize: true
// });

    let sections = gsap.utils.toArray(".scroller-item");

    // add a random bg color to each section
    sections.forEach((section, i) => {
      section.style.background = `hsl(${i * (360 / sections.length)}, 70%, 80%)`;
    });
    

    // Calculate the total width of the horizontal scroll content
    const totalWidth = scrollerInner.scrollWidth;
    console.log("totalWidth", totalWidth);

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".scroller-container",
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + totalWidth,
        markers: true,
      },
    });
  };

  init() {
    this.start();
  }

  destroy() {}  
}
