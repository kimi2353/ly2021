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
// import VueVideoPlayer from 'vue-video-player'
// import Vconsole from 'vconsole'
// import 'we-vue/lib/style.css'
// import 'swiper/dist/css/swiper.css'
import VueClipboard from 'vue-clipboard2'
import scroll from 'vue-seamless-scroll'
import 'vue2-toast/lib/toast.css'
// import 'video.js/dist/video-js.css'
import './assets/scss/base.scss'

// axios.defaults.withCredentials = true
Vue.config.productionTip = false

// let vConsole = new Vconsole()
// Vue.use(vConsole)
Vue.use(Toast, {
  type: 'center',
  duration: 2000,
  wordWrap: true
})
Vue.use(scroll)
Vue.use(IScrollView, IScroll)
// Vue.use(VueAwesomeSwiper)
Vue.use(VueClipboard)
Vue.use(Vuex)
// Vue.use(VueVideoPlayer)

// Vue.prototype.Url = process.env.BASE_API
// Vue.prototype.Url2 = process.env.BASE_API2

if (process.env.NODE_ENV === 'development') {
  window.Global.openid = 'ooOv6wL7fegrOthzfjVTY1k-exEw'
  window.Global.nickname = '晓棠'
  // window.Global.unionid = 'oE5xYwDuCW_nLx6S3RpJkRgLFLe8'
  window.Global.unionid = 'oE5xYwKyStCDMbVkfxcDBdU_u5tw' //
  // window.Global.unionid = 'oE5xYwBW7pJYqTfV47JaRuJQHmHs'
  window.Global.headimgurl = 'http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELia5d3yhhnPrqfG0RC7sDqTsryX19ghe6mMJznic4KxGwgktCZ1WIiaiceK1unfoXhuFDibIuGlSGn2Lw/132'
}

Vue.prototype.toShare = function (id, utmsource, utmmedium, utmterm) {
  if (!id) {
    id = ''
  }
  let sharetit = '时光机开启中'
  let sharedec = ''
  const AppMShareContent = {
    title: sharetit,
    desc: sharedec,
    link: 'https://festival.codemao.cn/h5/ly2021?id=' + id + 'utm_source=' + utmsource + '&utm_medium=' + utmmedium + '&utm_term=' + utmterm,
    imgUrl: 'https://festival.codemao.cn/static/img/ly6.jpg'
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
  const thiscookie = 'ly_iszan_' + gindex
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
  const thiscookie = 'ly_iszan_' + gindex
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
