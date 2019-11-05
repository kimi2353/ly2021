<template>
  <div class='pg3'>
    <iscroll-view class='scroll-view' ref='iscroll1' :options='scrollOptions'>
      <div class='pg3_main'>
        <div v-if='zhuType'>
          <div class='left' @click.once='to4(1)' v-show="videoIndex<videoList.length-1"/>
          <div class='right' @click.once='to4(-1)' v-show="videoIndex>0"/>
          <div class='menu' @click='ret'>全部</div>
          <div class='pg3_tit'>{{tit}}</div>
        </div>
        <div v-else>
          <div class='pg3_tit1'>{{child_name}}正在编程猫学习“{{tit}}”，快来看看她完成的出色作业吧。</div>
        </div>
        <div class='pg3_main1'>
          <div class='pg3_border'>
            <video-player class="video-player-box vjs-big-play-centered" ref="videoPlayer" :options="playerOptions" :playsinline="false" />
          </div>
        </div>
        <div class='pg3_main2'>
          <div class='pg3_txt1' v-if="info">{{ info.teacher_name }}点评</div>
          <div class='pg3_txt2'>
            <p v-html='txt'></p>
          </div>
          <div class='piao' v-if='voiceList.length > 0'>
            <div class='txt1' :style="'width:' + item.width + 'rem;'" @click='start(item, index)' v-for="(item, index) in voiceList" :key="index" :class="{red: item.red, voiceActive: item.voiceFlag}" >{{ item.voiceTimes }}''</div>
          </div>
        </div>
        <div style="height: 4rem" />
      </div>
    </iscroll-view>
    <div class='pg3_btn' @click="sharefn" v-if='zhuType'>
      <div class='pg3_btn1' @click="sharefn">快分享宝贝的作品给亲朋好友吧</div>
    </div>
    <div class='pg3_btn' v-else>
      <img src='@/assets/img/btn_flag.png' class='btn_flag'>
      <span class='pg3_btn_txt'>快来报名和{{ child_name }}<br>一起学编程吧</span>
      <a href="https://mobile.codemao.cn/codecamp_new/product/16?utm_source=miniapp&utm_medium=h5&utm_term=video_work_share" target="_blank">立即报名</a>
    </div>
    <transition name="fade">
      <div class='nav1' v-show='sharenav'>
        <img src="@/assets/img/f.png" class='shareimg'>
        <div class='sharenav_txt'>点击右上角分享，让好友看到孩子的成长</div>
        <div class='shareclose' @click.stop='sharenav=false'>好的</div>
      </div>
    </transition>
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
      child_name: '',
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
      scrollOptions2: {
        mouseWheel: true,
        click: false,
        tap: true,
        scrollbars: true
      },
      video: '',
      txt: '',
      info: null,
      voice: null,
      voiceFlag: false,
      id: '',
      voiceList: [],
      voiceId: '',
      zhuType: true,
      sharenav: false,
      menunav: false
    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    iscroll2 () {
      return this.$refs.iscroll2
    },
    iscroll1 () {
      return this.$refs.iscroll1
    },
    obj () {
      return this.$store.state.obj
    },
    videoIndex () {
      return this.$store.state.videoIndex
    },
    videoList () {
      return this.$store.state.videoList
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
    if (that.obj && that.obj.id) {
      that.id = that.obj.id
      that.init()
    } else if (id) {
      that.id = id
      that.init()
    } else {
      that.ret()
    }
  },
  methods: {
    menunfn () {
      const that = this
      that.menunav = true
      setTimeout(function () {
        that.iscroll2.refresh()
      }, 400)
    },
    toPage (i) {
      const that = this
      that.$store.commit('uVideoIndex', i)
      that.slideto(4)
    },
    slideto (res) {
      const that = this
      that.$emit('slideto', res)
    },
    to4 (num) {
      const that = this
      let i = that.videoIndex
      if (num === 1) {
        if (i < (that.videoList.length - 1)) {
          i++
        } else {
          i = that.videoList.length
        }
        that.$store.commit('uVideoIndex', i)
        that.slideto(4)
      } else if (num === -1) {
        if (i < 1) {
          i = 0
        } else {
          i--
        }
        that.$store.commit('uVideoIndex', i)
        that.slideto(4)
      }
    },
    init () {
      const that = this
      that.changeTitle('作业详情')
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
            // setTimeout(function () {
            //   that.player.src(that.info.video)
            //   that.player.poster(that.info.video + '?vframe/jpg/offset/0')
            // }, 300)
            that.txt = that.info.comment
            that.nickname = that.info.nickname
            that.zhuType = that.info.openid === window.Global.openid
            if (that.videoIndex === -1) {
              that.$store.commit('uVideoIndex', 0)
            }
            that.tit = that.info.course_name
            that.child_name = that.info.child_name
            if (!that.zhuType) {
              that.changeTitle(that.child_name + '的视频作业')
            }
            that.voiceList = []
            let arr1 = []
            let arr2 = []
            if (that.info.voice) {
              arr1 = that.info.voice.split(',')
              arr2 = that.info.voiceTimes.split(',')
            }
            for (let i = 0; i < arr1.length; i++) {
              let voiceTimes = parseInt(arr2[i])
              let width = 3.5 + ((voiceTimes - 2) / 60) * 10
              if (width > 13.5) {
                width = 13.5
              }
              if (voiceTimes < 10) {
                voiceTimes = '0' + voiceTimes
              }
              that.voiceList.push({
                voice: arr1[i],
                voiceTimes,
                voiceFlag: false,
                red: that.checkzan(that.id + '_' + i),
                width
              })
            }
            that.toShare(res.zuoye.id, res.zuoye.child_name, res.zuoye.course_name)
            that.$nextTick(() => {
              that.iscroll1.refresh()
              that.player.src(that.info.video)
              that.player.poster(that.info.video + '?vframe/jpg/offset/0')
            })
            setTimeout(function () {
              that.iscroll1.refresh()
              setTimeout(function () {
                that.iscroll1.refresh()
              }, 1000)
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
      const that = this
      that.$emit('slideto', 1)
    },
    start (obj, index) {
      const that = this
      // console.log(that.voiceList[index].red)
      if (that.voiceList[index].red) {
        const it = that.voiceList[index]
        it.red = false
        that.$set(that.voiceList, index, it)
        that.checkcookie(that.id + '_' + index)
        // that.voiceList[index].red = false
      }
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
    },
    sharefn () {
      const that = this
      that.sharenav = true
    }
  }
}
</script>

<style>
</style>
