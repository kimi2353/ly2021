<template>
  <div class='pg4'>
  </div>
</template>

<script>
export default {
  name: 'pg4',
  data () {
    return {
    }
  },
  computed: {
    type () {
      return this.$store.state.type
    },
    videoIndex () {
      return this.$store.state.videoIndex
    },
    videoList () {
      return this.$store.state.videoList
    },
    user_id () {
      return this.$store.state.user_id
    },
    child_name () {
      return this.$store.state.child_name
    }
  },
  mounted () {
    const that = this
    that.init()
  },
  methods: {
    init () {
      const that = this
      setTimeout(() => {
        that.$emit('slideto', 2)
      }, 500)
    }
  }
}
</script>

<style>
</style>
