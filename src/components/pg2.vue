<template>
  <div class='pg2'>
    <div class='pg2_main'>
      <div class='return' @click='ret'>返回</div>
      <div class='right' @click.once='to4(1)' v-show="videoIndex<videoList.length-1"/>
      <div class='left' @click.once='to4(-1)' v-show="videoIndex>0"/>
      <div class='menu' @click='ret'/>
      <div class='pg2_tit' v-if='obj'>{{obj.course_name}}</div>
      <div class='pg2_center'>
        <div class='pg2_center_title'>上传你的小火箭作品吧</div>
        <div class='wl_pg2_info wl_pg2_info3'>上传视频<span>*</span></div>
        <div class='wl_up_tips'>
          <p>建议在白天使用手机拍摄，镜头不抖动，背景干净</p>
        </div>
        <div class='wl_up' id='wl_up'>
          <input type="file" class="upload" @change="upload" id="upload" accept="video/*" v-show='uploadDataUrl===""'>
          <video data-setup="{}" controls v-show='uploadDataUrl!==""' id='upvideo'>
            <source type="video/mp4">
          </video>
        </div>
        <div class='wl_up_btn' v-show='uploadDataUrl!==""&&flag!==0' id='wl_up_btn'>
          <input type="file" accept="video/*" id='wl_add_btn'>
          <span>点击重新上传</span>
        </div>
        <div class='pg2_txt1' v-show="flag!==null&&(flag===4||flag===0)">{{obj.teacher_name}}作品点评：</div>
        <div class='pg2_txt1' v-show="flag!==null&&(flag===4||flag===0)">老师正在快马加鞭批改中，批改完成后将会以微信通知的方式提醒您</div>
        <div style='height: 0.853rem;'></div>
      </div>
      <div class='wl_pg2_btn' @click='btnfn' v-show="flag!==0">提交作业</div>
      <div style='height:1.216rem;'></div>
    </div>
    <transition name='fade'>
      <div class='nav1' v-show="menunav">
        <div class='closemenu' @click="menunav=false" />
        <div class='menuborder'>
          <iscroll-view class='scroll-view' ref='iscroll2' :options='scrollOptions2'>
            <div class="menu_txt">您的课程列表</div>
            <ul class='munulist'>
              <li v-for="(item, index) in videoList" :key="index" @click="toPage(index)" :class="{flag0:item.zuoye==='', flag1:item.zuoye&&(item.zuoye.flag===1||item.zuoye.flag===2), flag2:item.zuoye&&item.zuoye.flag===4, flag3:item.zuoye&&item.zuoye.flag===0}">{{ item.course_name }}</li>
            </ul>
          </iscroll-view>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import * as qiniu from 'qiniu-js'
import { uptoken, classinfo, videoUp } from '@/api/login'

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
      menunav: false
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
    that.init()
  },
  methods: {
    menunfn () {
      const that = this
      that.menunav = true
      setTimeout(function () {
        that.iscroll2.refresh()
      }, 400)
    },
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
      const data = {
        openid: window.Global.openid,
        unionid: window.Global.unionid,
        nickname: window.Global.nickname,
        headimgurl: window.Global.headimgurl,
        ...that.obj
      }
      classinfo(data).then(res => {
        if (res.res === 'success') {
          if (res.zuoye !== '') {
            if (res.zuoye.flag === 4 || res.zuoye.flag === 0) {
              that.uploadDataUrl = res.zuoye.video
              that.flag = res.zuoye.flag
              document.getElementById('upvideo').querySelector('source').src = that.uploadDataUrl
              document.getElementById('upvideo').src = that.uploadDataUrl
              document.getElementById('upvideo').poster = that.uploadDataUrl + '?vframe/jpg/offset/0'
              document.getElementById('wl_up').querySelector('div').style.display = 'none'
              document.getElementById('wl_up_btn').querySelector('div').style.width = '100%'
              document.getElementById('wl_up_btn').querySelector('div').style.height = '100%'
            } else {
              that.slideto(3)
            }
          }
          console.log(that.flag)
        }
      })
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
                ...that.obj,
                video
              }
              videoUp(data).then((res) => {
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
        that.$toast('您还未上传本节课视频作业，点击按钮上传吧')
        return
      }
      // console.log(that.uploader.files)
      that.uploader.files.splice(0, that.uploader.files.length - 1)
      that.$loading('上传中<br>请耐心等待')
      that.uploader.start()
    }
  }
}
</script>

<style>
</style>
