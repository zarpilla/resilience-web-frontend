<template>
  <div class="cursor">
    <div class="cursor__ball cursor__ball--small" style="display: none">
      <svg height="16" width="16">
        <circle cx="8" cy="8" r="7" stroke-width="0"></circle>
      </svg>
    </div>
  </div>
</template>

<style lang="scss">
body {
  cursor: none !important;
}
.cursor {
  pointer-events: none;
}
.cursor__ball {
  position: fixed;
  top: 0;
  left: 0;
  /* mix-blend-mode: difference; */
  z-index: 10000;
}
.cursor__ball circle {
  fill: #000;
}

.cursor {
  &.cursor-text-light {
    .cursor__ball circle {
      fill: #fff;
    }
  }
  &.cursor-text-dark {
    .cursor__ball circle {
      fill: #000;
    }
  }
}

.cursor__message {
  position: absolute;
  top: 0;
  left: 0px;
  width: 50px;
  text-align: center;
  line-height: 50px;
  font-family: "Barlow-condensed-Medium";
  font-size: 10px;
  color: #fff;
}
.cursor__ball .cursor__message {
  display: none;
}
.cursor__ball .cursor__message__slider {
  display: none;
  position: relative;
}
.cursor__ball.hovered .cursor__message {
  display: block;
}
.cursor__message__slider img {
  position: absolute;
}
.cursor__message__slider img.arrow-left {
  top: -30px;
  left: 6px;
  width: 6px;
}
.cursor__message__slider img.arrow-right {
  top: -30px;
  right: 6px;
  width: 6px;
}

.cursor__ball.hovered-slider .cursor__message__slider {
  display: block;
}

.cursor__ball .cursor__scroll_up,
.cursor__ball .cursor__scroll_down {
  display: none;
  position: absolute;
}
.cursor__ball .cursor__scroll_up img,
.cursor__ball .cursor__scroll_down img {
  height: 34px;
}
.cursor__ball .cursor__scroll_up {
  top: 9px;
  left: 21px;
}
.cursor__ball .cursor__scroll_down {
  top: 9px;
  left: 21px;
}

.cursor__ball .cursor__scroll_up.up,
.cursor__ball .cursor__scroll_down.down {
  display: block;
}

.cursor__ball.hovered .cursor__scroll_up.up,
.cursor__ball.hovered .cursor__scroll_down.down {
  display: none;
}

.cursor__ball.hovered-slider .cursor__scroll_up.up,
.cursor__ball.hovered-slider .cursor__scroll_down.down {
  display: none;
}

.cursor__ball.blend-differenced {
  mix-blend-mode: difference;
}

.cursor__ball.blend-differenced.hovered circle {
  fill: #fff;
}

.cursor__message.cursor-projects {
  width: 34px;
  height: 50px;
  font-size: 8px;
  line-height: 10px;
  text-align: center;
  margin-top: 14px;
  margin-left: 8px;
  text-transform: uppercase;
}
.cursor__image {
  position: absolute;
  bottom: -25px;
  left: 25px;
  width: 140px;
  height: 200px;
  object-fit: contain;
  z-index: -1;
  display: none;
}
/* .cursor__ball.hovered circle{
  fill: #fff;
} */
</style>
