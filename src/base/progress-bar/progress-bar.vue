<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" @touchstart.prevent="progressTouchStart" @touchmove="progressTouchMove"
           @touchend="progressTouchEnd">
        <div class="progress-btn" ref="progressBtn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { prefixStyle } from 'common/js/dom'

  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {}
    },
    methods: {
      progressClick (e) {
        const react = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - react.left
        this._offset(offsetWidth)
        this._triggerPercent()
      },
      progressTouchStart (e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }

        const deltaX = e.touches[0].pageX - this.touch.startX
        const barWidth = this.$refs.progressBar.clientWidth - 16
        const offsetWidth = Math.min(barWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd (e) {
        this.touch.initiated = false
        this._triggerPercent()
      },
      _offset (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      _triggerPercent () {
        const barWidth = this.$refs.progressBar.clientWidth - 16
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      }
    },
    watch: {
      percent (newVal) {
        if (newVal >= 0) {
          const offsetWidth = newVal * this.$refs.progressBar.clientWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";

  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -15px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
