<template>
  <div class='pg load'>
    <img src="../assets/img/wl_logo.png" class='wl_logo'>
    <img src="../assets/img/wl_load_txt1.png" class='wl_load_txt1'>
    <div class='loading'>
      <div class='loading_line'></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'load',
  data () {
    return {
      fileList: [
        '/static/img/wl_pg1_bg.jpg?1',
        '/static/img/wl_4.jpg?1',
        '/static/img/wl_6.jpg?1',
        '/static/img/wl_pg4.jpg?1',
        '/static/img/wl_pg2_alert.png?1'
      ],
      imgIndex: 0
    }
  },
  methods: {
    loadImage () {
      let that = this
      let img = new Image()
      let l = document.querySelectorAll('.loading_line')
      img.src = that.fileList[that.imgIndex]
      let percent = parseInt(that.imgIndex / that.fileList.length * 100)
      img.onload = function () {
        that.imgIndex++
        if (that.imgIndex < that.fileList.length) {
          that.loadImage()
        } else {
          percent = 100
          let id = that.getQueryString('id')
          if (id) {
            let data = new FormData()
            data.append('id', id)
            that.axios.post(that.Url + 'checkid', data).then((res) => {
              if (res.data.res === 'success') {
                that.$store.commit('uvid', id)
                that.$emit('slideto', 3)
              } else {
                that.$emit('slideto', 1)
              }
            })
          } else {
            that.$emit('slideto', 1)
          }
        }
        l[0].style.width = percent + '%'
      }
    }
  }
}
</script>

<style>
</style>
