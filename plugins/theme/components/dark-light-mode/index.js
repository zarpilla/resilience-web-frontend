import gsap from "gsap";
import device from "current-device";

import ScrollTrigger from "gsap/ScrollTrigger";

export default class DarkLightMode {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  start = () => {

    
    const hideOnTextDarkElements = gsap.utils.toArray('.hide-on-text-dark')
    const hideOnTextLightElements = gsap.utils.toArray('.hide-on-text-light')
    const hideOnFooterElements = gsap.utils.toArray('.hide-on-footer')

    const textLightZones = gsap.utils.toArray('div.text-light')
    const textDarkZones = gsap.utils.toArray('div.text-dark')

    const zoneColorElements = gsap.utils.toArray('.zone-color')

    const footer = document.querySelector('footer')
    
    textLightZones.forEach(zone => {
      ScrollTrigger.create({
        trigger: zone,
        start: "top middle",
        end: "bottom middle",
        //markers: true,        
        onEnter: () => {
          hideOnTextLightElements.forEach(element => {
            element.classList.add('d-none')
          });
          hideOnTextDarkElements.forEach(element => {
            element.classList.remove('d-none')
          });
          zoneColorElements.forEach(element => {
            element.classList.remove('color-text-dark')
            element.classList.add('color-text-light')
          });
        },
        onEnterBack: () => {
          hideOnTextLightElements.forEach(element => {
            element.classList.add('d-none')
          });
          hideOnTextDarkElements.forEach(element => {
            element.classList.remove('d-none')
          });
          zoneColorElements.forEach(element => {
            element.classList.remove('color-text-dark')
            element.classList.add('color-text-light')
          });          
        }
      });
    });
    textDarkZones.forEach(zone => {
      ScrollTrigger.create({
        trigger: zone,
        start: "top middle",
        end: "bottom middle",
        // markers: true,
        onEnter: () => {
          hideOnTextLightElements.forEach(element => {
            element.classList.remove('d-none')
          });
          hideOnTextDarkElements.forEach(element => {
            element.classList.add('d-none')
          });
          zoneColorElements.forEach(element => {
            element.classList.remove('color-text-light')
            element.classList.add('color-text-dark')
          });
        },
        onEnterBack: () => {
          hideOnTextLightElements.forEach(element => {
            element.classList.remove('d-none')
          });
          hideOnTextDarkElements.forEach(element => {
            element.classList.add('d-none')
          });
          zoneColorElements.forEach(element => {
            element.classList.remove('color-text-light')
            element.classList.add('color-text-dark')
          });

        }
      });
    });

    footer && ScrollTrigger.create({
      trigger: footer,
      start: "top top",
      end: "bottom top",
      // markers: true,
      onEnter: () => {
        hideOnFooterElements.forEach(element => {
          element.classList.add('d-none')
        });
      },
      onLeaveBack: () => {
        hideOnFooterElements.forEach(element => {
          element.classList.remove('d-none')
        });
      },
      onLeave: () => {
        hideOnFooterElements.forEach(element => {
          element.classList.remove('d-none')
        });
      }
    });

  };

  init() {
    this.start();
  }

  destroy() {
  }

}
