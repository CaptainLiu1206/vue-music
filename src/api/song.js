import { commonParams } from './config'
import axios from 'axios'

export function getLyric (mid) {
  let url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    pcachetime: +new Date(),
    callback: 'MusicJsonCallback_lrc',
    jsonpCallback: 'MusicJsonCallback_lrc',
    loginUin: 0,
    notice: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
