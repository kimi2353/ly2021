<template>
  <div class='pg2'>
    <div class='pg2_main'>
      <div class='return' @click='ret'>返回</div>
      <div class='pg2_tit'>上传你最酷炫的作品吧</div>
      <div class='pg2_center'>
        <div class='pg2_center_title' v-if='obj'>{{obj.classname}}</div>
        <div class='wl_pg2_info wl_pg2_info3'>上传视频<span>*</span></div>
        <div class='wl_up_tips'>
          <p>建议在微信App中横屏拍摄</p>
          <p>建议白天拍摄，镜头不抖动，背景干净</p>
        </div>
        <div class='wl_up' id='wl_up'>
          <input type="file" class="upload" @change="upload" id="upload" accept="video/*" v-show='uploadDataUrl===""'>
          <video data-setup="{}" controls v-show='uploadDataUrl!==""' id='upvideo'>
            <source type="video/mp4">
          </video>
        </div>
        <div class='wl_up_btn' v-show='uploadDataUrl!==""' id='wl_up_btn'>
          <input type="file" accept="video/*" id='wl_add_btn'>
          <span>点击重新上传</span>
        </div>
        <div style='height: 0.853rem;'></div>
      </div>
      <img src="../assets/img/wl_pg2_btn.png" class='wl_pg2_btn' @click='btnfn'>
      <div style='height:1.216rem;'></div>
    </div>
  </div>
</template>

<script>
// import * as qiniu from 'qiniu-js'
import { uptoken, classinfo, userinfo } from '@/api/login'

export default {
  name: 'pg2',
  data () {
    return {
      scrollOptions: {
        mouseWheel: true,
        click: false,
        tap: true
      },
      uploadDataUrl: '',
      uptoken: '',
      domain: '',
      username: '',
      grade: '',
      qq: '',
      tel: '',
      title: '',
      txt: '',
      imgsrc: '',
      uploader: null
    }
  },
  computed: {
    iscroll2 () {
      return this.$refs.iscroll2
    },
    obj () {
      return this.$store.state.obj
    }
  },
  mounted () {
    const that = this
    if (!that.obj) {
      that.ret()
      return
    }
    that.init()
  },
  methods: {
    getObjectURL (file) {
      let url = null
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file)
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file)
      }
      return url
    },
    init () {
      const that = this
      uptoken().then((res) => {
        that.uptoken = res.uptoken
        that.domain = res.domain
        that.uploader = window.Qiniu.uploader({
          runtimes: 'html5,flash,html4',
          browse_button: ['upload', 'wl_add_btn'],
          get_new_uptoken: false,
          uptoken: that.uptoken,
          domain: that.domain,
          chunk_size: '0mb',
          auto_start: false,
          multi_selection: false,
          init: {
            FilesAdded: function (up, files) {
              const self = this
              window.plupload.each(files, function (file) {
                if (!file) {
                  return
                }
                if (file.name.indexOf('mp4') === -1 && file.name.indexOf('MP4') === -1 && file.name.indexOf('MOV') === -1 && file.name.indexOf('mov') === -1) {
                  that.$toast('请上传MP4或者MOV格式文件')
                  self.files.splice(self.files.length - 1, 1)
                  return
                }
                let size = parseInt(file.size / 1000000)
                if (size >= 500) {
                  that.$toast('视频太大啦<br>请重新录制~')
                  document.getElementById('upload').value = ''
                  self.files.splice(self.files.length - 1, 1)
                  return
                }
                that.$toast('已选择视频~')
                that.uploadDataUrl = ''
                that.uploadDataUrl = that.getObjectURL(file.getNative())
                document.getElementById('upvideo').querySelector('source').src = that.uploadDataUrl
                document.getElementById('upvideo').src = that.uploadDataUrl
                document.getElementById('wl_up').querySelector('div').style.display = 'none'
                document.getElementById('wl_up_btn').querySelector('div').style.width = '100%'
                document.getElementById('wl_up_btn').querySelector('div').style.height = '100%'
              })
            },
            UploadProgress: function (up, file) {
              // console.log(up.total.percent)
              that.$loading('上传中（' + Math.floor(up.total.percent) + '%）<br>请耐心等待')
            },
            FileUploaded: function (up, file, info) {
              const res = JSON.parse(info.response)
              const video = 'https://static-k12edu-camprecord.codemao.cn/' + res.key
              const data = {
                openid: window.Global.openid,
                unionid: window.Global.unionid,
                nickname: window.Global.nickname,
                headimgurl: window.Global.headimgurl,
                id: that.obj.id,
                video
              }
              userinfo(data).then((res) => {
                that.$loading.close()
                if (res.res === 'success') {
                  that.$store.commit('uvid', res.id)
                  that.$toast('视频作业上传成功')
                  that.$emit('slideto', 1)
                } else if (res.res === 'again') {
                  that.$store.commit('uvid', res.id)
                  that.$toast('视频作业修改成功')
                  that.$emit('slideto', 1)
                } else if (res.res === 'old') {
                  that.$toast('视频作业不可修改啦')
                  that.$emit('slideto', 1)
                }
              })
            },
            Key: function (up, file) {
              const vtype = '.mp4'
              const key = window.Global.openid + '_' + that.obj.id + '_' + Date.parse(new Date()) + vtype
              return key
            }
          }
        })
        const data = {
          openid: window.Global.openid,
          unionid: window.Global.unionid,
          nickname: window.Global.nickname,
          headimgurl: window.Global.headimgurl,
          id: that.obj.id
        }
        classinfo(data).then(res => {
          if (res.res === 'success') {
            if (res.zuoye !== '') {
              that.uploadDataUrl = res.zuoye.video
              document.getElementById('upvideo').querySelector('source').src = that.uploadDataUrl
              document.getElementById('upvideo').src = that.uploadDataUrl
              document.getElementById('wl_up').querySelector('div').style.display = 'none'
              document.getElementById('wl_up_btn').querySelector('div').style.width = '100%'
              document.getElementById('wl_up_btn').querySelector('div').style.height = '100%'
            }
          }
        })
      })
    },
    ret () {
      let that = this
      that.$emit('slideto', 1)
    },
    upload () {
      let that = this
      let files = document.getElementById('upload').files[0]
      if (!files) {
        return
      }
      let size = parseInt(files.size / 1000000)
      if (size >= 200) {
        that.$toast('视频太大啦<br>请重新录制~')
        document.getElementById('upload').value = ''
        return
      }
      that.uploadDataUrl = that.getObjectURL(files)
    },
    btnfn () {
      const that = this
      if (that.uploader.files.length === 0) {
        that.$toast('请选择视频上传')
        return
      }
      console.log(that.uploader.files)
      that.uploader.files.splice(0, that.uploader.files.length - 1)
      that.$loading('上传中<br>请耐心等待')
      that.uploader.start()
    }
  }
}
</script>

<style>
</style>
