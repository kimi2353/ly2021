<template>
  <div id="app">
    <swiper :options='swiperOption' ref='mySwiper'>
      <swiper-slide class='pg stop-swiping'>
        <load ref='load' @slideto='slideto'></load>
      </swiper-slide>
      <swiper-slide class='pg stop-swiping'>
        <pg1 ref='pg1'></pg1>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import load from './components/load'
import pg1 from './components/pg1'

export default {
  name: 'App',
  components: {
    load,
    pg1
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
      that.swiper.slideTo(res, 200, false)
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
