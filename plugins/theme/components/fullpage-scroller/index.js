import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import Sniffer from "../../utils/sniffer";

export default class FullPageScroller {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrollToPlugin);
  }

  start = () => {
    this.scrollContainer = document.querySelector(".scroll-container");
    this.fullpage = document.querySelector(".fullpage-scroll");
    this.sections = document.querySelectorAll(".panel");
    this.cursor = document.querySelector(".cursor");
    this.cursorBall = document.querySelector(".cursor__ball");
    this.section = 0;
    this.wheeling = false;
    this.lastChange = +new Date();

    // if (!this.scrollContainer) {
    //   return;
    // }
    // console.log('this.fullpage', this.fullpage)
    if (!this.fullpage) {
      return;
    }
    if (Sniffer.isDevice) {
      return;
    }

    this.scroller = {
      target: document.querySelector("#scroll-container"),
      ease: 0.05, // <= scroll speed
      endY: 0,
      y: 0,
      resizeRequest: 1,
      scrollRequest: 0
    };

    this.requestId = null;

    gsap.set(this.scroller.target, {
      rotation: 0.01 * 0,
      force3D: true
    });

    this.onLoad();
  };

  onLoad = () => {
    this.updateScroller();
    window.focus();

    window.addEventListener("wheel", this.updateFromWheel);

    window.addEventListener("keyup", this.checkKey);

    window.addEventListener("click", this.onClick);

    if (window.location.hash) {
      const hashElement = document.getElementById(
        window.location.hash.substring(3)
      );
      let sectionNumber = -1;
      if (hashElement && hashElement.classList.contains("panel")) {
        this.sections.forEach((s, i) => {
          if (s.id === hashElement.id) {
            sectionNumber = i;
          }
        });
        if (sectionNumber >= 0) {
          this.goToSection(sectionNumber);
          gsap.set(this.scroller.target, {
            y: -sectionNumber * window.innerHeight
          });
        }
      }
    } else {
      this.setSectionScrollerOptions();
    }
  };

  updateFromWheel = e => {
    if (!this.wheeling) {
      this.wheeling = true;
      if (+new Date() - this.lastChange > 300) {
        if (e.deltaY < 0) {
          if (this.section > 0) {
            this.goToSection(this.section - 1);
          }
        } else if (e.deltaY > 0) {
          if (this.section < this.sections.length - 1) {
            this.goToSection(this.section + 1);
          }
        }
      }
      this.lastChange = +new Date();
    }
    setTimeout(() => {
      this.wheeling = false;
    }, 300);
  };

  checkKey = e => {
    e = e || window.event;

    if (e.keyCode == "38") {
      // up arrow
      // console.log('up arrow')
      if (this.section > 0) {
        this.goToSection(this.section - 1);
      }
    } else if (e.keyCode == "40") {
      // down arrow
      // console.log('down arrow')
      if (this.section < this.sections.length - 1) {
        this.goToSection(this.section + 1);
      }
    } else if (e.keyCode == "37") {
      // left arrow
    } else if (e.keyCode == "39") {
      // right arrow
    }
  };

  // Hover an element
  updateScroller = () => {
    // if (!this.scroller) {
    //   return
    // }
    var resized = this.scroller.resizeRequest > 0;

    if (resized) {
      var height = this.scroller.target.clientHeight;
      document.body.style.height = height + "px";
      this.scroller.resizeRequest = 0;
    }

    var scrollY =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    this.scroller.endY = scrollY;
    this.scroller.y += (scrollY - this.scroller.y) * this.scroller.ease;

    if (Math.abs(scrollY - this.scroller.y) < 0.05 || resized) {
      this.scroller.y = scrollY;
      this.scroller.scrollRequest = 0;
    }

    gsap.to(this.scroller.target, {
      duration: 1,
      y: -this.section * window.innerHeight
    });

    this.scroller.y = this.section * window.innerHeight;

    this.requestId =
      this.scroller.scrollRequest > 0
        ? requestAnimationFrame(this.updateScroller)
        : null;
  };
  onScroll = e => {
    // this.scroller.scrollRequest++;
    // if (!this.requestId) {
    //   this.requestId = requestAnimationFrame(this.updateScroller);
    // }
  };

  onResize = () => {
    // this.scroller.resizeRequest++;
    // if (!this.requestId) {
    //   this.requestId = requestAnimationFrame(this.updateScroller);
    // }
  };

  goToSection = (i, anim) => {
    // console.log("goToSection", i);
    this.section = i;

    this.setSectionScrollerOptions();
    // data-scroll-up="true" data-scroll-down="true"

    this.scroller.scrollRequest++;
    if (!this.requestId) {
      this.requestId = requestAnimationFrame(this.updateScroller);
    }
  };

  setSectionScrollerOptions = () => {
    const section = this.sections[this.section];
    // console.log('section', section, this.section )
    if (
      section &&
      this.cursor &&
      section.dataset &&
      section.dataset.scrollUp !== null &&
      section.dataset.scrollDown !== null
    ) {
      this.cursor.classList.remove("can-up");
      this.cursor.classList.remove("can-down");
      if (section.dataset.scrollUp === "true") {
        this.cursor.classList.add("can-up");
      }
      if (section.dataset.scrollDown === "true") {
        this.cursor.classList.add("can-down");
      }
    }
  };

  onClick = () => {
    // console.log('onclick')
    if (
      this.cursor &&
      !this.cursorBall.classList.contains("hovered") &&
      !this.cursorBall.classList.contains("hovered-slider") &&
      !this.wheeling
    ) {
      if (this.cursor.classList.contains("go-up")) {
        if (this.section > 0) {
          this.goToSection(this.section - 1);
        }
      } else if (this.cursor.classList.contains("go-down")) {
        if (this.section < this.sections.length - 1) {
          this.goToSection(this.section + 1);
        }
      }
    }
  };

  init() {
    this.start();
  }

  destroy() {
    // console.log('full page scroller destroy')
    // this.scroller = null
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("wheel", this.updateFromWheel);
    window.removeEventListener("keyup", this.checkKey);
  }
}
