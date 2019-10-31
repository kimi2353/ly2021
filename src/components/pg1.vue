<template>
  <div class='pg1'>
    <iscroll-view class='scroll-view' ref='iscroll1' :options='scrollOptions'>
      <div class='pg1_main'>
        <div v-show="user&&user.status==='normal'&&classlist.length>0">
          <div class='pg1_tit' v-if="user&&user.status==='normal'&&classlist.length>0">今天是{{ user.child_name }}小朋友来编程猫学习的第{{ parseInt(user.learn_time / 86400) }}天，孩子已经完成了{{classlist.length-videonull}}次视频作业啦，还有{{videonull}}次课程未上传视频</div>
          <div class='pg1_tit1'>学习详情</div>
          <ul class='pg1_list'>
            <li v-for='(item, index) in classlist' :key='index' @click.stop='up(item, index)'>
              <div class='classinfo_txt1'>
                <span>{{ item.course_name }}</span>
              </div>
              <img :src="item.zuoye === '' ? 'https://festival.codemao.cn/static/img/yyl_share.png' : item.zuoye.video + '?vframe/jpg/offset/0'">
              <div class='info'>
                <div class='info_txt1'>视频作业：</div>
                <div class='info_txt2' :class="{green: item.zuoye}">
                  <i class="flag" :class="{yellow: !item.zuoye, green: item.zuoye}" />
                  <span>{{ item.zuoye === '' ? '未上传' : fmt(item.zuoye.flag) }}</span>
                </div>
                <div class='info_txt3'>
                  <i class="flag luck" />
                  <span>{{ format1(item.unlock_time) }} 解锁</span>
                </div>
                <!-- <div class='info_txt2'>
                  <span>视频作业：</span>
                  <span>{{ item.zuoye === '' ? '未上传' : fmt(item.zuoye.flag) }}</span>
                </div>
                <div class='info_txt1'>
                  <span>解锁时间：</span>{{ format1(item.unlock_time) }}
                </div> -->
              </div>
            </li>
          </ul>
          <div class="pg1_bottom_txt1" v-show="classlist.length>0">已显示全部内容</div>
          <div style="height: 2rem" />
        </div>
        <div v-show="nouser||(user&&(user.status==='no_purchase'&&classlist.length===0))">
          <div style="height: 6.29rem" />
          <img src="@/assets/img/zuoye_null.png" class='zuoye_null'>
          <div class="pg1_bottom_add_txt1">暂无学习记录</div>
          <div class="pg1_bottom_add_txt2">暂无学习记录，你还没有在编程猫学习过，快去购课学习吧</div>
          <a class="pg1_bottom_btn" href="https://mobile.codemao.cn/codecamp_new/product/16?utm_source=miniapp&utm_medium=h5&utm_term=video_work_share" target="_blank">立即报名</a>
        </div>
        <div v-show="(user&&(user.status==='no_start'&&classlist.length===0))">
          <div style="height: 6.29rem" />
          <img src="@/assets/img/zuoye_null.png" class='zuoye_null'>
          <div class="pg1_bottom_add_txt1">暂无学习记录</div>
          <div class="pg1_bottom_add_txt2">你的课程还未开始，耐心等待第一节课吧</div>
        </div>
        <!-- <div class="pg1_bottom_txt1" v-show="user&&(user.status==='no_start'&&classlist.length===0)">暂无学习记录，你的课程还未开始，<br>耐心等待第一节课开始吧</div> -->
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
      user_id: '',
      user: null,
      videonull: 0,
      nouser: false
    }
  },
  computed: {
    iscroll1 () {
      return this.$refs.iscroll1
    },
    cla () {
      return this.$store.state.cla
    },
    videoIndex () {
      return this.$store.state.videoIndex
    }
  },
  mounted () {
    let that = this
    const list = that.getQueryString('list')
    if (list) {
      that.$store.commit('uVideoIndex', 0)
    }
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
      that.changeTitle('学习记录')
      checkclass(data).then(res => {
        // res.res = 'nouser'
        if (res.res === 'new' || res.res === 'again') {
          that.classlist = res.myclass
          that.user = res.user
          // console.log(that.user)
          // that.user.status = 'no_start'
          // that.classlist = []
          that.$store.commit('uVideoList', that.classlist)
          that.user_id = res.user_id
          that.child_name = res.child_name
          that.toShare()
          for (let i = 0; i < that.classlist.length; i++) {
            if (that.classlist[i].zuoye === '') {
              that.videonull++
            }
          }
          const course = that.getQueryString('course')
          if (that.videoIndex === -1) {
            for (let i = 0; i < that.classlist.length; i++) {
              if (course) {
                if (that.classlist[i].course_id == course) { // eslint-disable-line
                  that.up(that.classlist[i], i)
                  break
                }
              } else {
                if (that.classlist[i].zuoye === '') {
                  that.up(that.classlist[i], i)
                  break
                }
              }
            }
          }
        } else if (res.res === 'nouser') {
          that.nouser = true
          // that.$loading('无法查到您的小火箭课程信息...')
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
    format1 (shijianchuo) {
      if (!shijianchuo) {
        return ''
      }
      const time = new Date(shijianchuo * 1000)
      // const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      const h = time.getHours()
      const mm = time.getMinutes()
      // const s = time.getSeconds()
      function shi (s) {
        s = '' + s
        if (s.length < 2) {
          s = '0' + s
        }
        return s
      }
      return shi(m) + '-' + shi(d) + ' ' + shi(h) + ':' + shi(mm)
    },
    up (obj, i) {
      const that = this
      that.$store.commit('uVideoIndex', i)
      const data = {
        'user_id': that.user_id,
        'child_name': that.child_name,
        'package_id': obj.package_id,
        'term_id': obj.term_id,
        'course_id': obj.course_id,
        'class_id': obj.class_id,
        'course_name': obj.course_name,
        'package_name': obj.package_name,
        'term_name': obj.term_name,
        'class_name': obj.class_name,
        'teacher_name': obj.teacher_name
      }
      if (obj.zuoye && obj.zuoye.id) {
        data['id'] = obj.zuoye.id
      }
      that.$store.commit('uObj', data)
      if (obj.zuoye === '') {
        that.slideto(2)
      } else if (obj.zuoye.flag === 4) {
        that.slideto(2)
      } else if (obj.zuoye.flag === 0) {
        that.slideto(2)
        // that.$toast('老师正在批改，请稍后查看...')
      } else {
        that.slideto(3)
      }
    }
  }
}
</script>

<style>
</style>
