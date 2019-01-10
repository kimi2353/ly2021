<template>
  <div id="app">
    <div class='pg'>
      <transition name="fade" v-show='fade' mode="out-in">
        <div :is='moban' ref='moban' @slideto='slideto'></div>
      </transition>
    </div>
    <!-- <swiper :options='swiperOption' ref='mySwiper'>
      <swiper-slide class='pg stop-swiping'>
        <load ref='load' @slideto='slideto'></load>
      </swiper-slide>
      <swiper-slide class='pg stop-swiping'>
        <pg1 ref='pg1' @slideto='slideto'></pg1>
      </swiper-slide>
      <swiper-slide class='pg stop-swiping'>
        <pg2 ref='pg2' @slideto='slideto'></pg2>
      </swiper-slide>
      <swiper-slide class='pg stop-swiping'>
        <pg3 ref='pg3' @slideto='slideto'></pg3>
      </swiper-slide>
    </swiper> -->
  </div>
</template>

<script>
import load from './components/load'
import pg1 from './components/pg1'
import pg2 from './components/pg2'
import pg3 from './components/pg3'
import pg4 from './components/pg4'

export default {
  name: 'App',
  components: {
    load,
    pg1,
    pg2,
    pg3,
    pg4
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  methods: {
    slideto (res) {
      let that = this
      if (res) {
        that.moban = 'pg' + res
      }
      that.fadefn()
      // that.$refs.moban.init()
      // that.swiper.slideTo(res, 50, false)
    },
    fadefn () {
      let that = this
      that.fade = false
      setTimeout(function () {
        that.$refs.moban.init()
        that.fade = true
      }, 1200)
    }
  },
  data () {
    return {
      swiperOption: {
        initialSlide: 0,
        noSwiping: true,
        noSwipingClass: 'stop-swiping',
        preventClicks: false
      },
      moban: 'load',
      fade: true
    }
  },
  mounted () {
    let that = this
    that.$refs.moban.loadImage()
  }
}
</script>

<style>
</style>
