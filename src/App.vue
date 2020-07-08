<template>
  <div id="app">
    <transition name="fade" v-show='fade' mode="out-in">
      <div :is='moban' ref='moban' @slideto='slideto' @createImg='createImg' @btnInfo='btnInfo' @pageInfo='pageInfo'/>
    </transition>
    <div class='shadow'></div>
    <div class='model' id='model'>
      <div class="model_border" v-for="(item, index) in haiinfo" :key="index" v-show="index==haiindex">
        <img :src="item.img" class='zj_model'>
        <!-- <img src="/static/img/0_work_l2ffm1s3c1f_1587552153000.png" class='zj_model'> -->
        <img :src='headurl' v-if='headurl!==""' class='headurl'>
        <div class="qrcode">
          <img :src='item.qrurl'>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { checkShenheInfo } from '@/api/login'
import pg1 from './components/pg1'
import pg2 from './components/pg2'
import pg3 from './components/pg3'
import pg4 from './components/pg4'
import { btnInfo, pageInfofn } from '@/api/login'

export default {
  name: 'App',
  components: {
    pg1,
    pg2,
    pg3,
    pg4
  },
  computed: {
    user_id () {
      return this.$store.state.user_id
    },
    package_id () {
      return this.$store.state.package_id
    },
    haiinfo () {
      return this.$store.state.haiinfo
    }
  },
  data () {
    return {
      moban: 'pg1',
      fade: true,
      headurl: '',
      haiindex: 0
    }
  },
  mounted () {
    const that = this
    that.headurl = process.env.IMG_URL + 'zjuser/' + window.Global.openid + '.jpg'
    that.init()
  },
  methods: {
    btnInfo (element) {
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
        utm_term: utmTerm,
        user_id: that.user_id,
        package_id: that.package_id
      }
      btnInfo(data)
    },
    pageInfo (pagename) {
      const that = this
      const utmSource = that.getQueryString('utm_source')
      const utmContent = that.getQueryString('utm_content')
      const utmTerm = that.getQueryString('utm_term')
      const data = {
        page_name: pagename,
        openid: window.Global.openid,
        nickname: window.Global.nickname,
        headimgurl: window.Global.headimgurl,
        unionid: window.Global.unionid,
        utm_source: utmSource,
        utm_content: utmContent,
        utm_term: utmTerm,
        user_id: that.user_id,
        package_id: that.package_id
      }
      pageInfofn(data)
    },
    init () {
      const that = this
      const id = that.getQueryString('id')
      that.$store.commit('uId', id)
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
    },
    html2Canvas () {
      const that = this
      const shareContent = document.querySelector('#model')
      const width = shareContent.clientWidth
      const height = shareContent.clientHeight
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const scaleBy = 3
      canvas.width = width * scaleBy
      canvas.height = height * scaleBy
      context.scale(scaleBy, scaleBy)

      const opts = {
        allowTaint: true,
        tainttest: false,
        canvas: canvas,
        width: width * scaleBy,
        height: height * scaleBy,
        onrendered: function (canvas) {
          canvas.id = 'mycanvas'
          const dataUrl = canvas.toDataURL()
          that.haiinfo[that.haiindex].model = dataUrl
          // console.log(dataUrl)
          if (that.haiindex < that.haiinfo.length - 1) {
            that.haiindex++
            setTimeout(() => {
              that.html2Canvas(that.haiindex)
            }, 200)
          } else {
            that.$loading.close()
            that.$store.commit('uHaiinfo', that.haiinfo)
            that.moban = 'pg4'
          }
        }
      }
      window.html2canvas(shareContent, opts)
    },
    createImg () {
      const that = this
      // that.haiinfo = haiinfo
      // console.log(that.haiinfo)
      that.$loading('海报生成中...')
      that.haiindex = 0
      setTimeout(() => {
        that.html2Canvas(that.haiindex)
      }, 500)
    }
  }
}
</script>

<style>
</style>
