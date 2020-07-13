<template>
  <div class='pg1'>
    <div class="pg1_main">
      <img style="display:block;width: 100%;" src="@/assets/img/sh_banner.jpg" />
      <div class="pg1_info">
        <img :src="headimgurl" class="headimgurl">
        <span class="nickname">{{ nickname }}</span>
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
import { checkShenheInfo, checkShenheMsg } from '@/api/login'
import { Toast } from 'vant'
// import { Image as VanImage, Cell, CellGroup } from 'vant'
// import { Cell, CellGroup } from 'vant'
export default {
  name: 'pg1',
  data () {
    return {
      headimgurl: '',
      nickname: '',
      slist: [],
      now: 0
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
    that.init()
  },
  methods: {
    upmenu () {
      const that = this
      const bp = {
        'element': '上传记录',
        'page_name': '编程猫宣传官首页'
      }
      that.$emit('btnInfo', bp)
      that.slideto(3)
    },
    totab (item) {
      const that = this
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
    init () {
      const that = this
      const userId = that.getQueryString('user_id')
      const utmContent = that.getQueryString('utm_content')
      const utmTerm = that.getQueryString('utm_term')
      const utmSource = that.getQueryString('utm_source')
      const data = {
        openid: window.Global.openid,
        unionid: window.Global.unionid,
        headimgurl: window.Global.headimgurl,
        nickname: window.Global.nickname,
        userId,
        utm_content: utmContent,
        utm_term: utmTerm,
        utm_source: utmSource
      }
      checkShenheInfo(data).then(res => {
        // console.log(res)
        if (res.res === 'success') {
          that.$store.commit('uPackageId', res.package_id)
          that.$store.commit('uUserId', res.user_id)
          that.now = res.now
          for (let i = 0; i < res.shenhe.length; i++) {
            res.shenhe[i].tag = that.fmt(res.shenhe[i].begin, res.shenhe[i].end)
          }
          that.slist = res.shenhe
          that.toShare()
          if (that.id) {
            for (let i = 0; i < that.slist.length; i++) {
              if (that.id == that.slist[i].id) { // eslint-disable-line
                that.$store.commit('uId', '')
                that.totab(that.slist[i])
                break
              }
            }
            that.$store.commit('uId', '')
          }
        }
      })
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
