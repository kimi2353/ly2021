// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import VueAwesomeSwiper from 'vue-awesome-swiper'
import Vuex from 'vuex'
import store from './vuex/store'
import IScrollView from 'vue-iscroll-view'
import IScroll from 'iscroll/build/iscroll-probe.js'
import Toast from 'vue2-toast'
import VueVideoPlayer from 'vue-video-player'
import Vconsole from 'vconsole'
// import 'we-vue/lib/style.css'
// import 'swiper/dist/css/swiper.css'
import 'vue2-toast/lib/toast.css'
import 'video.js/dist/video-js.css'
import './assets/scss/base.scss'

// axios.defaults.withCredentials = true
Vue.config.productionTip = false

let vConsole = new Vconsole()
Vue.use(vConsole)
Vue.use(Toast, {
  type: 'center',
  duration: 2000,
  wordWrap: true
})
Vue.use(IScrollView, IScroll)
// Vue.use(VueAwesomeSwiper)
Vue.use(Vuex)
Vue.use(VueVideoPlayer)

Vue.prototype.Url = process.env.BASE_API
Vue.prototype.Url2 = process.env.BASE_API2

if (process.env.NODE_ENV === 'development') {
  window.Global.openid = 'ooOv6wF2ryLza2p9d4TkXoBTkZPQ1'
  window.Global.nickname = 'hj'
  // window.Global.unionid = 'oE5xYwDuCW_nLx6S3RpJkRgLFLe8'
  window.Global.unionid = 'oE5xYwHaDG3fjBnkOS5EDICKVFbQ'
  // window.Global.unionid = 'oE5xYwBW7pJYqTfV47JaRuJQHmHs'
  window.Global.headimgurl = 'http://thirdwx.qlogo.cn/mmopen/vi_32/IK7mxEHHmUkg7EmZcqruiblibBickEa24iazEeThiaFPvNyeJZrrqkvgFTjU4GJKFDPC7Aicc7p9ee7fbAeKb643JkEA/132'
} else {
  // if (window.Global.unionid === 'oE5xYwF0pCMeCjM2Rcrzh24nRZMM')
  // window.Global.openid = 'ooOv6wKk3PtMaNZR4n4z6evl-HYo'
  // window.Global.unionid = 'oE5xYwLLti_2hBQWeIBAMUZDkcNw'
  // window.Global.nickname = 'Molly'
  // window.Global.headimgurl = 'http://thirdwx.qlogo.cn/mmopen/vi_32/w6PB0WPSSfKNBTk6m6S18fG00DRnB1yqoaLkqueQ6vTiaDRcRia67iaUZHeoIC6SI5MhVUIhLpLomShibRlTMdxAFQ/132'
}

Vue.prototype.toShare = function (id, name, course) {
  const imgUrl = 'https://festival.codemao.cn/static/img/zy_share.png'
  let link = 'https://festival.codemao.cn/h5/sp2019'
  let title = '编程视频作业'
  let desc = '点击查看孩子视频作业，和老师的点评吧！'
  if (id) {
    link = 'https://festival.codemao.cn/h5/sp2019/?id=' + id
    title = '恭喜' + name + '完成了课程《' + course + '》的视频作业'
    desc = '点击查看孩子视频作业，和老师的点评吧！'
  }
  const AppMShareContent = {
    title,
    desc,
    link,
    imgUrl
  }
  // console.log(AppMShareContent)
  window.wx.ready(function () {
    window.wx.onMenuShareTimeline(AppMShareContent)
    window.wx.onMenuShareAppMessage(AppMShareContent)
    window.wx.onMenuShareQQ(AppMShareContent)
    window.wx.onMenuShareWeibo(AppMShareContent)
  })
}

Vue.prototype.changeTitle = function (txt) {
  document.title = txt
}

Vue.prototype.getQueryString = function (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var result = window.location.search.substr(1).match(reg)
  if (result !== null) {
    return decodeURIComponent(result[2])
  } else {
    return null
  }
}

Vue.prototype.inputBlur = function () {
  window.scrollTo(0, 0)
}

Vue.prototype.setCookie = function (cName, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = cName + '=' + escape(value) + ((expiredays === null) ? '' : ';expires=' + exdate.toGMTString())
}

Vue.prototype.getCookie = function (cName) {
  if (document.cookie.length > 0) {
    var cStart = document.cookie.indexOf(cName + '=')
    var cEnd
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) {
        cEnd = document.cookie.length
      }
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}

Vue.prototype.clearCookie = function (name) {
  this.setCookie(name, '', -1)
}

Vue.prototype.checkzan = function (gindex) {
  const that = this
  const thiscookie = 'sp_iszan_' + gindex
  // console.log(thiscookie)
  const mapcookie = that.getCookie(thiscookie)
  if (mapcookie !== null && mapcookie !== '') {
    return false
  } else {
    return true
  }
}

Vue.prototype.checkcookie = function (gindex) {
  const that = this
  const thiscookie = 'sp_iszan_' + gindex
  const mapcookie = that.getCookie(thiscookie)
  if (mapcookie !== null && mapcookie !== '') {
    return false
  } else {
    that.setCookie(thiscookie, thiscookie, 99)
    return true
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
