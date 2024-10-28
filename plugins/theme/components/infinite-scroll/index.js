import gsap from "gsap";
// import Sniffer from '../../utils/sniffer';

export default class InfiniteScroll {
  constructor() {
    
  }

  start = () => {

    this.rows = document.querySelectorAll(".cb-tagreel-row");
    
    if (!this.rows) {
      return;
    }

    this.rows.forEach(function(e, i) {
      let row_width = e.getBoundingClientRect().width;
      let row_item_width = e.children[0].getBoundingClientRect().width;
      // let initial_offset = ((2 * row_item_width) / row_width) * 100 * -1;
      let x_translation = initial_offset * -1;

      let initial_offset = i % 2 === 0 ? 0 : -100
      let end_offset = i % 2 === 0 ? -100 : 0

      gsap.set(e, {
        xPercent: `${initial_offset}`
      });

      const duration = document.body.classList.contains('slow-device') ? 32 : 24;

      var tl = gsap.timeline();

      tl.to(e, {
        ease: "none",
        duration: duration,
        xPercent: end_offset,
        repeat: -1
      });
      
    });
  };

  init() {
    this.start()
  }

  destroy() {
  }
}
