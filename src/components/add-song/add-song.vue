<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" :data="playHistory" :refreshDelay="refreshDelay"
                  v-show="currentIndex===0"
                  class="list-scroll">
            <div class="list-inner">
              <song-list :songs="playHistory" @selectSong="playSong"></song-list>
            </div>
            <div class="no-result-wrapper" v-show="!playHistory.length">
              <no-result title="小主最近没有收听任何歌曲"></no-result>
            </div>
          </scroll>
          <scroll ref="searchList" :refreshDelay="refreshDelay" :data="searchHistory"
                  v-show="currentIndex===1"
                  class="list-scroll">
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
            </div>
            <div class="no-result-wrapper" v-show="!searchHistory.length">
              <no-result title="小主最近没有搜索记录"></no-result>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="saveSearch" @listScroll="boxBlur"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import SearchList from 'base/search-list/search-list'
  import NoResult from 'base/no-result/no-result'
  import Suggest from 'components/suggest/suggest'
  import TopTip from 'base/top-tip/top-tip'
  import { searchMixin } from 'common/js/mixin'
  import Song from 'common/js/Song'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [searchMixin],
    data () {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        switches: [
          {name: '最近播放'},
          {name: '搜索历史'}
        ],
        listenScroll: true
      }
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      show () {
        this.showFlag = true
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20)
      },
      hide () {
        this.showFlag = false
      },
      switchItem (index) {
        this.currentIndex = index
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20)
      },
      playSong (song, index) {
        if (index !== 0) {
          this.insertSong(new Song(song))
          this.$refs.topTip.show()
        }
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      SearchBox,
      Switches,
      Scroll,
      SongList,
      SearchList,
      Suggest,
      NoResult,
      TopTip
    }
  }
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .add-song {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background: $color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .header {
      position: relative;
      height: 44px;
      text-align: center;
      .title {
        line-height: 44px;
        font-size: $font-size-large;
        color: $color-text;
      }
      .close {
        position: absolute;
        top: 0;
        right: 8px;
        .icon-close {
          display: block;
          padding: 12px;
          font-size: 20px;
          color: $color-theme;
        }
      }
    }
    .search-box-wrapper {
      margin: 20px;
    }
    .shortcut {
      .list-wrapper {
        position: absolute;
        top: 170px;
        bottom: 0;
        width: 100%;
        .list-scroll {
          height: 100%;
          overflow: hidden;
          .list-inner {
            padding: 0 30px;
            overflow: hidden;
          }
          .no-result-wrapper {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
    .search-result {
      position: fixed;
      top: 124px;
      bottom: 0;
      width: 100%;
    }
    .tip-title {
      text-align: center;
      padding: 18px 0;
      font-size: 0;
      .icon-ok {
        font-size: $font-size-medium;
        color: $color-theme;
        margin-right: 4px;
      }
      .text {
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
  }
</style>
