<template>
  <div class='pg4'>
    <iscroll-view class='scroll-view' ref='iscroll4' :options='scrollOptions' @pullUp='load'>
      <div class='pg4_main'>
        <div class='return' @click='ret'>返回</div>
        <img src="../assets/img/wl_pg4_btn1.png" class='animated hinge infinite pulse wl_pg4_btn1' @click='hr("https://fudao.qq.com/activities/wlsyk1212/index.html")'>
        <ul class='wl_pg4_btnlist'>
          <li :class='{active:type===0}' @click='totype(0)'>最热</li>
          <li :class='{active:type===1}' @click='totype(1)'>最新</li>
          <li :class='{active:type===2}' @click='totype(2)'>我的作品</li>
        </ul>
        <ul class='wl_pg4_ul'>
          <li v-for='(item, index) in ulData' :key='index'>
            <div class='wl_jp' v-if='index<5&&jp'>{{index + 1}}</div>
            <div class='up' @click='showinfo(item.id)'>
              <div class='up_left' :style='"background-image:url(" + item.poster + ")"'>
              </div>
              <div class='up_right'>
                <div class='tit'>{{item.title}}</div>
                <div class='grade'>{{item.grade}}</div>
                <div class='grade'>{{item.username}}</div>
              </div>
            </div>
            <div class='down'>
              <div class='down_left' @click='goodBtn(item.id)'>
                <i :class='{"zan1":item.zan,"zan2":!item.zan,"zanfr":item.zanfr}'></i>
                投票数 {{item.num}}
              </div>
              <div class='down_right'>
                播放数 {{item.play}}
              </div>
            </div>
          </li>
          <li v-if='type===2&&ulData.length===0' class='wl_no_li'>
            <img src="../assets/img/wl_no.png" class='wl_no'>
          </li>
          <li style='background-color: #2f76f6;height: 1rem;pointer-events: none;'></li>
        </ul>
        <div style='height: 1rem;pointer-events: none;'></div>
      </div>
    </iscroll-view>
    <transition name="fade">
      <div class='nav' v-show='notel'>
        <div class='notel'>
          <div class='close' @click='notel=false'></div>
          <div class='notel_tit'>登录</div>
          <div class='notel_info'>
            <span>手机号</span>
            <input type="text" maxlength="11" v-model='addtel' placeholder="填写你提交视频时的手机号">
          </div>
          <img src="../assets/img/wl_notel_btn.png" class='wl_notel_btn' @click='wl_notel_btn'>
        </div>
      </div>
    </transition>
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
      c_num: 0,
      page: 0,
      maxPage: 1,
      tel: '',
      ulData: [],
      notel: false,
      addtel: '',
      jp: false
    }
  },
  computed: {
    vid () {
      return this.$store.state.vid
    },
    iscroll () {
      return this.$refs.iscroll4
    },
    type () {
      return this.$store.state.type
    }
  },
  mounted () {
    let that = this
    that.init()
  },
  methods: {
    init () {
      let that = this
      that.notel = false
      that.toShare()
      that.tel = that.getCookie('wl_tel')
      that.ul_info('f')
    },
    ul_info (f) {
      let that = this
      if (f) {
        that.page = 0
        that.maxPage = 1
        that.ulData = []
      }
      if (that.maxPage - that.page < 1) {
        return
      }
      let data = new FormData()
      data.append('type', that.type)
      if (that.type === 2) {
        data.append('tel', that.tel)
      }
      that.$loading('正在加载，请稍后...')
      if (that.type !== 0) {
        that.jp = false
      }
      that.axios.post(that.Url + 'checknum', data).then((res) => {
        that.c_num = res.data.num
        if (that.c_num === 0) {
          that.ulData = []
          that.page = 1
          that.$loading.close()
          setTimeout(function () {
            that.iscroll.refresh()
          }, 600)
          return
        }
        that.maxPage = Math.ceil(that.c_num / 20)
        that.page++
        if (that.maxPage - that.page >= 0) {
          let data2 = new FormData()
          data2.append('page', that.page)
          data2.append('type', that.type)
          data2.append('tel', that.tel)
          that.axios.post(that.Url + 'checkmsg', data2).then((res) => {
            that.$loading.close()
            if (res.data.res === 'success') {
              if (f) {
                that.ulData = []
              }
              for (let i = 0; i < res.data.info.length; i++) {
                var a = res.data.info[i]
                if (!a.szan) {
                  var thiscookie = 'wuli_iszan_' + a.id
                  that.setCookie(thiscookie, thiscookie, 99)
                }
                a.zan = that.checkzan(a.id)
                a.poster = a.video + '?vframe/jpg/offset/0'
                a.zanfr = false
                that.ulData.push(a)
              }
            } else {
              that.$toast('服务器繁忙<br>请稍后重试')
              that.$emit('slideto', 1)
            }
            if (that.type === 0) {
              that.jp = true
            }
            setTimeout(function () {
              that.iscroll.refresh()
            }, 600)
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
      if (i === 2 && !that.tel) {
        that.notel = true
        return
      }
      that.notel = false
      that.$store.commit('utype', i)
      that.ul_info('f')
    },
    onPlayerPlay (id) {
      let that = this
      let isplay = that.getCookie('wuli_isplay_' + id)
      if (!isplay) {
        let data = new FormData()
        data.append('id', id)
        that.axios.post(that.Url + 'play', data).then((res) => {
          that.setCookie('wuli_isplay_' + that.vid, 'wuli_isplay_' + that.vid, 99)
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
      that.$store.commit('ureturn', 'pai')
      that.$emit('slideto', 3)
    },
    goodBtn (id) {
      var that = this
      let data = new FormData()
      data.append('id', id)
      data.append('tel', that.tel)
      if (that.checkcookie(id) === true) {
        that.axios.post(that.Url + 'zan', data).then(function (res) {
          if (res.data.res === 'success') {
            for (var i = 0; i < that.ulData.length; i++) {
              if (that.ulData[i].id === id) {
                that.ulData[i].num = res.data.info.num
                that.ulData[i].zan = false
                that.ulData[i].zanfr = true
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
                that.ulData[i].zanfr = true
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
    },
    wl_notel_btn () {
      let that = this
      if (that.addtel === '') {
        that.$toast('请填写你提交视频时输入的手机号')
        return
      }
      if (!that.addtel.match(/^(((1[3-9][0-9]))+\d{8})$/)) {
        that.$toast('请填正确的联系电话')
        return
      }
      that.setCookie('wl_tel', that.addtel, 99)
      that.tel = that.addtel
      that.totype(2)
    }
  }
}
</script>

<style>
</style>
