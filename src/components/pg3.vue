<template>
  <div class='pg pg3'>
    <div class='return' @click='ret'>返回</div>
    <div class='pg3_tit'>{{nickname}}的作品</div>
    <div class='pg3_main1'>
      <div class='pg3_ctit'>{{tit}}</div>
      <div class='pg3_border'>
        <video-player class="video-player-box vjs-big-play-centered" ref="videoPlayer" :options="playerOptions" :playsinline="false" />
      </div>
      <div class='piao' v-if='info' v-show="info&&info.voice">
        <div class='pg3_ctit'>老师语音留言</div>
        <div class='txt1' @click='start' :class="{voiceActive: voiceFlag}" >{{ info.voiceTimes }}秒</div>
      </div>
    </div>
    <div class='pg3_main2'>
      <div class='pg3_ctit'>老师评语</div>
      <div class='pg3_txt'>
        <iscroll-view class='scroll-view' ref='iscroll1' :options='scrollOptions'>
          <p v-html='txt'></p>
        </iscroll-view>
      </div>
    </div>
  </div>
</template>

<script>
import { classinfo } from '@/api/login'

export default {
  name: 'pg3',
  data () {
    return {
      nickname: '',
      tit: '',
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/5cfebd525285890784262281763/p18NyxHgJ2oA.mp4'
        }]
      },
      scrollOptions: {
        mouseWheel: true,
        click: true,
        tap: true,
        scrollbars: true
      },
      video: '',
      txt: '',
      info: null,
      voice: null,
      voiceFlag: false
    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    iscroll1 () {
      return this.$refs.iscroll1
    },
    obj () {
      return this.$store.state.obj
    }
  },
  destroyed () {
    const that = this
    if (that.voice) {
      that.voice.pause()
      that.voice.removeEventListener('ended', function () {})
      that.voiceFlag = false
      that.voice = null
    }
  },
  mounted () {
    const that = this
    if (!that.obj) {
      that.ret()
      return
    }
    that.init()
  },
  methods: {
    init () {
      const that = this
      that.$loading('正在加载，请稍后...')
      const data = {
        openid: window.Global.openid,
        unionid: window.Global.unionid,
        nickname: window.Global.nickname,
        headimgurl: window.Global.headimgurl,
        id: that.obj.id
      }
      classinfo(data).then(res => {
        that.$loading.close()
        if (res.res === 'success') {
          if (res.zuoye !== '') {
            that.info = res.zuoye
            that.video = that.info.video
            setTimeout(function () {
              that.player.src(that.info.video)
              that.player.poster(that.info.video + '?vframe/jpg/offset/0')
            }, 200)
            that.txt = that.info.comment
            that.nickname = that.info.nickname
            that.tit = that.info.classname
            setTimeout(function () {
              that.iscroll1.refresh()
            }, 600)
          } else {
            that.ret()
          }
        } else {
          that.ret()
        }
      })
    },
    ret () {
      let that = this
      that.$emit('slideto', 1)
    },
    start () {
      const that = this
      if (!that.voice) {
        that.voice = new Audio()
        that.voice.src = that.info.voice
        that.voice.play()
        that.voiceFlag = true
        that.voice.addEventListener('ended', function () {
          that.voice.pause()
          that.voice.removeEventListener('ended', function () {})
          that.voice = null
          that.voiceFlag = false
        })
      } else {
        that.voice.pause()
        that.voice.removeEventListener('ended', function () {})
        that.voice = null
        that.voiceFlag = false
      }
    }
  }
}
</script>

<style>
</style>
