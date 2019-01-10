<template>
  <div class='pg4'>
    <iscroll-view class='scroll-view' ref='iscroll4' :options='scrollOptions'>
      <div class='pg4_main'>
        <div class='return' @click='ret'>返回</div>
        <img src="../assets/img/wl_pg4_btn1.png" class='wl_pg4_btn1'>
        <ul class='wl_pg4_btnlist'>
          <li :class='{active:type===0}' @click='totype(0)'>最热</li>
          <li :class='{active:type===1}' @click='totype(1)'>最新</li>
          <li :class='{active:type===2}' @click='totype(2)'>我的作品</li>
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
      tel: ''
    }
  },
  computed: {
    vid () {
      return this.$store.state.vid
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
      that.type = i
      that.ul_info('f')
    }
  }
}
</script>

<style>
</style>
