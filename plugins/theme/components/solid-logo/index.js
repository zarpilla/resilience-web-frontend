import gsap from "gsap";
// import Sniffer from '../../utils/sniffer';
import ScrollTrigger from "gsap/ScrollTrigger";

export default class SolidLogo {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  start = () => {
    this.menu = document.querySelector(".menu");
    this.transparentZones = document.querySelectorAll(".transparent-logo");
    this.scrolls = []

    // console.log('this.icoMenu', this.icoMenu)
    if (!this.menu) {
      return;
    }

    this.transparentZones.forEach((elem) => {
      const scroll = ScrollTrigger.create({
        trigger: elem,
        onEnter: () => { this.onEnter(elem) }, 
        onEnterBack: () => { this.onEnterBack(elem, -1) },
        onLeave: () => { this.onLeave(elem) } // assure that the element is hidden when scrolled into view
      });
      this.scrolls.push(scroll)
    }
    )
  }

  onEnter() {
    // console.log('onEnter')
    this.menu.classList.add('transparent-menu')
  }

  onEnterBack() {
    // console.log('onEnterBack')
    this.menu.classList.add('transparent-menu')
  }

  onLeave() {
    // console.log('onLeave')
    this.menu.classList.remove('transparent-menu')
  }



  init() {
    this.start();
  }

  destroy() {
    if (this.menu) {
      this.menu.classList.remove('transparent-menu')
    }
    if (this.scrolls) {
      this.scrolls.forEach(s => {
        s.kill()
      })
    }
  }
}
