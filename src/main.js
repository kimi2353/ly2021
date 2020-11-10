// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import store from './vuex/store'
import Toast from 'vue2-toast'
import Vant from 'vant'
import 'vant/lib/index.css'
// import Vconsole from 'vconsole'
// import 'we-vue/lib/style.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueClipboard from 'vue-clipboard2'
import 'swiper/dist/css/swiper.css'
import 'vue2-toast/lib/toast.css'
import './assets/scss/base.scss'
import { btnInfo } from '@/api/login'

Vue.config.productionTip = false
// let vConsole = new Vconsole()
// Vue.use(vConsole)
Vue.use(Toast, {
  type: 'center',
  duration: 2000,
  wordWrap: true
})
Vue.use(VueClipboard)
Vue.use(VueAwesomeSwiper)
Vue.use(Vant)
Vue.use(Vuex)

if (process.env.NODE_ENV === 'development') {
  window.Global.openid = 'ooOv6wF2ryLza2p9d4TkXoBTkZPQ'
  window.Global.nickname = 'hj'
  // window.Global.unionid = 'oE5xYwDuCW_nLx6S3RpJkRgLFLe8'
  window.Global.unionid = 'oE5xYwF0pCMeCjM2Rcrzh24nRZMM'
  // window.Global.unionid = 'oE5xYwBW7pJYqTfV47JaRuJQHmHs'
  window.Global.headimgurl = 'http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELia5d3yhhnPrqfG0RC7sDqTsryX19ghe6mMJznic4KxGwgktCZ1WIiaiceK1unfoXhuFDibIuGlSGn2Lw/132'
} else {
  // if (window.Global.unionid === 'oE5xYwF0pCMeCjM2Rcrzh24nRZMM')
  // window.Global.openid = 'ooOv6wKk3PtMaNZR4n4z6evl-HYo'
  // window.Global.unionid = 'oE5xYwLLti_2hBQWeIBAMUZDkcNw'
  // window.Global.nickname = 'Molly'
  // window.Global.headimgurl = 'http://thirdwx.qlogo.cn/mmopen/vi_32/w6PB0WPSSfKNBTk6m6S18fG00DRnB1yqoaLkqueQ6vTiaDRcRia67iaUZHeoIC6SI5MhVUIhLpLomShibRlTMdxAFQ/132'
}

Vue.prototype.btnInfo = function (element) {
  const that = this
  // console.log(that)
  const utmSource = that.getQueryString('utm_source')
  const utmMedium = that.getQueryString('utm_content')
  const utmTerm = that.getQueryString('utm_term')
  const data = {
    ...element,
    openid: window.Global.openid,
    nickname: window.Global.nickname,
    headimgurl: window.Global.headimgurl,
    unionid: window.Global.unionid,
    utm_source: utmSource,
    utm_content: utmMedium,
    utm_term: utmTerm,
    user_id: that.user_id,
    package_id: that.package_id
  }
  btnInfo(data)
  // console.log(data)
}

Vue.prototype.toShare = function (id, sharetit, sharedec) {
  const that = this
  if (!sharetit) {
    sharetit = '我正在参与编程猫分享海报活动'
  }
  if (!sharedec) {
    sharedec = '参与活动有免费精品编程课赠送，更有千元返现等你来拿！'
  }
  if (!id) {
    id = ''
  }
  const AppMShareContent = {
    title: sharetit,
    desc: sharedec,
    link: 'https://festival.codemao.cn/h5/sh2020?id=' + id,
    imgUrl: 'https://festival.codemao.cn/static/img/sh_share.png'
  }
  // console.log(AppMShareContent)
  window.wx.ready(function () {
    window.wx.onMenuShareTimeline({
      ...AppMShareContent,
      success: () => {
        const bp = {
          'element': '分享到朋友圈',
          'page_name': '分享'
        }
        that.btnInfo(bp)
      }
    })
    window.wx.onMenuShareAppMessage({
      ...AppMShareContent,
      success: () => {
        const bp = {
          'element': '分享到微信好友',
          'page_name': '分享'
        }
        that.btnInfo(bp)
      }
    })
    window.wx.onMenuShareQQ({
      ...AppMShareContent,
      success: () => {
        const bp = {
          'element': '分享到QQ',
          'page_name': '分享'
        }
        that.btnInfo(bp)
      }
    })
    window.wx.onMenuShareWeibo({
      ...AppMShareContent,
      success: () => {
        const bp = {
          'element': '分享到微博',
          'page_name': '分享'
        }
        that.btnInfo(bp)
      }
    })
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
