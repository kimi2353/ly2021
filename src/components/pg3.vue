<template>
  <div class='pg pg3'>
    <div class='return' @click='ret'>返回</div>
    <div class='pg3_tit'>{{username}}的实验作品</div>
    <div class='pg3_main1'>
      <div class='pg3_ctit'>{{tit}}</div>
      <div class='pg3_border'>
        <video-player class="video-player-box vjs-big-play-centered" ref="videoPlayer" :options="playerOptions" :playsinline="false" @play="onPlayerPlay()">
        </video-player>
      </div>
      <ul class='pg3_num'>
        <li class='zan'><img src='../assets/img/wl_pg3_zan.png'>投票数 {{num}}</li>
        <li class='bo'><img src='../assets/img/wl_pg3_bo.png'>播放数 {{play}}</li>
      </ul>
    </div>
    <div class='pg3_main2'>
      <div class='pg3_ctit'>实验心得</div>
      <div class='pg3_txt'>
        <p v-html='txt'></p>
      </div>
    </div>
    <ul class='pg3_btnlist'>
      <li v-if='type==="zhu"'>
        <div class='iszan' :class='{"zan1":zantype,"zan2":!zantype}'></div>{{num}}票
      </li>
      <li v-if='type==="zhu"' @click.prevent='player.pause();wl_share=true'>
        <img src="../assets/img/wl_pg3_share.png">分享拉票
      </li>
      <li v-if='type==="ke"' @click='zanfn'>
        <div class='iszan' :class='{"zan1":zantype,"zan2":!zantype}'></div>为Ta投票
      </li>
      <li v-if='type==="ke"' @click='ret'>
        <img src="../assets/img/wl_pg3_index.png">
        我也要参赛
      </li>
    </ul>
    <div class='nav' v-show='wl_share' @click='wl_share=false'>
      <img src="../assets/img/wl_share.png" class='wl_share'>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pg3',
  data () {
    return {
      username: '',
      tit: '',
      playerOptions: {
        sources: [{
          type: 'video/mp4',
          src: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/5cfebd525285890784262281763/p18NyxHgJ2oA.mp4'
        }]
      },
      video: '',
      num: 0,
      play: 0,
      txt: '',
      type: 'zhu',
      zantype: true,
      wl_share: false
    }
  },
  computed: {
    vid () {
      return this.$store.state.vid
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
      that.$loading('正在加载，请稍后...')
      let iszan = that.getCookie('wuli_iszan_' + that.vid)
      if (iszan) {
        that.zantype = false
      } else {
        that.zantype = true
      }
      let ismy = that.getCookie('wuli_ismy_' + that.vid)
      let data = new FormData()
      data.append('id', that.vid)
      that.axios.post(that.Url + 'checkinfo', data).then((res) => {
        that.$loading.close()
        if (res.data.res === 'success') {
          let info = res.data.info
          that.toShare(that.vid, info.username)
          that.username = info.username
          that.tit = info.title
          that.video = info.video
          that.player.src(info.video)
          that.player.poster(info.imgsrc)
          that.num = info.num
          that.play = info.play
          that.txt = info.txt
        } else {
          that.ret()
        }
      })
      if (ismy) {
        that.type = 'zhu'
      } else {
        that.type = 'ke'
      }
    },
    ret () {
      let that = this
      that.$emit('slideto', 1)
    },
    onPlayerPlay () {
      let that = this
      let isplay = that.getCookie('wuli_isplay_' + that.vid)
      if (!isplay) {
        let data = new FormData()
        data.append('id', that.vid)
        that.axios.post(that.Url + 'play', data).then((res) => {
          that.setCookie('wuli_isplay_' + that.vid, 'wuli_isplay_' + that.vid)
          if (res.data.res === 'success') {
            that.play = res.data.info.play
          }
        })
      }
    },
    zanfn () {
      let that = this
      let ismy = that.getCookie('wuli_iszan_' + that.vid)
      let data = new FormData()
      data.append('id', that.vid)
      if (ismy) {
        that.axios.post(that.Url + 'cancelzan', data).then((res) => {
          that.clearCookie('wuli_iszan_' + that.vid)
          that.zantype = true
          if (res.data.res === 'success') {
            that.num = res.data.info.num
          }
        })
      } else {
        that.axios.post(that.Url + 'zan', data).then((res) => {
          that.setCookie('wuli_iszan_' + that.vid, 'wuli_iszan_' + that.vid)
          that.zantype = false
          if (res.data.res === 'success') {
            that.num = res.data.info.num
          }
        })
      }
    }
  }
}
</script>

<style>
</style>
