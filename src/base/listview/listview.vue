<template>
  <scroll :data="data" class="listview" ref="listview" :probeType="probeType" @scroll="scroll"
          :listenScroll="listenScroll">
    <ul>
      <li class="list-group" v-for="group in data" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items">
            <img v-lazy="item.avatar" alt="" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"
         @touchend.stop>
      <ul>
        <li ref="listShortcutItem" class="item" v-for="(item, index) in shortCutList" :data-index="index"
            :class="{'current': currentIndex === index}">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import { getData } from 'common/js/dom'
  import Loading from 'base/loading/loading'

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        currentIndex: 0,
        scrollY: -1,
        diff: -1
      }
    },
    components: {
      Scroll,
      Loading
    },
    created () {
      this.touches = {}
      this.probeType = 3
      this.listenScroll = true
      this.listHeight = []
    },
    methods: {
      selectItem (item) {
        this.$emit('selectSinger', item)
      },
      refresh () {
        this.$refs.listview.refresh()
      },
      onShortcutTouchStart (e) {
        let anchorIndex = getData(e.target, 'index')
        this.touches.y1 = e.touches[0].pageY
        this.touches.index = parseInt(anchorIndex)
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove (e) {
        this.touches.y2 = e.touches[0].pageY
        let delta = this.$refs.listShortcutItem[0].clientHeight
        let anchorIndex = this.touches.index + ((this.touches.y2 - this.touches.y1) / parseInt(delta) | 0)
        this._scrollTo(anchorIndex)
      },
      _scrollTo (index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      _calculateHeight () {
        this.listHeight = []
        let height = 0
        let list = this.$refs.listGroup
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          height += list[i].clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY (newY) {
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        let currentY = -newY
        for (let k = 0; k < this.listHeight.length - 1; k++) {
          if (currentY >= this.listHeight[k] && currentY < this.listHeight[k + 1]) {
            this.currentIndex = k
            this.diff = this.listHeight[k + 1] - currentY
            return
          }
        }
        this.currentIndex = this.listHeight.length - 2
      },
      diff (newVal) {
//        let fixedTop = 0
//        if (newVal > 0 && newVal < this.$refs.fixed.clientHeight) {
//          fixedTop = newVal - this.$refs.fixed.clientHeight
//        }
//        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
        let fixedTop = (newVal > 0 && newVal < this.$refs.fixed.clientHeight) ? newVal - this.$refs.fixed.clientHeight : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      }
    },
    computed: {
      shortCutList () {
        return this.data.map((group) => {
          return group.title.substring(0, 1)
        })
      },
      fixedTitle () {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~common/scss/variable';

  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    .list-group {
      padding-bottom: 30px;
      .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-hightlight-background;
      }
      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .list-shortcut {
      position: absolute;
      z-index: 30;
      right: 0px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: $color-background-d;
      font-family: Helvetica;
      .item {
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current {
          color: $color-theme;
        }
      }
    }
    .list-fixed {
      position: absolute;
      top: 0;
      left: 0px;
      width: 100%;
      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-hightlight-background;
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
