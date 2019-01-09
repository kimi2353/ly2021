<template>
  <div id="app">
    <swiper :options='swiperOption' ref='mySwiper'>
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
    </swiper>
  </div>
</template>

<script>
import load from './components/load'
import pg1 from './components/pg1'
import pg2 from './components/pg2'
import pg3 from './components/pg3'

export default {
  name: 'App',
  components: {
    load,
    pg1,
    pg2,
    pg3
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  methods: {
    slideto (res) {
      let that = this
      that.$refs['pg' + res].init()
      that.swiper.slideTo(res, 50, false)
    }
  },
  data () {
    return {
      swiperOption: {
        effect: 'fade',
        initialSlide: 0,
        noSwiping: true,
        noSwipingClass: 'stop-swiping'
      }
    }
  },
  mounted () {
    let that = this
    that.$refs.load.loadImage()
  }
}
</script>

<style>
</style>
