<template>
  <div class="pg1 pg4 home">
    <div class='haiinfo'>
      <div class="p4_btn1" @click="toPage(2)">返回</div>
      <div v-if="user_id&&res.lbtn" class="lout lout2" @click="tologout">登出</div>
      <div class='swiperborder2' v-if='haiinfo.length>0'>
        <swiper :options="haiinfo.length > 1 ? swiperOption2 : swiperOption3" ref="mySwiper">
          <swiper-slide v-for='(item, index) in haiinfo' :key='index'>
            <img :src='item.model' class='tupian' v-if='item.model!==""' @touchstart="gotouchstart(item)" @touchmove="gotouchmove(item)" @touchend="gotouchend(item)">
          </swiper-slide>
          <!-- <div class="swiper-pagination"  slot="pagination"></div> -->
        </swiper>
      </div>
      <span class='tu_txt2' style='font-weight: 600;'>长按海报保存到本地</span>
      <div class='pic_nav_an' @click='copyfn' >获取邀请推荐语</div>
    </div>
    <div class="p4_main2">
      <img src="@/assets/img/demo.jpg" class='demo'>
    </div>
    <div class='nav' v-show='copyshow'>
      <div class='copytxt'>
        <div class='copy_tit'>贴心的推荐语提高成功率</div>
        <p>{{ sys }}</p>
        <i class="changeSys" @click="changeSys" v-show="syslist.length>1">换一个</i>
        <div class='nav_an' v-clipboard:copy="sys" v-clipboard:success="onCopy" v-clipboard:error="onError" >点击复制推荐语</div>
      </div>
      <div class='close_copy' @click='copyshow=false'></div>
    </div>
  </div>
</template>

<script>
import { alluserback } from '@/api/login'
import { Toast } from 'vant'
import * as iris from '@cmao/iris'
const Base64 = require('js-base64').Base64
// import { copySys, longTap } from '@/api/login'
// import { Toast } from 'vant'

export default {
  name: 'pg4',
  computed: {
    res () {
      return this.$store.state.res
    },
    user_id () {
      return this.$store.state.user_id
    },
    haiinfo () {
      return this.$store.state.haiinfo
    },
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  data () {
    return {
      nopay: false,
      paylist: false,
      list: [],
      copyshow: false,
      swiperOption2: {
        effect: 'coverflow',
        slidesPerView: 1.5,
        centeredSlides: true,
        pagination: {
          el: '.swiper-pagination'
        }
      },
      swiperOption3: {
        pagination: {
          el: '.swiper-pagination'
        }
      },
      sysindex: 0,
      syslist: [],
      sys: '',
      timeOutEvent: null,
      lbtn: true,
      codemaoCaptcha: null,
      CodemaoAuth: null,
      pid: 'UvOFXx2tfv'
    }
  },
  mounted () {
    const that = this
    that.sysindex = 0
    if (that.haiinfo.length <= 1) {
      that.swiperOption2.centeredSlides = false
    }
    const pagename = '海报邀请页'
    that.$emit('pageInfo', pagename)
    iris.init({
      env: process.env.IRIS,
      domain: ''
    })
    iris.auth.init({
      pid: that.pid,
      product_code: 'kids',
      platform: 'h5'
    })
    that.codemaoCaptcha = new iris.captcha.CodemaoCaptcha({
      pid: that.pid
    })
    that.CodemaoAuth = iris.auth.get_auth_instance()
  },
  methods: {
    async tologout () {
      const that = this
      alluserback({
        'unionid': window.Global.unionid
      })
      try {
        await that.CodemaoAuth.logout().cache(e => {
          console.log(e)
        })
      } catch (e) {
        console.log(e)
      }
      const toback = Base64.encode(window.location.href + '&back=back')
      setTimeout(() => {
        window.location.href = this.res.boundPhoneUrl2 + toback
      }, 200)
    },
    gotouchstart (item) {
      const that = this
      if (that.timeOutEvent) {
        clearTimeout(that.timeOutEvent)
      }
      that.timeOutEvent = null
      that.timeOutEvent = setTimeout(function () {
        const bp = {
          'element': '长按识别',
          'page_name': '海报邀请页'
        }
        that.$emit('btnInfo', bp)
      }, 700)
    },
    gotouchend () {
      const that = this
      clearTimeout(that.timeOutEvent)
      if (!that.timeOutEvent) {
        that.timeOutEvent = null
      }
    },
    gotouchmove () {
      const that = this
      if (that.timeOutEvent) {
        clearTimeout(that.timeOutEvent)
        that.timeOutEvent = null
      }
    },
    onCopy () {
      const that = this
      const bp = {
        'element': '复制邀请语',
        'page_name': '海报邀请页'
      }
      that.$emit('btnInfo', bp)
      Toast('复制成功')
    },
    onError () {
      Toast('您的浏览器不支持该复制操作')
    },
    toPage (i) {
      const that = this
      that.$emit('slideto', i)
    },
    copyfn () {
      const that = this
      // console.log(that.swiper.activeIndex)
      that.sysindex = 0
      that.syslist = that.haiinfo[that.swiper.activeIndex].sys
      if (that.syslist.length > 0) {
        that.sys = that.syslist[that.sysindex]
      } else {
        that.sys = ''
      }
      const bp = {
        'element': '获取邀请语',
        'page_name': '海报邀请页'
      }
      that.$emit('btnInfo', bp)
      that.copyshow = true
    },
    changeSys () {
      const that = this
      // that.sysindex = 0
      if (that.syslist.length - 1 > that.sysindex) {
        that.sysindex++
      } else {
        that.sysindex = 0
      }
      that.sys = that.syslist[that.sysindex]
    }
  }
}
</script>

<style>
</style>
