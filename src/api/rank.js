import jsonp from 'src/common/js/jsonp'
import { commonParams, options } from './config'

export const getTopList = function () {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  let data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export const getMusicList = function (topid) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  let data = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  })

  return jsonp(url, data, options)
}
