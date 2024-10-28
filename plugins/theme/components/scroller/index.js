import gsap from "gsap";
import Sniffer from '../../utils/sniffer';

export default class Scroller {
  constructor() {
    
  }

  start = () => {

    this.scrollContainer = document.querySelector('.scroll-container');
    this.fullpage = document.querySelector('.fullpage-scroll');    

    if (!this.scrollContainer || this.fullpage) {
      // console.log('normal scroller end')
      return
    }
    if (Sniffer.isDevice) {
      return
    }

    const ease = document.body.classList.contains('slow-device') ? 0.075 : 0.05

    this.scroller = {
      target: document.querySelector("#scroll-container"),
      ease: ease, // <= scroll speed
      endY: 0,
      y: 0,
      resizeRequest: 1,
      scrollRequest: 0
    };

    this.requestId = null;

    gsap.set(this.scroller.target, {
      rotation: 0.01*0,
      force3D: true
    });

    this.onLoad();
  };

  onLoad = () => {
    this.updateScroller();
    window.focus();
    window.addEventListener("resize", this.onResize);
    document.addEventListener("scroll", this.onScroll);

    setTimeout(() => {
      this.onResize()
    }, 1000)
  };

  // Hover an element
  updateScroller = () => {    
    if (!this.scroller) {
      return
    }
    // console.log('updateScroller')
    var resized = this.scroller.resizeRequest > 0;

    if (resized) {
      var height = this.scroller.target.clientHeight;
      document.body.style.height = height + "px";
      this.scroller.resizeRequest = 0;
    }

    var scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    this.scroller.endY = scrollY;
    this.scroller.y += (scrollY - this.scroller.y) * this.scroller.ease;

    if (Math.abs(scrollY - this.scroller.y) < 0.05 || resized) {
      this.scroller.y = scrollY;
      this.scroller.scrollRequest = 0;
    }

    gsap.set(this.scroller.target, {
      y: -this.scroller.y
    });


    this.fixed = document.querySelectorAll('.fixed');
    if (this.fixed) {
      const footer = document.getElementById('footer') || { clientHeight: 0 };
      this.fixed.forEach(el => {
        const stop = window.innerHeight // el.dataset.fixedStop || 0
        if (this.scroller.y < this.scroller.target.clientHeight - footer.clientHeight - stop) {
          gsap.set(el, {
            y: this.scroller.y
          })
        }
      })
    }

    this.requestId =
      this.scroller.scrollRequest > 0
        ? requestAnimationFrame(this.updateScroller)
        : null;
  };
  onScroll = (e) => {
    this.scroller.scrollRequest++;
    if (!this.requestId) {
      this.requestId = requestAnimationFrame(this.updateScroller);
    }
  };

  onResize = () => {    
    // console.log('onResize')
    this.scroller.resizeRequest++;
    if (!this.requestId) {
      this.requestId = requestAnimationFrame(this.updateScroller);
    }
    
  };

  init() {
    this.start();
  }

  destroy() {
    // console.log('scroller destroy')
    this.scroller = null
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("scroll", this.onScroll);
  }
}
