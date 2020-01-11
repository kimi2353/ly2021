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
    slideto (res) {
      const that = this
      that.$emit('slideto', res)
    },
    init () {
      const that = this
      let i = that.videoIndex
      if (i < 0) {
        i = 0
      } else if (that.videoList.length - 1 < i) {
        i = that.videoList.length - 1
      }
      that.up(that.videoList[i], i)
    },
    ret () {
      let that = this
      that.$emit('slideto', 1)
    },
    up (obj, i) {
      const that = this
      that.$store.commit('uVideoIndex', i)
      const data = {
        'user_id': that.user_id,
        'child_name': that.child_name,
        'package_id': obj.package_id,
        'term_id': obj.term_id,
        'course_id': obj.course_id,
        'class_id': obj.class_id,
        'course_name': obj.course_name,
        'package_name': obj.package_name,
        'term_name': obj.term_name,
        'class_name': obj.class_name,
        'teacher_name': obj.teacher_name,
        'teacher_id': obj.teacher_id,
        'teacher_email': obj.teacher_email,
        'type': obj.type
      }
      if (obj.zuoye && obj.zuoye.id) {
        data['id'] = obj.zuoye.id
      }
      that.$store.commit('uObj', data)
      if (obj.zuoye === '') {
        that.slideto(2)
      } else if (obj.zuoye.flag === 4) {
        that.slideto(2)
      } else if (obj.zuoye.flag === 0) {
        that.slideto(2)
        // that.$toast('老师正在批改，请稍后查看...')
      } else {
        that.slideto(3)
      }
    }
  }
}
</script>

<style>
</style>
