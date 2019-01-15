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

// Vue.prototype.Url = 'https://h5.nyjun.com/wldw2019/index/'
// Vue.prototype.Url2 = 'https://h5.nyjun.com/h5/wldw2019/static/php/'

Vue.prototype.Url = 'http://localhost/tp5/public/index.php/wldw2019/index/'
Vue.prototype.Url2 = 'http://localhost/wldw2019/static/php/'

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

Vue.prototype.toShare = function (id, username) {
  let that = this
  let isFD = that.isFudaoApp()
  let fudaoapp = {}
  let AppMShareContent = {}
  let imgurl = 'https://h5.nyjun.com/static/img/wl_share.jpg'
  let weburl = 'https://h5.nyjun.com/h5/wldw2019/'
  let tit = [
    {
      title: '这是' + username + '酷炫的物理实验作品！快来投票吧！',
      summary: '第一届企鹅辅导物理实验大赛开始报名啦！动动手指，一起玩转物理！'
    },
    {
      title: '谁是物理实验王？等你来投票，请支持' + username + '！',
      summary: '2019企鹅辅导物理实验大赛火爆来袭！实验王者宝座，虚位以待。'
    },
    {
      title: '嗨，快来为' + username + '酷炫的物理实验作品投票吧！',
      summary: '2019企鹅辅导物理实验大赛火热进行中！做好准备，赢取属于你的荣耀！'
    }
  ]
  let tit1 = [
    {
      title: '玩好物理正当时，物理实验王，C位就是你！',
      summary: '2019企鹅辅导物理实验大赛重磅来袭！喜欢动手动脑的你准备好了么？'
    },
    {
      title: '想捍卫物理实验的王者地位？就看你的了！',
      summary: '2019企鹅辅导物理实验大赛强势来袭！让我们一起见证最强王者的诞生！'
    },
    {
      title: '快来，2019最炫酷好玩的物理实验比赛在这里！',
      summary: '第一届企鹅辅导物理实验大赛热力开赛！是时候展现你真正的技术了！'
    }
  ]
  if (id) {
    let n = Math.floor(Math.random() * tit.length)
    let rt = tit[n].title
    let rs = tit[n].summary
    if (isFD) {
      fudaoapp = {
        title: rt,
        summary: rs,
        url: weburl + '?id=' + id,
        coverImageUrl: imgurl
      }
      window.mqq.invoke('edu', 'interceptBackEvent', {'enable': 1})
      window.mqq.invoke('edu', 'setCenterTitle', {text: '物理实验王'})
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
        desc: rs,
        link: weburl + '?id=' + id,
        imgUrl: imgurl
      }
      window.wx.ready(function () {
        window.wx.onMenuShareTimeline(AppMShareContent)
        window.wx.onMenuShareAppMessage(AppMShareContent)
        window.wx.onMenuShareQQ(AppMShareContent)
        window.wx.onMenuShareWeibo(AppMShareContent)
      })
      window.setShareInfo({
        title: rt,
        summary: rs,
        pic: imgurl,
        url: weburl + '?id=' + id
      })
    }
  } else {
    let n = Math.floor(Math.random() * tit1.length)
    let rt = tit1[n].title
    let rs = tit1[n].summary
    if (isFD) {
      fudaoapp = {
        title: rt,
        summary: rs,
        url: weburl,
        coverImageUrl: imgurl
      }
      window.mqq.invoke('edu', 'interceptBackEvent', {'enable': 1})
      window.mqq.invoke('edu', 'setCenterTitle', {text: '物理实验王'})
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
        desc: rs,
        link: weburl,
        imgUrl: imgurl
      }
      window.wx.ready(function () {
        window.wx.onMenuShareTimeline(AppMShareContent)
        window.wx.onMenuShareAppMessage(AppMShareContent)
        window.wx.onMenuShareQQ(AppMShareContent)
        window.wx.onMenuShareWeibo(AppMShareContent)
      })
      window.setShareInfo({
        title: rt,
        summary: rs,
        pic: imgurl,
        url: weburl
      })
    }
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
