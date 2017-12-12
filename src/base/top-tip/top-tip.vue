<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      delay: {
        type: Number,
        default: 1500
      }
    },
    data () {
      return {
        showFlag: false
      }
    },
    methods: {
      hide () {
        this.showFlag = false
      },
      show () {
        this.showFlag = true
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.hide()
        }, this.delay)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";

  .top-tip {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 500;
    background: $color-dialog-background;
    &.drop-enter-active, &.drop-leave-active {
      transition: all 0.3s;
    }
    &.drop-enter, &.drop-leave-to {
      transform: translate(0, -100%)
    }
  }
</style>
