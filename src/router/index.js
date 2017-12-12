import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'src/components/recommend/recommend'
// import Rank from 'src/components/rank/rank'
// import Singer from 'src/components/singer/singer'
// import Search from 'src/components/search/search'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'

const Recommend = () => import('src/components/recommend/recommend')
const Rank = () => import('src/components/rank/rank')
const Singer = () => import('src/components/singer/singer')
const Search = () => import('src/components/search/search')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')
const UserCenter = () => import('components/user-center/user-center')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
