<template>
  <div class='pg1'>
    <iscroll-view class='scroll-view' ref='iscroll1' :options='scrollOptions' @scrollEnd="log">
      <img src="/static/img/wl_pg1_bg.jpg" class='wl_pg1_bg'>
      <div class='wl_pg1_txt1'>
        <div class='wl_pg1_txt2'>请选择大赛规定的12个实验主题进行参赛，点击以下相应主题按钮，观看详细实验教程！</div>
        <div class='wl_pg1_txt3'>
          <span class='tit'>实验教程：</span>
          <div class='wl_pg1_video'>
            <video-player class="video-player-box vjs-big-play-centered" ref="videoPlayer" :options="playerOptions" :playsinline="false" @play='play'>
            </video-player>
          </div>
          <transition name="fadetxt">
            <div v-show='fade'>
              <span class='body'>实验步骤：</span>
              <div v-html='step' class='step'></div>
            </div>
          </transition>
        </div>
        <ul class='wl_pg1_txt4'>
          <li v-for='(item, index) in videoinfo' :key='index' :class='{active: item.active}' @click='exp(index)'>{{item.name}}</li>
        </ul>
      </div>
      <img src="/static/img/wl_4.jpg" class='wl_4'>
      <span class='dongtai'>· 第一时间获取比赛最新动态 ·</span>
      <img src="../assets/img/wl_pg1_dt.png" class='animated hinge infinite pulse wl_pg1_dt' @click='hr("https://jq.qq.com/?_wv=1027&k=5WPZHpY")'>
      <img src="/static/img/wl_6.jpg" class='wl_4'>
      <div style='height: 5.12rem'></div>
    </iscroll-view>
    <ul class='wl_pg1_btnlist'>
      <li class='animated hinge infinite pulse wl_pg1_btn wl_pg1_btn1' @click='pan'></li>
      <li class='animated hinge infinite pulse wl_pg1_btn wl_pg1_btn2' @click='slideto(4)'></li>
    </ul>
    <transition name="fade">
        <div class='go' v-show='go'></div>
      </transition>
    <transition name="fade">
      <div class='nav' v-show='alert'>
        <div class='wl_pg1_alert'>
          <div class='close' @click='alert=false'></div>
          <img class='animated hinge infinite pulse' src="../assets/img/wl_pg1_abtn1.png" @click='hr("https://jq.qq.com/?_wv=1027&k=5WPZHpY")'>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'pg1',
  data () {
    return {
      scrollOptions: {
        mouseWheel: true,
        click: true,
        tap: true
      },
      step: '',
      playerOptions: {
        sources: [{
          type: 'video/mp4',
          src: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a4a6e2725285890784256283308/MV1by6rsL6wA.mp4'
        }],
        poster: '/static/img/wl_c1.jpg'
      },
      src: '',
      poster: '',
      fade: true,
      scrolly: -850,
      alert: false,
      go: true
    }
  },
  computed: {
    iscroll1 () {
      return this.$refs.iscroll1
    },
    videoinfo () {
      return this.$store.state.videoinfo
    },
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  mounted () {
    let that = this
    that.init()
  },
  methods: {
    init () {
      let that = this
      that.step = that.videoinfo[0].txt
      that.$store.commit('uVdinfo', 0)
      that.fade = true
      that.toShare()
      setTimeout(function () {
        that.iscroll1.refresh()
      }, 600)
    },
    exp (i) {
      let that = this
      if (that.videoinfo[i].active) {
        return
      }
      that.$store.commit('uVdinfo', i)
      that.fade = false
      setTimeout(function () {
        that.step = that.videoinfo[i].txt
        that.fade = true
      }, 500)
      that.player.poster(that.videoinfo[i].poster)
      that.player.src(that.videoinfo[i].url)
      document.querySelector('video').poster = that.videoinfo[i].poster
      document.querySelector('video').style.display = 'none'
    },
    slideto (res) {
      let that = this
      that.player.pause()
      that.$emit('slideto', res)
    },
    play () {
      let that = this
      document.querySelector('video').style.display = 'block'
      console.log(that.player)
    },
    pan () {
      let that = this
      that.$toast('活动征集已结束，请耐心等待获奖结果')
      // let flag = true
      // let cl = document.documentElement.classList
      // for (let i = 0; i < cl.length; i++) {
      //   if (cl[i] === 'android') {
      //     flag = false
      //   }
      // }
      // if (flag) {
      //   that.slideto(2)
      // } else {
      //   let isFudaoApp = this.isFudaoApp()
      //   if (isFudaoApp) {
      //     that.alert = true
      //   } else {
      //     that.slideto(2)
      //   }
      // }
    },
    log (iscroll) {
      let that = this
      if (iscroll.y < that.scrolly) {
        that.go = false
      } else {
        that.go = true
      }
    }
  }
}
</script>

<style>
</style>
