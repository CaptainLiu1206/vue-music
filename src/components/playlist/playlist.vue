<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="playModIcon" @click="changeMode"></i>
            <span class="text">{{getModeDesc}}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" :data="sequencelist" class="list-content">
          <transition-group tag="ul" ref="list" name="list">
            <li :key="song.id" ref="item" @click="selectItem(song, index)" class="item"
                v-for="(song,index) in sequencelist">
              <i class="current" :class="[currentSong.id===song.id?'icon-play': '']"></i>
              <span class="text">{{song.name}}</span>
              <span class="like" @click.stop="toggleFavorite(song)">
                <i :class="getFavoriteIcon(song)"></i>
              </span>
              <span class="delete" @click.stop="deleteSong(song)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" title="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import { playMode } from 'common/js/config'
  import { mapActions, mapMutations } from 'vuex'
  import { playerMixin } from 'common/js/mixin'
  import AddSong from 'components/add-song/add-song'

  export default {
    mixins: [playerMixin],
    data () {
      return {
        showFlag: false
      }
    },
    computed: {
      getModeDesc () {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      }
    },
    methods: {
      showAddSong () {
        this.$refs.addSong.show()
      },
      show () {
        this.showFlag = true
        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent(this.currentSong)
        }, 20)
      },
      hide () {
        this.showFlag = false
      },
      showConfirm () {
        this.$refs.confirm.show()
      },
      confirmClear () {
        this.clearSong()
        this.hide()
      },
      selectItem (song, index) {
        if (this.mode === playMode.random) {
          index = this.playlist.findIndex((item) => {
            return item.id === song.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayState(true)
      },
      scrollToCurrent (currentSong) {
        let index = this.sequencelist.findIndex((item) => {
          return currentSong.id === item.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
      },
      ...mapActions([
        'deleteSong',
        'clearSong'
      ]),
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayState: 'SET_PLAY_STATE'
      })
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        setTimeout(() => {
          this.scrollToCurrent(newSong)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity 0.3s;
      .list-wrapper {
        transition: all 0.3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0)
      }
    }
    .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background: $color-hightlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 30px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click;
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          &.list-enter-active, &.list-leave-active {
            transition: all 0.1s;
          }
          &.list-enter, &list-leave-to {
            height: 0;
          }
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .like {
            @include extend-click;
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click;
            font-size: $font-size-small;
            color: $color-theme;
          }
        }
      }
      .list-operate {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
