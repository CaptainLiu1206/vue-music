<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" ref="box" v-model="query" :placeholder="placeholder">
    <i @click="clear" class="icon-dismiss" v-show="query"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data () {
      return {
        query: ''
      }
    },
    created () {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 400))
    },
    methods: {
      clear () {
        this.query = ''
      },
      setQuery (query) {
        this.query = query
      },
      setBlur () {
        this.$refs.box.blur()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";

  .search-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: $color-hightlight-background;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-background;
    }
    .box {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-hightlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      border: none;
      // outline: none;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-background;
    }
  }
</style>
