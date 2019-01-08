<template>
  <div id="app">
    <img src="./assets/logo.png" @click='center'>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  methods: {
    center: function () {
      this.$toast('bottom')
    }
  }
}
</script>

<style>
</style>
