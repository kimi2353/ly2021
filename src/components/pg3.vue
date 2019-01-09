<template>
  <div class='pg pg3'>
    <div class='return' @click='ret'>返回</div>
    <div class='pg3_tit'>{{username}}的实验作品</div>
    <div class='pg3_main1'>
      <div class='pg3_ctit'>{{tit}}</div>
      <div class='pg3_border'>
        <video-player class="video-player-box vjs-big-play-centered" ref="videoPlayer" :options="playerOptions" :playsinline="false">
        </video-player>
      </div>
      <ul class='pg3_num'>
        <li class='zan'><img src='../assets/img/wl_pg3_zan.png'>投票数 {{num}}</li>
        <li class='bo'><img src='../assets/img/wl_pg3_bo.png'>播放数 {{play}}</li>
      </ul>
    </div>
    <div class='pg3_main2'>
      <div class='pg3_ctit'>实验心得</div>
      <div class='pg3_txt'>{{txt}}</div>
    </div>
    <ul class='pg3_btnlist'>
      <li v-if='type==="zhu"'>
        <img src="../assets/img/wl_pg3_zan1.png">{{num}}票
      </li>
      <li v-if='type==="zhu"'>
        <img src="../assets/img/wl_pg3_share.png">分享拉票
      </li>
      <li v-if='type==="ke"'>
        <img src="../assets/img/wl_pg3_zan1.png">我也要参赛
      </li>
      <li v-if='type==="ke"'>
        我也要参赛
      </li>
    </ul>
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
          src: 'http://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/5cfebd525285890784262281763/p18NyxHgJ2oA.mp4'
        }]
      },
      video: '',
      num: 0,
      play: 0,
      txt: '',
      type: 'zhu'
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
  methods: {
    init () {
      let that = this
      that.$loading('正在加载，请稍后...')
      let ismy = that.getCookie('wuli_ismy_' + that.vid)
      let data = new FormData()
      data.append('id', that.vid)
      that.axios.post(that.Url + 'checkinfo', data).then((res) => {
        that.$loading.close()
        if (res.data.res === 'success') {
          let info = res.data.info
          that.username = info.username
          that.tit = info.title
          that.video = info.video
          that.player.src(info.video)
          that.num = info.num
          that.play = info.play
          that.txt = info.txt
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
    }
  }
}
</script>

<style>
</style>
