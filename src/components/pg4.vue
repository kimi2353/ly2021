<template>
  <div class='pg4'>
    <iscroll-view class='scroll-view' ref='iscroll4' :options='scrollOptions' @pullUp='load'>
      <div class='pg4_main'>
        <div class='return' @click='ret'>返回</div>
        <img src="../assets/img/wl_pg4_btn1.png" class='wl_pg4_btn1'>
        <ul class='wl_pg4_btnlist'>
          <li :class='{active:type===0}' @click='totype(0)'>最热</li>
          <li :class='{active:type===1}' @click='totype(1)'>最新</li>
          <li :class='{active:type===2}' @click='totype(2)'>我的作品</li>
        </ul>
        <ul class='wl_pg4_ul'>
          <li v-for='(item, index) in ulData' :key='index'>
            <div class='up'>
              <div class='up_left'>
                <video-player class="video-player-box vjs-big-play-centered" :options="item.playerOptions" :playsinline="false" @play="onPlayerPlay(item.id)"></video-player>
              </div>
              <div class='up_right' @click='showinfo(item.id)'>
                <div class='tit'>{{item.title}}</div>
                <div class='grade'>{{item.grade}}</div>
                <div class='grade'>{{item.username}}</div>
              </div>
            </div>
            <div class='down'>
              <div class='down_left' @click='goodBtn(item.id)'>
                <i :class='{"zan1":item.zan,"zan2":!item.zan}'></i>投票数 {{item.num}}
              </div>
              <div class='down_right'>
                播放数 {{item.play}}
              </div>
            </div>
          </li>
          <li style='background-color: #2f76f6;height: 1rem;pointer-events: none;'></li>
        </ul>
      </div>
    </iscroll-view>
  </div>
</template>

<script>
export default {
  name: 'pg4',
  data () {
    return {
      playerOptions: {
        sources: [{
          type: 'video/mp4',
          src: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/5cfebd525285890784262281763/p18NyxHgJ2oA.mp4'
        }]
      },
      scrollOptions: {
        mouseWheel: true,
        click: true,
        tap: true
      },
      type: 0,
      c_num: 0,
      page: 0,
      maxPage: 1,
      tel: '',
      ulData: []
    }
  },
  computed: {
    vid () {
      return this.$store.state.vid
    },
    iscroll () {
      return this.$refs.iscroll4
    }
  },
  methods: {
    init () {
      let that = this
      that.tel = that.getCookie('wl_tel')
      console.log(that.tel)
      that.ul_info('f')
    },
    ul_info (f) {
      let that = this
      if (f) {
        that.page = 0
        that.maxPage = 1
      }
      if (that.maxPage - that.page < 1) {
        return
      }
      let data = new FormData()
      data.append('type', that.type)
      if (that.type === 2) {
        data.append('tel', that.tel)
      }
      that.axios.post(that.Url + 'checknum', data).then((res) => {
        that.c_num = res.data.num
        that.maxPage = Math.ceil(that.c_num / 20)
        that.page++
        if (that.maxPage - that.page >= 0) {
          let data2 = new FormData()
          data2.append('page', that.page)
          data2.append('type', that.type)
          if (that.type === 2) {
            data2.append('tel', that.tel)
          }
          that.axios.post(that.Url + 'checkmsg', data2).then((res) => {
            console.log(res)
            if (res.data.res === 'success') {
              if (f) {
                that.ulData = []
              }
              for (let i = 0; i < res.data.info.length; i++) {
                var a = res.data.info[i]
                a.zan = that.checkzan(a.id)
                a.playerOptions = {
                  sources: [{
                    type: 'video/mp4',
                    src: a.video
                  }]
                }
                that.ulData.push(a)
              }
              console.log(that.ulData)
              setTimeout(function () {
                that.iscroll.refresh()
              }, 400)
            }
          })
        }
      })
    },
    ret () {
      let that = this
      that.$emit('slideto', 1)
    },
    totype (i) {
      let that = this
      if (i === 2) {
        return
      }
      that.type = i
      that.ul_info('f')
    },
    onPlayerPlay (id) {
      let that = this
      let isplay = that.getCookie('wuli_isplay_' + id)
      if (!isplay) {
        let data = new FormData()
        data.append('id', id)
        that.axios.post(that.Url + 'play', data).then((res) => {
          that.setCookie('wuli_isplay_' + that.vid, 'wuli_isplay_' + that.vid)
          if (res.data.res === 'success') {
            let play = res.data.info.play
            for (let i = 0; i < that.ulData.length; i++) {
              if (that.ulData[i].id === id) {
                that.ulData[i].play = play
                break
              }
            }
          }
        })
      }
    },
    showinfo (id) {
      let that = this
      that.$store.commit('uvid', id)
      that.$emit('slideto', 3)
    },
    goodBtn (id) {
      var that = this
      let data = new FormData()
      data.append('id', id)
      if (that.checkcookie(id) === true) {
        that.axios.post(that.Url + 'zan', data).then(function (res) {
          if (res.data.res === 'success') {
            for (var i = 0; i < that.ulData.length; i++) {
              if (that.ulData[i].id === id) {
                that.ulData[i].num = res.data.info.num
                that.ulData[i].zan = false
                break
              }
            }
          }
        })
      } else {
        var thiscookie = 'wuli_iszan_' + id
        that.clearCookie(thiscookie)
        that.axios.post(that.Url + 'cancelzan', data).then(function (res) {
          if (res.data.res === 'success') {
            for (var i = 0; i < that.ulData.length; i++) {
              if (that.ulData[i].id === id) {
                that.ulData[i].num = res.data.info.num
                that.ulData[i].zan = true
                break
              }
            }
          }
        })
      }
    },
    load () {
      let that = this
      that.ul_info()
      console.log('load')
    }
  }
}
</script>

<style>
</style>
