<template>
  <div class='pg2'>
    <div class='pg2_main'>
      <div class='left' @click.once='to4(1)' v-show="videoIndex<videoList.length-1"/>
      <div class='right' @click.once='to4(-1)' v-show="videoIndex>0"/>
      <div class='menu' @click='ret'>全部</div>
      <div class='pg2_tit' v-if='obj'>{{obj.course_name}}</div>
      <div class='pg2_center' v-show="uploadDataUrl!==''">
        <div class='wl_up' id='wl_up'>
          <video data-setup="{}" controls v-show='uploadDataUrl!==""' id='upvideo' oncontextmenu="return false" controlslist="nodownload">
            <source type="video/mp4">
          </video>
        </div>
        <div style='margin-top: .98rem;font-size: 0;'>
          <div class='wl_up_btn' v-show='uploadDataUrl!==""&&flag!==0' id='wl_up_btn'>
            <input type="file" accept="video/*" id='wl_add_btn' capture="camcorder">
            <i class='reupload'/><span>重新上传</span>
          </div>
          <div class='wl_pg2_btn' @click='btnfn' v-show="flag!==0&&btnshow">提交作业</div>
        </div>
        <div v-show="flag!==null&&(flag===4||flag===0)">
          <div class='pg2_txt1'>{{obj.teacher_name}}点评：</div>
          <div class='pg2_txt2'>老师正在快马加鞭批改中，批改完成后将会以微信通知的方式提醒您</div>
        </div>
      </div>
      <div class='pg2_center1' v-show="uploadDataUrl===''">
        <div class='pg2_center1_txt1'>您还未上传本节课视频作业</div>
        <div class='zuoyeShowBtn' id='zuoyeShowBtn'>
          <input type="file" accept="video/*" id='zuoye_add_btn' capture="camcorder">
          <span class='btnname'>上传视频</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uptoken, classinfo, videoUp, checkclass } from '@/api/login'

export default {
  name: 'pg2',
  data () {
    return {
      scrollOptions2: {
        mouseWheel: true,
        click: false,
        tap: true,
        scrollbars: true
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
      uploader: null,
      flag: null,
      menunav: false,
      zuoyeshow: false,
      btnshow: false,
      videoinfo: null
    }
  },
  computed: {
    iscroll2 () {
      return this.$refs.iscroll2
    },
    obj () {
      return this.$store.state.obj
    },
    videoIndex () {
      return this.$store.state.videoIndex
    },
    videoList () {
      return this.$store.state.videoList
    }
  },
  mounted () {
    const that = this
    if (!that.obj) {
      that.ret()
      return
    }
    that.changeTitle('作业详情')
    that.btnshow = false
    that.init()
  },
  methods: {
    slideto (res) {
      const that = this
      that.$emit('slideto', res)
    },
    toPage (i) {
      const that = this
      that.$store.commit('uVideoIndex', i)
      that.slideto(4)
    },
    to4 (num) {
      const that = this
      let i = that.videoIndex
      if (num === 1) {
        if (i < (that.videoList.length - 1)) {
          i++
        } else {
          i = that.videoList.length
        }
        that.$store.commit('uVideoIndex', i)
        that.slideto(4)
      } else if (num === -1) {
        if (i < 1) {
          i = 0
        } else {
          i--
        }
        that.$store.commit('uVideoIndex', i)
        that.slideto(4)
      }
    },
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
      const data = Object.assign({
        openid: window.Global.openid,
        unionid: window.Global.unionid,
        nickname: window.Global.nickname,
        headimgurl: window.Global.headimgurl
      }, that.obj)
      // console.log(that.obj)
      classinfo(data).then(res => {
        if (res.res === 'success') {
          if (res.zuoye !== '') {
            that.zuoyeshow = true
            if (res.zuoye.flag === 4 || res.zuoye.flag === 0) {
              that.uploadDataUrl = res.zuoye.video
              that.flag = res.zuoye.flag
              document.getElementById('upvideo').querySelector('source').src = that.uploadDataUrl
              document.getElementById('upvideo').src = that.uploadDataUrl
              document.getElementById('upvideo').poster = that.uploadDataUrl + '?vframe/jpg/offset/0'
              // document.getElementById('wl_up').querySelector('div').style.display = 'none'
              document.getElementById('wl_up_btn').querySelector('div').style.width = '100%'
              document.getElementById('wl_up_btn').querySelector('div').style.height = '100%'
              setTimeout(() => {
                document.getElementById('wl_up_btn').querySelector('div').style.width = '100%'
                document.getElementById('wl_up_btn').querySelector('div').style.height = '100%'
              }, 800)
            } else {
              that.slideto(3)
            }
          } else {
            that.zuoyeshow = false
            document.getElementById('zuoyeShowBtn').querySelector('div').style.width = '100%'
            document.getElementById('zuoyeShowBtn').querySelector('div').style.height = '100%'
            document.getElementById('zuoyeShowBtn').querySelector('div').style.left = '0'
          }
        }
      })
      uptoken().then((res) => {
        that.uptoken = res.uptoken
        that.domain = res.domain
        that.uploader = window.Qiniu.uploader({
          runtimes: 'html5,flash,html4',
          browse_button: ['wl_add_btn', 'zuoye_add_btn'],
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
                const size = parseInt(file.size / 1000000)
                if (size >= 500) {
                  that.$toast('视频太大啦<br>请重新录制~')
                  // document.getElementById('upload').value = ''
                  document.getElementById('zuoye_add_btn').value = ''
                  self.files.splice(self.files.length - 1, 1)
                  return
                }
                that.$toast('已选择视频~')
                that.btnshow = true
                that.uploadDataUrl = ''
                that.uploadDataUrl = that.getObjectURL(file.getNative())
                document.getElementById('upvideo').querySelector('source').src = that.uploadDataUrl
                document.getElementById('upvideo').src = that.uploadDataUrl
                document.getElementById('upvideo').poster = ''
                // document.getElementById('wl_up').querySelector('div').style.display = 'none'
                document.getElementById('wl_up_btn').querySelector('div').style.width = '100%'
                document.getElementById('wl_up_btn').querySelector('div').style.height = '100%'
                that.videoinfo = that.obj
              })
            },
            UploadProgress: function (up, file) {
              // console.log(up.total.percent)
              that.$loading('上传中（' + Math.floor(up.total.percent) + '%）<br>请耐心等待')
            },
            FileUploaded: function (up, file, info) {
              const res = JSON.parse(info.response)
              const video = 'https://static-k12edu-camprecord.codemao.cn/' + res.key
              const data = Object.assign({
                openid: window.Global.openid,
                unionid: window.Global.unionid,
                nickname: window.Global.nickname,
                headimgurl: window.Global.headimgurl,
                video
              }, that.videoinfo)

              videoUp(data).then((res) => {
                that.$store.commit('uVideoIndex', that.videoIndex)
                if (res.res === 'success') {
                  that.$store.commit('uvid', res.id)
                  const data2 = {
                    openid: window.Global.openid,
                    unionid: window.Global.unionid,
                    nickname: window.Global.nickname,
                    headimgurl: window.Global.headimgurl
                  }
                  checkclass(data2).then(res => {
                    that.$loading.close()
                    that.$store.commit('uVideoList', res.myclass)
                    that.$toast('视频作业上传成功')
                    that.$emit('slideto', 4)
                  })
                } else if (res.res === 'again') {
                  that.$store.commit('uvid', res.id)
                  const data2 = {
                    openid: window.Global.openid,
                    unionid: window.Global.unionid,
                    nickname: window.Global.nickname,
                    headimgurl: window.Global.headimgurl
                  }
                  checkclass(data2).then(res => {
                    that.$loading.close()
                    that.$store.commit('uVideoList', res.myclass)
                    that.$toast('视频作业修改成功')
                    that.$emit('slideto', 4)
                  })
                } else if (res.res === 'old') {
                  that.$loading.close()
                  that.$toast('视频作业不可修改啦')
                  that.$emit('slideto', 1)
                } else if (res.res === 'sys' || res.res === 'nouser') {
                  that.$toast('系统异常，请刷新重试')
                }
              })
            },
            Key: function (up, file) {
              const vtype = '.mp4'
              const key = window.Global.openid + '_' + that.obj.course_id + '_' + Date.parse(new Date()) + vtype
              return key
            }
          }
        })
      })
    },
    ret () {
      let that = this
      that.$emit('slideto', 1)
    },
    btnfn () {
      const that = this
      if (that.uploader.files.length === 0) {
        that.$toast('您还未选择视频作业，点击按钮选择视频吧')
        return
      }
      that.uploader.files.splice(0, that.uploader.files.length - 1)
      that.$loading('上传中<br>请耐心等待')
      that.uploader.start()
    }
  }
}
</script>

<style>
</style>
