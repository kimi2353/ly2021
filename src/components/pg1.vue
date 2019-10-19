<template>
  <div class='pg1'>
    <iscroll-view class='scroll-view' ref='iscroll1' :options='scrollOptions'>
      <div class='pg1_main'>
        <div style="height: 6.53rem" />
        <img :src='headimgurl' class='headimgurl'>
        <div class='nickname'>{{ nickname }}</div>
        <div class='pg1_tit'>学习记录</div>
        <ul class='pg1_list'>
          <li v-for='(item, index) in classlist' :key='index'>
            <div class='classname'>{{ item.classname }}</div>
            <div class='classinfo'>
              <img :src="item.zuoye === '' ? 'https://festival.codemao.cn/static/img/yyl_share.png' : item.zuoye.video + '?vframe/jpg/offset/0'">
              <div class='info'>
                <div class='info_txt1'>
                  <span>视频作业：</span>{{ item.zuoye === '' ? '未上传' : fmt(item.zuoye.flag) }}
                </div>
              </div>
              <div class='info_txt3' v-show="item.zuoye===''" @click.stop='up(item)'>点击上传</div>
              <div class='info_txt3' v-show="item.zuoye!==''" @click.stop='up(item)'>点击查看</div>
            </div>
          </li>
        </ul>
        <div style="height: 2rem" />
      </div>
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
      classlist: [],
      headimgurl: '',
      nickname: '',
      child_name: '',
      user_id: ''
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
      that.headimgurl = window.Global.headimgurl
      that.nickname = window.Global.nickname
      const data = {
        openid: window.Global.openid,
        unionid: window.Global.unionid,
        nickname: window.Global.nickname,
        headimgurl: window.Global.headimgurl
      }
      // const classQs = that.getQueryString('class')
      checkclass(data).then(res => {
        if (res.res === 'new' || res.res === 'again') {
          that.classlist = res.myclass
          that.user_id = res.user_id
          that.child_name = res.child_name
          that.toShare()
        } else if (res.res === 'nouser') {
          that.$loading('无法查到您的小火箭课程信息...')
        } else if (res.res === 'sys') {
          that.$loading('系统错误，请稍后重试...')
        }
        setTimeout(function () {
          that.iscroll1.refresh()
        }, 400)
        setTimeout(function () {
          that.iscroll1.refresh()
        }, 1000)
      })
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
      // console.log(that.user_id)
      // console.log(obj.package_id)
      // console.log(obj.term_id)
      // console.log(obj.course_id)
      // console.log(obj.class_id)
      const data = {
        'user_id': that.user_id,
        'child_name': that.child_name,
        'package_id': obj.package_id,
        'term_id': obj.term_id,
        'course_id': obj.course_id,
        'class_id': obj.class_id,
        'course_name': obj.course_name
      }
      if (obj.zuoye && obj.zuoye.id) {
        data['id'] = obj.zuoye.id
      }
      // console.log(data)
      that.$store.commit('uObj', data)
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
