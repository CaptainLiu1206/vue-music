import 'common/scss/index.scss'
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import lazyLoad from 'vue-lazyload'

fastclick.attach(document.body)

Vue.config.productionTip = false

Vue.use(lazyLoad, {
  loading: require('./common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
