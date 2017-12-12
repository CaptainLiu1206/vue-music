<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll :data="shortcut" :refreshDelay="refreshDelay" ref="shortcut" class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotkey" @click="addQuery(item.k)">
                <span v-text="item.k"></span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="confirmShow"><i class="icon-clear"></i></span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest :query="query" ref="suggest" @select="saveSearch" :showSinger="showSinger"
               @listScroll="boxBlur"></suggest>
    </div>
    <router-view></router-view>
    <confirm ref="confirm" title="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Confirm from 'base/confirm/confirm'
  import Suggest from 'components/suggest/suggest'
  import { getHotKey } from 'api/search'
  import { ERR_OK } from 'api/config'
  import { playlistMixin, searchMixin } from 'common/js/mixin'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import { mapActions } from 'vuex'

  export default {
    mixins: [playlistMixin, searchMixin],
    data () {
      return {
        hotkey: [],
        showSinger: true
      }
    },
    computed: {
      shortcut () {
        return this.hotkey.concat(this.searchHistory)
      }
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Scroll,
      Confirm
    },
    created () {
      this._getHotKey()
    },
    methods: {
      handlePlaylist (playlist) {
        let bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      confirmShow () {
        this.$refs.confirm.show()
      },
      _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotkey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    watch: {
      query (newQuery) {
        if (!newQuery && this.searchHistory.length) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 200)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .search {
    .search-box-wrapper {
      margin: 20px;
    }
    .shortcut-wrapper {
      position: fixed;
      width: 100%;
      top: 178px;
      bottom: 0;
      .shortcut {
        height: 100%;
        overflow: hidden;
        .hot-key {
          margin: 0 20px 20px 20px;
          .title {
            margin-bottom: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .item {
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: $color-hightlight-background;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
        .search-history {
          position: relative;
          margin: 0 20px;
          .title {
            display: flex;
            align-items: center;
            height: 40px;
            font-size: $font-size-medium;
            color: $color-text-l;
            .text {
              flex: 1;
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
      }
    }
    .search-result {
      position: fixed;
      width: 100%;
      top: 178px;
      bottom: 0;
    }
  }
</style>
