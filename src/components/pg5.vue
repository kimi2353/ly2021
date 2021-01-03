<template>
  <div class='pg5'>
    <div class="p4_btn1" @click="toPage(2)">返回</div>
    <div class='pg main'>
      <div class='big_mo'>
        <img :src='bendi[mo-1].mo' class='img1'>
        <!-- <img :src='img' v-if='img!==""' class='img2'> -->
        <img class='animated infinite hinge pulse photo_btn' @click='btn1' v-show='!hasImg' src="https://static-k12edu-camprecord.codemao.cn/0_work4_zyu4iafv4x_1576058014000.png" />
        <div class='img2'>
          <image-cropper ref="imageCropper" :cropperConfig="cropperConfig" :callback="loadImage" @isflie="isflie"/>
        </div>
      </div>
      <ul class='mo_list'>
        <li class='mo1' :class='{active:mo===1}' @click='tomo(1)'>
          <img :src='bendi[0].mini'>
        </li>
        <!-- <li class='mo2' :class='{active:mo===2}' @click='tomo(2)'>
          <img :src='bendi[1].mini'>
        </li> -->
        <!-- <li class='mo3' :class='{active:mo===3}' @click='tomo(3)'>
          <img :src='bendi[2].mini'>
        </li> -->
      </ul>
      <ul class='btn_list'>
        <li class='animated infinite hinge p5_btn' @click='btn1'>
          重新选图
        </li>
        <li class='animated infinite hinge p5_btn' @click='btn2'>
          生成海报
        </li>
      </ul>
    </div>
    <div class='shadow' />
    <div class='hb' id='hb'>
      <div class='big_mo'>
        <img :src='bendi[mo-1].mo' class='img1'>
        <img :src='img' v-if='img!==""' class='img2'>
        <img :src='headurl' v-if='headurl!==""' class='headurl'>
        <div class="qrcode">
          <img :src='qrurl'>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import imageCropper from '@/components/imageCropper'
import { changeHaiChannel } from '@/api/article2'
export default {
  name: 'pg5',
  data () {
    return {
      mo: 1,
      cropperConfig: {
        width: 217,
        height: 386,
        quality: 0.8,
        maxWidth: 750
      },
      openid: '',
      nickname: '',
      img: '',
      bottomImg: '',
      num: 1000,
      hasImg: false,
      headurl: '',
      qrurl: ''
    }
  },
  components: {
    imageCropper
  },
  computed: {
    bendi () {
      return this.$store.state.bendi
    },
    file () {
      return this.$store.state.file
    },
    free_er () {
      return this.$store.state.free_er
    },
    haiinfo () {
      return this.$store.state.haiinfo
    }
  },
  mounted () {
    const that = this
    that.mo = 1
    that.openid = window.Global.openid
    that.nickname = window.Global.nickname
    // console.log(that.haiinfo)
    that.init()
  },
  methods: {
    isflie (res) {
      // console.log(res)
      if (res === 1) {
        this.hasImg = true
      }
    },
    btn2 () {
      const that = this
      if (!that.hasImg) {
        that.$toast('请点击拍照')
        return
      }
      that.headurl = process.env.IMG_URL + 'zjuser/' + window.Global.openid + '.jpg'
      that.qrurl = process.env.QRC_URL + 'er_' + window.Global.openid + '_40_' + that.free_er + '.png'
      that.$loading('正在渲染海报，请稍后...')
      that.$refs.imageCropper.confirm()
    },
    html2Canvas: function () {
      const that = this
      let shareContent = document.querySelector('#hb')
      let width = shareContent.clientWidth
      let height = shareContent.clientHeight

      let canvas = document.createElement('canvas')
      let context = canvas.getContext('2d')
      let scaleBy = 3
      canvas.width = width * scaleBy
      canvas.height = height * scaleBy
      context.scale(scaleBy, scaleBy)

      let opts = {
        allowTaint: true,
        tainttest: false,
        canvas: canvas,
        width: width * scaleBy,
        height: height * scaleBy,
        onrendered: function (canvas) {
          canvas.id = 'mycanvas'
          let dataUrl = canvas.toDataURL()
          that.$loading.close()
          // console.log(dataUrl)
          let sys = []
          for (let i = 0; i < that.haiinfo.length; i++) {
            if (that.haiinfo[i].package_id === that.free_er) {
              sys = that.haiinfo[i].sys
            }
          }
          const haiinfo = [
            {
              model: dataUrl,
              sys
            }
          ]
          // console.log(haiinfo)
          that.$store.commit('uHaiinfo', haiinfo)
          that.$emit('slideto', 4)
        }
      }
      window.html2canvas(shareContent, opts)
    },
    btn1 () {
      const that = this
      that.$refs.imageCropper.checkPhoto()
    },
    toPage (i) {
      const that = this
      that.$emit('slideto', i)
    },
    init () {
      const that = this
      let utmSource = that.getQueryString('utm_source')
      let utmContent = that.getQueryString('utm_content')
      let utmTerm = that.getQueryString('utm_term')
      if (!utmSource) {
        utmSource = 'poster'
      }
      if (!utmTerm) {
        utmTerm = 'gxh'
      }
      if (!utmContent) {
        utmContent = 'default'
      }
      changeHaiChannel({
        openid: window.Global.openid,
        workid: 40,
        utm_source: utmSource,
        utm_term: utmTerm,
        utm_content: utmContent
      })
    },
    tomo (i) {
      const that = this
      that.mo = i
    },
    loadImage (img) {
      const that = this
      that.img = img
      setTimeout(() => {
        that.html2Canvas()
      }, 1200)
    }
  }
}
</script>

<style>
</style>
