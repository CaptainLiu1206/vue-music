<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import MusicList from 'components/music-list/music-list'
  import { getMusicList } from 'api/rank'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/Song'

  export default {
    data () {
      return {
        songs: [],
        rank: true
      }
    },
    created () {
      this._getMusicList()
    },
    methods: {
      _getMusicList () {
        if (!this.topList.id) {
          this.$router.push({
            path: '/rank'
          })
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalLizeSong(res.songlist)
          }
        })
      },
      _normalLizeSong (list) {
        let ret = []
        list.forEach((music) => {
          let musicData = music.data
          if (musicData.albummid && musicData.songid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    computed: {
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="scss">
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s ease;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
