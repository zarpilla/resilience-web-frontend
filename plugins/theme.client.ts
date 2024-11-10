// import Sniffer from "~/plugins/theme/utils/sniffer";
import Cursor from '~/plugins/theme/components/cursor/index';
import DarkLightMode from '~/plugins/theme/components/dark-light-mode/index';
import Button from '~/plugins/theme/components/button/index';


export default defineNuxtPlugin((nuxtApp) => {
  const cursor = new Cursor()
  const darkLightMode = new DarkLightMode()
  

  const initTheme = () => {
    console.log("init theme!");
    destroy();

    cursor.init()
    darkLightMode.init()

    const buttonElements = document.querySelectorAll('[data-block="button"]');
    buttonElements.forEach((buttonElement) => {
      new Button(buttonElement);
    });

  };

  const destroy = () => {
    cursor.destroy()
    darkLightMode.destroy()
  };

  window.addEventListener("init-theme", initTheme);

  setTimeout(() => {
    initTheme();
  }, 10);


});
