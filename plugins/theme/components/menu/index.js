import gsap from "gsap";
// import Sniffer from '../../utils/sniffer';
import ScrollTrigger from "gsap/ScrollTrigger";

export default class Menu {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  start = () => {
    this.clicked = "";
    this.icoMenu = document.querySelector(".icoMenu");
    this.menuFullPage = document.querySelector(".menu-full-page");
    this.goTo = document.querySelectorAll(".goto");
    this.showSubMenu = document.querySelectorAll(".show-sub-menu");

    this.opened = false;
    this.menuFullPageLinks = document.querySelectorAll(".menu-full-page h3");
    this.subNavUls = document.querySelectorAll(".subNav ul");

    // console.log('this.icoMenu', this.icoMenu)
    if (!this.icoMenu) {
      return;
    }
    this.icoMenu.addEventListener("click", this.onClick);

    if (this.goTo) {
      this.goTo.forEach(el => {
        el.addEventListener("click", this.onClickGoTo);
      });
    }

    if (this.showSubMenu) {
      this.showSubMenu.forEach(el => {
        el.addEventListener("click", this.showSubMenuClick);
      });
    }
  };

  removeAllSelected = () => {
    this.showSubMenu.forEach(el2 => {
      el2.classList.remove("selected");
    });
  };

  showSubMenuClick = e => {
    console.log("showSubMenuClick");
    var el = e.target;    
    this.removeAllSelected();
    el.classList.add("selected");
    const target = el.dataset.show;
    const targetTo = el.dataset.to;    
    if (this.clicked === target) {
      const fn = window.dispatchEvent(
        new CustomEvent("nuxt-nav", { detail: targetTo })
      );
      this.onClickGoTo(null, null);
      // console.log('same clicked')
      this.clicked = "";
      return;
    } else {
      this.clicked = target;
    }

    this.removeActiveSubmenus();
    
    document.body.classList.remove("menu-open");
    this.opened = false;

    const targetUl = document.querySelector(
      `.subNav ul[data-show='${target}']`
    );
    targetUl.classList.add("active");
  };

  removeActiveSubmenus = () => {
    const all = document.querySelectorAll(".subNav ul");
    all.forEach(e => {
      e.classList.remove("active");
    });
  };

  setMenuStyle(color) {
    // console.log("setMenuStyle", color);
  }

  // Move the cursor
  onClick = e => {
    console.log("onClick");
    if (!this.opened) {
      this.menuFullPage.classList.add("open");
      // document.body.classList.add("dark-mode");
      document.body.classList.add("no-overflow");
      document.body.classList.add("menu-opened");
      window.dispatchEvent(new Event("menu-open"));
      gsap.set(this.menuFullPage, {
        duration: 0.5,
        opacity: 1
      });
    } else {
      // document.body.classList.remove("dark-mode");
      document.body.classList.remove("no-overflow");
      document.body.classList.remove("menu-opened");
      window.dispatchEvent(new Event("menu-close"));
      gsap.to(this.menuFullPage, {
        duration: 0.5,
        opacity: 0
      });
      setTimeout(() => {
        this.menuFullPage.classList.remove("open");
      }, 500);
    }
    this.opened = !this.opened;
  };

  onSecondClickGoTo = e => {};

  onClickGoTo = (e, callback) => {
    // document.body.classList.remove("dark-mode");
    document.body.classList.remove("no-overflow");
    document.body.classList.remove("menu-opened");

    window.dispatchEvent(new Event("menu-close"));

    gsap.to(this.menuFullPage, {
      duration: 0.5,
      opacity: 0,
      onComplete: () => {
        this.menuFullPage.classList.remove("open");
        if (this.menuFullPageLinks) {
          this.menuFullPageLinks.forEach(el => el.classList.remove("selected"));
        }
        if (callback) {
          callback();
        }
      }
    });

    this.removeActiveSubmenus();

    this.opened = false;
  };

  init() {
    this.start();
  }

  destroy() {
    if (this.showSubMenu) {
      this.showSubMenu.forEach(el => {
        el.removeEventListener("click", this.showSubMenuClick);
      });
    }
    if (this.icoMenu) {
      this.icoMenu.removeEventListener("click", this.onClick);
    }
    if (this.goTo) {
      this.goTo.forEach(el => {
        el.removeEventListener("click", this.onClickGoTo);
      });
    }
  }
}
