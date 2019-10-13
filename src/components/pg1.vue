<template>
  <div class='pg1'>
    <iscroll-view class='scroll-view' ref='iscroll1' :options='scrollOptions'>
      <div class='pg1_tit'>学习记录</div>
      <ul class='pg1_list'>
        <li v-for='(item, index) in classlist' :key='index' @click.stop='up(item)' v-show="item.zuoye !== ''">
          <div class='classname'>{{ item.classname }}</div>
          <div class='classinfo'>
            <img :src="item.zuoye === '' ? 'https://festival.codemao.cn/static/img/yyl_share.png' : item.zuoye.video + '?vframe/jpg/offset/0'">
            <div class='info'>
              <div class='info_txt1'>视频作业：{{ item.zuoye === '' ? '未上传' : fmt(item.zuoye.flag) }}</div>
              <div class='info_txt2' v-if="item.zuoye !== ''">解锁时间：{{ format(item.zuoye.times) }}</div>
            </div>
          </div>
        </li>
      </ul>
      <div style="height: 3rem" />
    </iscroll-view>
  </div>
</template>

<script>
import { checkclass } from '@/api/login'

export default {
  name: 'pg1',
  data () {
    return {
      scrollOptions: {
        mouseWheel: true,
        click: true,
        tap: true
      },
      classlist: []
    }
  },
  computed: {
    iscroll1 () {
      return this.$refs.iscroll1
    },
    cla () {
      return this.$store.state.cla
    }
  },
  mounted () {
    let that = this
    that.init()
  },
  methods: {
    init () {
      const that = this
      const data = {
        openid: window.Global.openid,
        unionid: window.Global.unionid,
        nickname: window.Global.nickname,
        headimgurl: window.Global.headimgurl
      }
      const classQs = that.getQueryString('class')
      checkclass(data).then(res => {
        // console.log(res)
        if (res.res === 'success' || res.res === 'again') {
          that.classlist = res.class
          if (classQs && that.cla) {
            for (let i = 0; i < that.classlist.length; i++) {
              if (classQs == that.classlist[i].id) { // eslint-disable-line
                that.$store.commit('uCla', false)
                that.up(that.classlist[i])
              }
            }
          }
          // that.myclass = res.myclass
        }
      })
      setTimeout(function () {
        that.iscroll1.refresh()
      }, 600)
    },
    slideto (res) {
      const that = this
      that.$emit('slideto', res)
    },
    fmt (flag) {
      const f = {
        0: '正在批改',
        1: '已批改',
        2: '已批改',
        4: '已上传未批改'
      }
      return f[flag]
    },
    format (shijianchuo) {
      if (!shijianchuo) {
        return ''
      }
      const time = new Date(shijianchuo * 1000)
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      const h = time.getHours()
      const mm = time.getMinutes()
      const s = time.getSeconds()
      function shi (s) {
        s = '' + s
        if (s.length < 2) {
          s = '0' + s
        }
        return s
      }
      return y + '-' + shi(m) + '-' + shi(d) + ' ' + shi(h) + ':' + shi(mm) + ':' + shi(s)
    },
    up (obj) {
      const that = this
      // console.log(obj)
      that.$store.commit('uObj', obj)
      if (obj.zuoye === '') {
        that.slideto(2)
      } else if (obj.zuoye.flag === 4) {
        that.slideto(2)
      } else if (obj.zuoye.flag === 0) {
        that.$toast('老师正在批改，请稍后查看...')
      } else {
        that.slideto(3)
      }
    }
  }
}
</script>

<style>
</style>
