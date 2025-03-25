import gsap from "gsap";
import device from "current-device";

export default class Cursor {
  constructor() {
    
  }

  start = () => {
    this.smallBall = document.querySelector(".cursor__ball--small");
    this.hoverables = document.querySelectorAll(".hoverable, .n-link");
    this.cursor =  document.querySelector(".cursor");
    this.textLights = document.querySelectorAll("div.text-light");    
    this.lightButtons = document.querySelectorAll(".btn:not(.btn-black):not(.btn-dark)");    
    this.textDarks = document.querySelectorAll("div.text-dark");
    this.darkButtons = document.querySelectorAll(".btn-black, .btn-dark");
    this.hovering = false;
    this.moved = false;    
    this.current = ''

    if (device.mobile()) {
      document.body.style.cursor = 'inherit'
      return
    }
    if (!this.cursor) {
      return
    }

    if (this.smallBall) {
      this.smallBall.style.display = "none";
    }
    
    // Listeners
    document.body.addEventListener("mousemove", this.onMouseMove);
    if (this.hoverables) {
      for (let i = 0; i < this.hoverables.length; i++) {
        const css = this.hoverables[i].classList.contains('hoverable-slider') ? 'hovered-slider' : 'hovered'
        this.hoverables[i].addEventListener("mouseenter", () => this.onMouseHover('hovered'));
        this.hoverables[i].addEventListener("mouseleave", () => this.onMouseHoverOut('hovered'));                
      }
    }
    if (this.textLights) {
      for (let i = 0; i < this.textLights.length; i++) {
        this.textLights[i].addEventListener("mouseenter", () => this.onMouseHoverLightEnter('cursor-text-light', true));
        
      }      
    }
    if (this.textDarks) {
      for (let i = 0; i < this.textDarks.length; i++) {
        this.textDarks[i].addEventListener("mouseenter", () => this.onMouseHoverLightEnter('cursor-text-dark', true));
        this.textDarks[i].addEventListener("mousemove", () => this.onMouseHoverLightEnter('cursor-text-dark', true));
      }      
    }
    if (this.darkButtons) {
      for (let i = 0; i < this.darkButtons.length; i++) {
        this.darkButtons[i].addEventListener("mouseenter", () => this.onMouseHoverLightEnter('cursor-text-dark', false));
        this.darkButtons[i].addEventListener("mouseleave", () => this.onMouseHoverLightLeave('cursor-text-dark'));
      }
    }
    if (this.lightButtons) {
      for (let i = 0; i < this.lightButtons.length; i++) {
        this.lightButtons[i].addEventListener("mouseenter", () => this.onMouseHoverLightEnter('cursor-text-light', false));
        this.lightButtons[i].addEventListener("mouseleave", () => this.onMouseHoverLightLeave('cursor-text-light'));
      }
    }
  };

  getFirstParentWhichIsLightOrDark = (x, y) => {
    let el = document.elementFromPoint(x, y);
    while (el) {
      if (el.classList.contains('text-light')) {
        return 'cursor-text-light'
      }
      if (el.classList.contains('text-dark')) {
        return 'cursor-text-dark'
      }
      el = el.parentElement;
    }
    return 'cursor-text-light'    
  }


  // Move the cursor
  onMouseMove = e => {    
    gsap.to(this.smallBall, {
      duration: 0.1,
      x: e.clientX - 10,
      y: e.clientY - 10
    });

    if (!this.moved) {
      this.moved = true;      
      const divCss = this.getFirstParentWhichIsLightOrDark(e.clientX, e.clientY);
      this.onMouseHoverLightEnter(divCss);

      setTimeout(() => {
        this.smallBall.style.display = "block";
      }, 100);
    }

  };

  onMouseHoverLightEnter = (css, storeCurrent) => {
    if (this.cursor) {            
      if (css !== 'cursor-text-light') {
        this.cursor.classList.remove('cursor-text-light');
      }
      if (css !== 'cursor-text-dark') {      
        this.cursor.classList.remove('cursor-text-dark');
      }
      this.cursor.classList.add(css);
      if (storeCurrent) {
        this.current = css;
      }
    }
  }
  onMouseHoverLightLeave = (css) => {
    if (this.cursor) {
      if (css === 'cursor-text-dark') {        
        this.cursor.classList.remove('cursor-text-dark');
      } else {
        this.cursor.classList.remove('cursor-text-light');        
      }
      this.cursor.classList.add(this.current);
    }
  }

  // Hover an element
  onMouseHover = (css) => {
    this.hovering = true;
    this.smallBall.classList.add(css);
    const scale = window.innerWidth < 1450 ? 1.6 : 2
    gsap.to(this.smallBall, {
      duration: 0.3,
      scale: scale
    });
  };
  onMouseHoverOut = (css) => {
    this.hovering = false;
    this.smallBall.classList.remove(css);
    gsap.to(this.smallBall, {
      duration: 0.3,
      scale: 1
    });
  };

  init() {
    this.start();
  }

  destroy() {    
    if (this.smallBall) {
      this.smallBall.classList.remove('hovered');
      gsap.set(this.smallBall, {
        scale: 1
      });
    }
  }

}
