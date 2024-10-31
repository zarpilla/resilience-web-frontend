// import Sniffer from "~/plugins/theme/utils/sniffer";
import Cursor from '~/plugins/theme/components/cursor/index';
import DarkLightMode from '~/plugins/theme/components/dark-light-mode/index';
//import HorizontalScroller from '~/plugins/theme/components/horizontal-scroller/index';

// import Scroller from '~/plugins/theme/components/scroller/index';
// import FullPageScroller from '~/plugins/theme/components/fullpage-scroller/index';
// import Menu from '~/plugins/theme/components/menu/index';
// import SolidLogo from '~/plugins/theme/components/solid-logo/index';
// import InfiniteScroll from '~/plugins/theme/components/infinite-scroll/index';

export default defineNuxtPlugin((nuxtApp) => {
    
    //const sniffer = new Sniffer();


  //Sniffer.addClasses(document.documentElement);
  // Sniffer.testPerformance();
  const cursor = new Cursor()
  const darkLightMode = new DarkLightMode()
  //const horizontalScroller = new HorizontalScroller()
  // const scroller = new Scroller()
  // const fullPageScroller = new FullPageScroller()
  // const menu = new Menu()
  // const infiniteScroll = new InfiniteScroll()
  // const solidLogo = new SolidLogo()

  const initTheme = () => {
    console.log("init theme!");
    destroy();

    cursor.init()
    darkLightMode.init()
    //horizontalScroller.init()
    // scroller.init()
    // fullPageScroller.init()
    // menu.init()
    // infiniteScroll.init()
    // solidLogo.init()
  };

  const destroy = () => {
    cursor.destroy()
    darkLightMode.destroy()
    //horizontalScroller.destroy()
    // scroller.destroy()
    // fullPageScroller.destroy()
    // menu.destroy()
    // infiniteScroll.destroy()
    // solidLogo.destroy()
  };

  window.addEventListener("init-theme", initTheme);

  setTimeout(() => {
    initTheme();
  }, 10);


});
