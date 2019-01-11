// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Vuex from 'vuex'
import store from './vuex/store'
import IScrollView from 'vue-iscroll-view'
import IScroll from 'iscroll'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Toast from 'vue2-toast'
import VueVideoPlayer from 'vue-video-player'
import 'swiper/dist/css/swiper.css'
import './assets/scss/base.scss'
import 'vue2-toast/lib/toast.css'
import 'video.js/dist/video-js.css'

axios.defaults.withCredentials = true
Vue.config.productionTip = false

Vue.use(Toast, {
  type: 'center',
  duration: 2000,
  wordWrap: true
})
Vue.use(VueAxios, axios)
Vue.use(IScrollView, IScroll)
Vue.use(VueAwesomeSwiper)
Vue.use(Vuex)
Vue.use(VueVideoPlayer)

Vue.prototype.Url = 'https://h5.nyjun.com/wldw2019/index/'
Vue.prototype.Url2 = 'https://h5.nyjun.com/h5/wldw2019/static/php/'

// Vue.prototype.Url = 'http://localhost/tp5/public/index.php/wldw2019/index/'
// Vue.prototype.Url2 = 'http://localhost/wldw2019/static/php/'

Vue.prototype.isFudaoApp = function () {
  var REGEXP_FUDAO_APP = /EducationApp/
  if (typeof navigator !== 'undefined') {
    return REGEXP_FUDAO_APP.test(navigator.userAgent)
  }
  return false
}

Vue.prototype.hr = function (url) {
  var isFudaoApp = this.isFudaoApp()
  if (isFudaoApp) {
    window.mqq.invoke('edu', 'openAppPage', {
      url: 'tencentk12://openpage/webview?url=' + encodeURIComponent(url)
    })
  } else {
    window.location.href = url
  }
}

Vue.prototype.toShare = function (id) {
  let that = this
  var isFD = that.isFudaoApp()
  var fudaoapp = {}
  var AppMShareContent = {}
  var tit = [
    '辣么优秀有创意的作品，不来投个票麻！',
    '给这个低调的感恩小纸条投一票，我们就是homie了',
    '老铁，我正在参加创作大赛，就差你一票了！',
    '花式感恩小纸条暴风来袭，快来pick一下！',
    '花式表白的小纸条了解一下，投个票最好啦！',
    '感恩小纸条眉头一皱，发现还差你这票！'
  ]
  if (id) {
    var n = Math.floor(Math.random() * tit.length)
    var rt = tit[n]
    if (isFD) {
      fudaoapp = {
        title: rt,
        summary: '企鹅辅导感恩节微短文创作大赛，参与解锁感恩新姿势~',
        url: 'https://h5.nyjun.com/h5/ge2018/?id=' + id,
        coverImageUrl: 'https://h5.nyjun.com/h5/ge2018/static/img/share.png'
      }
      window.mqq.invoke('edu', 'interceptBackEvent', {'enable': 1})
      window.mqq.invoke('edu', 'setCenterTitle', {text: '感恩节创作大赛'})
      window.mqq.invoke('edu', 'setRightTitle', {
        enable: 1,
        imageIcon: 'https://9.url.cn/fudao/assets/images/shareBtnShadow_42019f5.png',
        imageIconDefault: 'https://9.url.cn/fudao/assets/images/shareBtnShadow_42019f5.png'
      })
      window.mqq.removeEventListener('rightTitleClicked')
      window.mqq.addEventListener('rightTitleClicked', function () {
        window.mqq.invoke('edu', 'showShareSelectDlg', fudaoapp)
      })
    } else {
      AppMShareContent = {
        title: rt,
        desc: '企鹅辅导感恩节微短文创作大赛，参与解锁感恩新姿势~',
        link: 'https://h5.nyjun.com/h5/ge2018/?id=' + id,
        imgUrl: 'https://h5.nyjun.com/h5/ge2018/static/img/share.png'
      }
      window.wx.ready(function () {
        window.wx.onMenuShareTimeline(AppMShareContent)
        window.wx.onMenuShareAppMessage(AppMShareContent)
        window.wx.onMenuShareQQ(AppMShareContent)
        window.wx.onMenuShareWeibo(AppMShareContent)
      })
      window.setShareInfo({
        title: rt,
        summary: '企鹅辅导感恩节微短文创作大赛，参与解锁感恩新姿势~',
        pic: 'https://h5.nyjun.com/h5/ge2018/static/img/share.png',
        url: 'https://h5.nyjun.com/h5/ge2018/?id=' + id
      })
    }
  } else {
    if (isFD) {
      fudaoapp = {
        title: '好多说不出口的感谢，就写张小纸条告诉TA吧',
        summary: '哪怕是一张简单的感恩小纸条，也能够带来直击心田的温暖~',
        url: 'https://h5.nyjun.com/h5/ge2018/',
        coverImageUrl: 'https://h5.nyjun.com/h5/ge2018/static/img/share.png'
      }
      window.mqq.invoke('edu', 'interceptBackEvent', {'enable': 1})
      window.mqq.invoke('edu', 'setCenterTitle', {text: '感恩节创作大赛'})
      window.mqq.invoke('edu', 'setRightTitle', {
        enable: 1,
        imageIcon: 'https://9.url.cn/fudao/assets/images/shareBtnShadow_42019f5.png',
        imageIconDefault: 'https://9.url.cn/fudao/assets/images/shareBtnShadow_42019f5.png'
      })
      window.mqq.removeEventListener('rightTitleClicked')
      window.mqq.addEventListener('rightTitleClicked', function () {
        window.mqq.invoke('edu', 'showShareSelectDlg', fudaoapp)
      })
    } else {
      AppMShareContent = {
        title: '好多说不出口的感谢，就写张小纸条告诉TA吧',
        desc: '哪怕是一张简单的感恩小纸条，也能够带来直击心田的温暖~',
        link: 'https://h5.nyjun.com/h5/ge2018/',
        imgUrl: 'https://h5.nyjun.com/h5/ge2018/static/img/share.png'
      }
      window.wx.ready(function () {
        window.wx.onMenuShareTimeline(AppMShareContent)
        window.wx.onMenuShareAppMessage(AppMShareContent)
        window.wx.onMenuShareQQ(AppMShareContent)
        window.wx.onMenuShareWeibo(AppMShareContent)
      })
      window.setShareInfo({
        title: '好多说不出口的感谢，就写张小纸条告诉TA吧',
        summary: '哪怕是一张简单的感恩小纸条，也能够带来直击心田的温暖',
        pic: 'https://h5.nyjun.com/h5/ge2018/static/img/share.png',
        url: 'https://h5.nyjun.com/h5/ge2018/'
      })
    }
  }
  function onBridgeReady () {
    window.WeixinJSBridge.call('hideToolbar')
  }
  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
    }
  } else {
    onBridgeReady()
  }
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
  var that = this
  var thiscookie = 'wuli_iszan_' + gindex
  var mapcookie = that.getCookie(thiscookie)
  if (mapcookie !== null && mapcookie !== '') {
    return false
  } else {
    return true
  }
}

Vue.prototype.checkcookie = function (gindex) {
  var that = this
  var thiscookie = 'wuli_iszan_' + gindex
  var mapcookie = that.getCookie(thiscookie)
  if (mapcookie !== null && mapcookie !== '') {
    return false
  } else {
    that.setCookie(thiscookie, thiscookie, 60)
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
