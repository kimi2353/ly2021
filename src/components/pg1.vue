<template>
  <div class='pg1'>
    <div class="pg1_main">
      <img style="display:block;width: 100%;" src="@/assets/img/sh_banner.jpg" />
      <!-- v-if="user_id&&lbtn" -->
      <div v-if="user_id&&lbtn" class="lout" @click="tologout">登出</div>
      <div class="pg1_info">
        <img v-if="user_id" :src="headimgurl" class="headimgurl">
        <span v-if="user_id" class="nickname">{{ nickname }}</span>
        <van-button v-if="!user_id" :loading="loading" type="primary" size="small" @click="tologin(1)">点击登录</van-button>
        <span class="pg1_txt1" @click="upmenu">上传记录</span>
      </div>
      <ul class="list">
        <li v-for="(item, index) in slist" :key="index" @click="totab(item)">
          <img :src="'https://static-k12edu-camprecord.codemao.cn/' + item.banner">
          <div class="tag tag1" v-if="item.tag==='未开始'">{{ item.tag }}</div>
          <div class="tag tag2" v-else-if="item.tag==='进行中'">{{ item.tag }}</div>
          <div class="tag tag3" v-else-if="item.tag==='已结束'">{{ item.tag }}</div>
          <!-- <van-tag class="tag2">活动时间：{{format(item.begin)}} - {{format(item.end)}}</van-tag> -->
          <!-- <van-tag :type="item.tag==='进行中'?'success':(item.tag==='未开始'?'warning':(item.tag==='已结束'?'danger':''))" class="tag">{{ item.tag }}</van-tag> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { checkShenheInfo, checkShenheMsg, alluserback } from '@/api/login'
import { Toast } from 'vant'
import * as iris from '@cmao/iris'
const Base64 = require('js-base64').Base64
// import { Image as VanImage, Cell, CellGroup } from 'vant'
// import { Cell, CellGroup } from 'vant'
export default {
  name: 'pg1',
  data () {
    return {
      headimgurl: '',
      nickname: '',
      slist: [],
      now: 0,
      loading: true,
      lbtn: false,
      codemaoCaptcha: null,
      CodemaoAuth: null,
      pid: 'UvOFXx2tfv'
    }
  },
  computed: {
    user_id () {
      return this.$store.state.user_id
    },
    package_id () {
      return this.$store.state.package_id
    },
    id () {
      return this.$store.state.id
    }
  },
  mounted () {
    const that = this
    that.nickname = window.Global.nickname
    that.headimgurl = window.Global.headimgurl
    document.title = '编程猫宣传官'
    const pagename = '编程猫宣传官首页'
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
    that.ready()
  },
  methods: {
    upmenu () {
      const that = this
      const bp = {
        'element': '上传记录',
        'page_name': '编程猫宣传官首页'
      }
      that.$emit('btnInfo', bp)
      if (!that.user_id) {
        that.tologin()
      } else {
        that.slideto(3)
      }
    },
    totab (item) {
      const that = this
      if (!that.user_id) {
        that.tologin()
        return
      }
      const bp = {
        'element': item.remark + '项目Tab',
        'page_name': '编程猫宣传官首页'
      }
      that.$emit('btnInfo', bp)
      if (item.tag === '未开始') {
        Toast('项目还未开始，参与其他项目吧')
      } else if (item.tag === '进行中' || item.tag === '已结束') {
        const data = {
          unionid: window.Global.unionid,
          user_id: that.user_id,
          sid: item.id,
          package_id: that.package_id
        }
        that.$loading('加载中...')
        checkShenheMsg(data).then(res => {
          // console.log(res)
          that.$loading.close()
          if (res.res === 'error') {
            Toast('系统错误，请刷新重试')
          } else if (res.res === 'package_id') {
            Toast('尚未购课，购买课程后即可参与活动')
          } else if (res.res === 'success') {
            if (res.package_id) {
              that.$store.commit('uPackageId', res.package_id)
            }
            that.$store.commit('uSid', item.id)
            that.slideto('2')
          } else if (res.res === 'time') {
            Toast('项目已结束')
          }
        })
      }
    },
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
        window.location.href = this.boundPhoneUrl2 + toback
      }, 200)
      that.$store.commit('uUserId', '')
    },
    tologin () {
      const toback = Base64.encode(window.location.href + '&back=back')
      setTimeout(() => {
        window.location.href = this.boundPhoneUrl2 + toback
      }, 200)
    },
    async ready () {
      const that = this
      try {
        await that.CodemaoAuth.get_profile().then(res => {
          console.log(res)
          // data['userId'] = res.id
          that.init(res.data.id)
        }).cache(e => {
          that.init()
        })
      } catch (e) {
        console.log(e)
        that.init()
      }
    },
    init (userId) {
      const that = this
      // const userId = that.getQueryString('user_id')
      const utmContent = that.getQueryString('utm_content')
      const utmTerm = that.getQueryString('utm_term')
      const utmSource = that.getQueryString('utm_source')
      const back = that.getQueryString('back')
      const data = {
        openid: window.Global.openid,
        unionid: window.Global.unionid,
        headimgurl: window.Global.headimgurl,
        nickname: window.Global.nickname,
        userId,
        utm_content: utmContent,
        utm_term: utmTerm,
        utm_source: utmSource,
        back
      }
      if (back === 'back') {
        window.history.replaceState(null, document.title, this.funcUrlDel('back'))
      }
      checkShenheInfo(data).then(res => {
        // console.log(res)
        that.$store.commit('uRes', res)
        if (res.res === 'success') {
          that.loading = false
          that.lbtn = res.lbtn
          that.$store.commit('uPackageId', res.package_id)
          that.$store.commit('uUserId', res.user_id)
          that.boundPhoneUrl2 = res.boundPhoneUrl2
          that.now = res.now
          for (let i = 0; i < res.shenhe.length; i++) {
            res.shenhe[i].tag = that.fmt(res.shenhe[i].begin, res.shenhe[i].end)
          }
          that.slist = res.shenhe
          that.toShare()
          if (that.user_id && that.id) {
            for (let i = 0; i < that.slist.length; i++) {
              if (that.id == that.slist[i].id) { // eslint-disable-line
                that.$store.commit('uId', '')
                that.totab(that.slist[i])
                break
              }
            }
            that.$store.commit('uId', '')
          }
        } else if (res.res === 'phone') {
          const toback = Base64.encode(window.location.href + '&back=back')
          console.log(toback)
          // window.history.replaceState(null, document.title, window.location.href + '&back=back1')
          // window.location.href = res.url + toback
        }
      })
    },
    funcUrlDel (name) {
      var loca = window.location
      var baseUrl = loca.origin + loca.pathname + '?'
      var query = loca.search.substr(1)
      if (query.indexOf(name) > -1) {
        var obj = {}
        var arr = query.split('&')
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].split('=')
          obj[arr[i][0]] = arr[i][1]
        }
        delete obj[name]
        var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&') //eslint-disable-line
        return url
      }
    },
    slideto (res) {
      const that = this
      that.$emit('slideto', res)
    },
    fmt (begin, end) {
      const that = this
      if (that.now < begin) {
        return '未开始'
      } else if (that.now > end) {
        return '已结束'
      } else if (that.now >= begin && that.now <= end) {
        return '进行中'
      }
      return ''
    },
    format (shijianchuo) {
      if (!shijianchuo) {
        return ''
      }
      const time = new Date(shijianchuo * 1000)
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      // const h = time.getHours()
      // const mm = time.getMinutes()
      // const s = time.getSeconds()
      function shi (s) {
        s = '' + s
        if (s.length < 2) {
          s = '0' + s
        }
        return s
      }
      return y + '-' + shi(m) + '-' + shi(d)
    }
  }
}
</script>

<style>
</style>
