<template>
  <div class='pg3'>
    <iscroll-view class='scroll-view' ref='iscroll1' :options='scrollOptions'>
      <div class='pg3_main'>
        <div class='return' @click='ret'>返回</div>
        <div style="height: 1.53rem" />
        <div class='pg3_tit'>{{nickname}}的作品</div>
        <div class='pg3_main1'>
          <div class='pg3_ctit'>{{tit}}</div>
          <div class='pg3_border'>
            <video-player class="video-player-box vjs-big-play-centered" ref="videoPlayer" :options="playerOptions" :playsinline="false" />
          </div>
        </div>
        <div class='pg3_main2'>
          <div class='piao' v-if='voiceList.length > 0'>
            <div class='pg3_ctit'>老师语音留言</div>
            <div class='txt1' @click='start(item, index)' v-for="(item, index) in voiceList" :key="index" :class="{voiceActive: item.voiceFlag}" >{{ item.voiceTimes }}秒</div>
          </div>
          <div class='pg3_ctit'>老师评语</div>
          <div class='pg3_txt'>
            <p v-html='txt'></p>
          </div>
        </div>
        <div style="height: 2rem" />
      </div>
    </iscroll-view>
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
        tap: true
        // scrollbars: true
      },
      video: '',
      txt: '',
      info: null,
      voice: null,
      voiceFlag: false,
      id: '',
      voiceList: [],
      voiceId: ''
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
      that.voice = null
      for (let i = 0; i < that.voiceList.length; i++) {
        that.voiceList[i].voiceFlag = false
      }
    }
  },
  mounted () {
    const that = this
    const id = that.getQueryString('id')
    // console.log()
    if (id) {
      that.id = id
      that.init()
    } else if (that.obj && that.obj.id) {
      that.id = that.obj.id
      that.init()
    } else {
      that.ret()
    }
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
        id: that.id
      }
      classinfo(data).then(res => {
        that.$loading.close()
        if (res.res === 'success') {
          if (res.zuoye !== '') {
            // console.log(res.zuoye)
            if (res.zuoye.flag != 1 && res.zuoye.flag != 2) { //eslint-disable-line
              that.ret()
              return
            }
            that.info = res.zuoye
            that.video = that.info.video
            setTimeout(function () {
              that.player.src(that.info.video)
              that.player.poster(that.info.video + '?vframe/jpg/offset/0')
            }, 200)
            that.txt = that.info.comment
            that.nickname = that.info.nickname
            that.tit = that.info.classname
            that.voiceList = []
            const arr1 = that.info.voice.split(',')
            const arr2 = that.info.voiceTimes.split(',')
            for (let i = 0; i < arr1.length; i++) {
              that.voiceList.push({
                voice: arr1[i],
                voiceTimes: arr2[i],
                voiceFlag: false
              })
            }
            that.toShare(res.zuoye.id)
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
    start (obj, index) {
      const that = this
      if (that.voiceId === index) {
        if (!that.voice) {
          that.voice = new Audio()
          that.voice.src = obj.voice
          that.voice.play()
          that.voiceList[index].voiceFlag = true
          that.voice.addEventListener('ended', function () {
            that.voice.pause()
            that.voice.removeEventListener('ended', function () {})
            that.voice = null
            that.voiceId = ''
            for (let i = 0; i < that.voiceList.length; i++) {
              that.voiceList[i].voiceFlag = false
            }
          })
        } else {
          that.voice.pause()
          that.voiceId = ''
          that.voice.removeEventListener('ended', function () {})
          that.voice = null
          for (let i = 0; i < that.voiceList.length; i++) {
            that.voiceList[i].voiceFlag = false
          }
        }
      } else {
        that.voiceId = index
        if (!that.voice) {
          that.voice = new Audio()
          that.voice.src = obj.voice
          that.voice.play()
          that.voiceList[index].voiceFlag = true
          that.voice.addEventListener('ended', function () {
            that.voice.pause()
            that.voice.removeEventListener('ended', function () {})
            that.voice = null
            that.voiceId = ''
            for (let i = 0; i < that.voiceList.length; i++) {
              that.voiceList[i].voiceFlag = false
            }
          })
        } else {
          that.voice.pause()
          that.voice.removeEventListener('ended', function () {})
          that.voice = null
          for (let i = 0; i < that.voiceList.length; i++) {
            that.voiceList[i].voiceFlag = false
          }
          that.voice = new Audio()
          that.voice.src = obj.voice
          that.voice.play()
          that.voiceList[index].voiceFlag = true
          that.voice.addEventListener('ended', function () {
            that.voice.pause()
            that.voice.removeEventListener('ended', function () {})
            that.voice = null
            that.voiceId = ''
            for (let i = 0; i < that.voiceList.length; i++) {
              that.voiceList[i].voiceFlag = false
            }
          })
        }
      }
    }
  }
}
</script>

<style>
</style>
