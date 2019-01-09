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
        '/static/img/wl_pg1_bg.jpg',
        '/static/img/wl_4.jpg'
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
          that.$emit('slideto', 3)
        }
        l[0].style.width = percent + '%'
      }
    }
  }
}
</script>

<style>
</style>
