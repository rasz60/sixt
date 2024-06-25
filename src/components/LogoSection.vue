<template>
    <a href="/" :class="'logo size-' + size">
      
    </a>
  </template>
  
  <script>
  export default {
    props: {
      size: {
        type: String,
        default: 'medium'
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .logo {
    display: block;
    position: relative;
    font-weight: 500;
    transform: rotate(-18deg);

    &.size-medium {
      font-size: 20px;
    }
  
    .emoji-main {
      font-size: 50px;
    }
    .logo-text {
      &.dev {
        margin-top: -1.05em;
        margin-right: -1.1em;
        writing-mode: vertical-rl;
        text-orientation: upright;
      }
      &.enjoy {
        letter-spacing: 0.1em;
        color: rgb(111, 0, 255);
      } 
      .hidden {
        color: #fff;
      }
    }
  }
  </style>