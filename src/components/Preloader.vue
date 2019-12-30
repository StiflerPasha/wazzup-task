<template>
  <div class="peloaderHolder" :class="classes">
    <div class="preloader" :class="{'pl-xs': size === 'mini', 'pls-amber': !color, 'pls-white': color === 'white'}">
      <svg class="pl-circular" viewBox="25 25 50 50">
        <circle class="plc-path" cx="50" cy="50" r="20"></circle>
      </svg>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({}),
    props: ['className', 'size', 'color'],
    computed: {
      classes () {
        let object = {}
        object[this.className] = true
        return object
      }
    }
  }
</script>

<style>
  .place-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    div {
      user-select: none;
      text-align: center;
    }
  }
  .peloaderHolder {
    width: 100%;
    text-align: center;
  }

  .preloader {
    position: relative;
    margin: 0 auto;
    display: inline-block;
    width: 100%;
    text-align: center;
  }

  .preloader:not([class*=pl-]) {
    width: 40px
  }

  .preloader:before {
    content: '';
    display: block;
    padding-top: 100%
  }

  .preloader.pl-xs {
    width: 20px
  }

  .preloader.pl-sm {
    width: 30px
  }

  .preloader.pl-lg {
    width: 50px
  }

  .preloader.pl-xl {
    width: 80px
  }

  .preloader.pl-xxl {
    width: 100px
  }

  .preloader:not([class*=pls-]) .plc-path {
    animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite
  }

  .preloader[class*=pls-] .plc-path {
    animation: dash 1.5s ease-in-out infinite
  }

  .preloader.pls-red .plc-path {
    stroke: #F44336
  }

  .preloader.pls-white .plc-path {
    stroke: #fff
  }

  .preloader.pls-green .plc-path {
    stroke: #4CAF50
  }

  .preloader.pls-yellow .plc-path {
    stroke: #FFEB3B
  }

  .preloader.pls-bluegray .plc-path {
    stroke: #607D8B
  }

  .preloader.pls-amber .plc-path {
    stroke: rgb(40, 167, 69)
  }

  .preloader.pls-teal .plc-path {
    stroke: #009688
  }

  .preloader.pls-gray .plc-path {
    stroke: #9E9E9E
  }

  .preloader.pls-pink .plc-path {
    stroke: #E91E63
  }

  .preloader.pls-purple .plc-path {
    stroke: #9C27B0
  }

  .preloader.pls-white .plc-path {
    stroke: #fff
  }

  .pl-circular {
    animation: rotate 2s linear infinite;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    bottom: 0;
    right: 0;
    margin: auto
  }

  .plc-path {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    stroke-width: 2;
    stroke-miterlimit: 10;
    fill: none
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg)
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px
    }
  }

  @keyframes color {
    0%, 100% {
      stroke: #F44336
    }
    40% {
      stroke: #2196F3
    }
    66% {
      stroke: #4CAF50
    }
    80%, 90% {
      stroke: #FFC107
    }
  }
</style>
