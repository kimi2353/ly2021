<template>
  <div id="app">
    <transition name="fade" v-show='fade' mode="out-in">
      <div :is='moban' ref='moban' @slideto='slideto' @init='init' @sgpgfn='sgpgfn' @sgbtnfn="sgbtnfn"></div>
    </transition>
  </div>
</template>

<script>
import pg1 from './components/pg1'
import { sgpgfn, sgbtnfn } from '@/api/login'

export default {
  name: 'App',
  components: {
    pg1
  },
  data () {
    return {
      moban: 'pg1',
      fade: true
    }
  },
  mounted () {
    const that = this
    that.init()
  },
  methods: {
    sgbtnfn (element) {
      const that = this
      const utmSource = that.getQueryString('utm_source')
      const utmContent = that.getQueryString('utm_content')
      const utmTerm = that.getQueryString('utm_term')
      const data = {
        ...element,
        openid: window.Global.openid,
        nickname: window.Global.nickname,
        headimgurl: window.Global.headimgurl,
        unionid: window.Global.unionid,
        utm_source: utmSource,
        utm_content: utmContent,
        utm_term: utmTerm
      }
      sgbtnfn(data)
    },
    sgpgfn (element) {
      const that = this
      const utmSource = that.getQueryString('utm_source')
      const utmContent = that.getQueryString('utm_content')
      const utmTerm = that.getQueryString('utm_term')
      const data = {
        ...element,
        openid: window.Global.openid,
        nickname: window.Global.nickname,
        headimgurl: window.Global.headimgurl,
        unionid: window.Global.unionid,
        utm_source: utmSource,
        utm_content: utmContent,
        utm_term: utmTerm
      }
      sgpgfn(data)
    },
    init () {
    },
    slideto (res) {
      const that = this
      that.fade = false
      if (res) {
        that.moban = 'pg' + res
      }
      that.fadefn()
    },
    fadefn () {
      const that = this
      setTimeout(function () {
        that.fade = true
      }, 1200)
    }
  }
}
</script>

<style>
</style>
