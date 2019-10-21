<template>
  <div id="app">
    <transition name="fade" v-show='fade' mode="out-in">
      <div :is='moban' ref='moban' @slideto='slideto'></div>
    </transition>
  </div>
</template>

<script>
import pg1 from './components/pg1'
import pg2 from './components/pg2'
import pg3 from './components/pg3'
import pg4 from './components/pg4'

export default {
  name: 'App',
  components: {
    pg1,
    pg2,
    pg3,
    pg4
  },
  methods: {
    slideto (res) {
      let that = this
      that.fade = false
      if (res) {
        that.moban = 'pg' + res
      }
      that.fadefn()
    },
    fadefn () {
      let that = this
      setTimeout(function () {
        // that.$refs.moban.init()
        that.fade = true
      }, 1200)
    }
  },
  data () {
    return {
      moban: '',
      fade: true
    }
  },
  mounted () {
    const that = this
    const id = that.getQueryString('id')
    if (!id) {
      that.moban = 'pg1'
    } else {
      const data = {
        id
      }
      that.$store.commit('uObj', data)
      that.moban = 'pg3'
    }
  }
}
</script>

<style>
</style>
