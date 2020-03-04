<template>
  <div id="app">
    <transition name="fade" v-show='fade' mode="out-in">
      <div :is='moban' ref='moban' @slideto='slideto' @init='init'></div>
    </transition>
  </div>
</template>

<script>
import { checkTaskInfo } from '@/api/login'
import pg1 from './components/pg1'
import pg2 from './components/pg2'
import pg3 from './components/pg3'
import pg4 from './components/pg4'

export default {
  name: 'App',
  components: {
    pg1,
    pg2,
    pg3,
    pg4
  },
  data () {
    return {
      moban: '',
      fade: true
    }
  },
  mounted () {
    const that = this
    that.init()
  },
  methods: {
    init () {
      const that = this
      const id = that.getQueryString('id')
      if (!id) {
        that.$loading('活动错误')
      } else {
        const data = {
          id,
          openid: window.Global.openid,
          unionid: window.Global.unionid,
          headimgurl: window.Global.headimgurl,
          nickname: window.Global.nickname
        }
        checkTaskInfo(data).then(res => {
          if (res.res === 'error') {
            that.$loading('异常，请刷新重试。')
          } else if (res.res === 'end') {
            that.$loading('不在活动期限内。')
          } else if (res.res === 'success') {
            console.log(res.imginfo)
            that.$store.commit('uTask', res.info)
            that.$store.commit('uImgInfo', res.imginfo)
            that.$store.commit('uUserId', res.user_id)
            that.toShare(id, res.info.sharetit, res.info.sharedec)
            that.moban = pg2
          } else if (res.res === 'user') {
            that.$loading('暂无法参与活动，请联系您的班主任')
          } else {
            that.$loading('异常，请刷新重试。')
          }
          // console.log(res)
        })
      }
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
        // that.$refs.moban.init()
        that.fade = true
      }, 1200)
    }
  }
}
</script>

<style>
</style>
