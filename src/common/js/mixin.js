import { mapGetters, mapMutations, mapActions } from 'vuex'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    playModIcon () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'mode',
      'sequencelist',
      'currentSong',
      'playlist',
      'favoriteList'
    ])
  },
  methods: {
    changeMode () {
      let currentMode = (this.mode + 1) % 3
      this.setPlayMode(currentMode)
      let list = null
      if (currentMode === playMode.random) {
        list = shuffle(this.sequencelist)
      } else {
        list = this.sequencelist
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let newCurrentIndex = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(newCurrentIndex)
    },
    getFavoriteIcon (item) {
      return this.checkIsFovorite(item) ? 'icon-favorite' : 'icon-not-favorite'
    },
    toggleFavorite (song) {
      if (this.checkIsFovorite(song)) {
        this.deleteFavoriteSong(song)
      } else {
        this.saveFavoriteSong(song)
      }
    },
    checkIsFovorite (item) {
      let index = this.favoriteList.findIndex((song) => {
        return item.id === song.id
      })
      return index >= 0
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    ...mapActions([
      'saveFavoriteSong',
      'deleteFavoriteSong'
    ])
  }
}

export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 200
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query.trim())
    },
    onQueryChange (query) {
      this.query = query
    },
    boxBlur () {
      this.$refs.searchBox.setBlur()
    },
    ...mapActions([
      'deleteSearchHistory',
      'saveSearchHistory'
    ])
  }
}
