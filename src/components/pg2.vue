<template>
  <div class='pg2'>
    <!-- <iscroll-view class='scroll-view' ref='iscroll2' :options='scrollOptions'> -->
      <div class='pg2_main'>
        <div class='return' @click='ret'>返回</div>
        <div class='pg2_tit'>上传你最酷炫的作品吧</div>
        <div class='pg2_center'>
          <div class='wl_pg2_info wl_pg2_info1'>个人信息</div>
          <div class='wl_pg2_msg'>
            <div>
              <span>姓名</span>
              <input maxlength='5' v-model='username' type='text' @blur='inputBlur'>
            </div>
            <div>
              <span>年级</span>
              <input maxlength='5' v-model='grade' type='text' @blur='inputBlur'>
            </div>
            <div>
              <span>QQ</span>
              <input maxlength='14' v-model='qq' type='text' placeholder='为方便获奖通知，请务必填写' @blur='inputBlur'>
            </div>
            <div>
              <span>手机</span>
              <input maxlength='11' v-model='tel' type='text' placeholder='为方便获奖通知，请务必填写' @blur='inputBlur'>
            </div>
          </div>
          <div class='wl_pg2_info wl_pg2_info2'>实验主题<span>*</span></div>
          <input placeholder='填写你的作品主题，不超过15个字' maxlength='15' class='wl_info_tit' v-model='title' type='text'>
          <div class='wl_pg2_info wl_pg2_info3'>上传视频<span>*</span></div>
          <div class='wl_up_tips'>
            <p>建议横屏拍摄，视频时长在15-30秒之间</p>
            <p>建议白天拍摄，镜头不抖动，背景干净</p>
            <p>如果能真人出镜，外加配音解读能为你带来更多投票哦！</p>
          </div>
          <div class='wl_up'>
            <input type="file" class="upload" @change="upload" id="upload" accept="video/*" v-show='uploadDataUrl===""'>
            <video preload="auto" data-setup="{}" controls v-if='uploadDataUrl!==""' id='upvideo' :poster='imgsrc'>
              <source type="video/mp4" :src="uploadDataUrl">
            </video>
          </div>
          <div class='wl_pg2_info wl_pg2_info4'>实验心得<span>*</span></div>
          <textarea placeholder="写下你的实验心得吧，走心的心得体会可是比赛加分法宝哦，最多200字内" class='wl_pg2_textarea' maxlength="200" v-model='txt' type='text' @blur="inputBlur"></textarea>
          <div style='height: 0.853rem;'></div>
        </div>
        <img src="../assets/img/wl_pg2_btn.png" class='wl_pg2_btn' @click='btnfn'>
        <div style='height:1.216rem;'></div>
      </div>
    <!-- </iscroll-view> -->
    <transition name="fade">
      <div class='nav' v-show='alert'>
        <div class='wl_pg2_alert'>
          <img src="../assets/img/wl_pg2_btn1.png" @click='alert=false'>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import * as qiniu from 'qiniu-js'

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
      alert: false,
      imgsrc: '',
      uploader: null
    }
  },
  computed: {
    iscroll2 () {
      return this.$refs.iscroll2
    }
  },
  mounted () {
    let that = this
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
      let that = this
      that.axios.get(that.Url2 + 'uptoken.php').then((res) => {
        that.uptoken = res.data.uptoken
        that.domain = res.data.domain
        that.uploader = window.Qiniu.uploader({
          runtimes: 'html5,flash,html4',
          browse_button: 'upload',
          get_new_uptoken: false,
          uptoken: that.uptoken,
          domain: that.domain,
          chunk_size: '0mb',
          auto_start: false,
          init: {
            FilesAdded: function (up, files) {
              window.plupload.each(files, function (file) {
                if (!file) {
                  return
                }
                if (file.name.indexOf('mp4') === -1 && file.name.indexOf('MP4') === -1 && file.name.indexOf('MOV') === -1 && file.name.indexOf('mov') === -1) {
                  that.$toast('请上传MP4或者MOV格式文件')
                  return
                }
                let size = parseInt(file.size / 1000000)
                if (size >= 200) {
                  that.$toast('视频太大啦<br>请重新录制~')
                  document.getElementById('upload').value = ''
                  return
                }
                that.uploadDataUrl = that.getObjectURL(file.getNative())
              })
            },
            UploadProgress: function (up, file) {
              // console.log(up.total.percent)
              that.$loading('上传中（' + Math.floor(up.total.percent) + '%）<br>请耐心等待')
            },
            FileUploaded: function (up, file, info) {
              let res = JSON.parse(info.response)
              let video = 'https://static-k12edu-camprecord.codemao.cn/' + res.key
              let data = new FormData()
              data.append('username', that.username)
              data.append('grade', that.grade)
              data.append('tel', that.tel)
              data.append('qq', that.qq)
              data.append('title', that.title)
              data.append('txt', that.txt.replace(/\n/g, '<br>'))
              data.append('video', video)
              // data.append('imgsrc', that.imgsrc)
              that.axios.post(that.Url + 'userinfo', data).then((res) => {
                if (res.data.res === 'success') {
                  that.$loading.close()
                  that.setCookie('wl_tel', that.tel, 99)
                  that.setCookie('wuli_ismy_' + res.data.id, 'wuli_ismy_' + res.data.id, 99)
                  that.$store.commit('uvid', res.data.id)
                  that.$store.commit('ureturn', '')
                  that.$emit('slideto', 3)
                }
              })
            },
            Key: function (up, file) {
              var vtype = '.mp4'
              let key = that.tel + '_' + Date.parse(new Date()) + vtype
              return key
            }
          }
        })
      })
      that.toShare()
      that.username = ''
      that.grade = ''
      that.qq = ''
      that.tel = that.getCookie('wl_tel')
      that.title = ''
      that.txt = ''
      that.uploadDataUrl = ''
      that.imgsrc = ''
      // that.iscroll2.refresh()
    },
    ret () {
      let that = this
      that.$emit('slideto', 1)
    },
    captureImage () {
      let that = this
      let video = document.getElementById('upvideo')
      let canvas = document.createElement('canvas')
      canvas.width = '310'
      canvas.height = '173'
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.width)
      that.imgsrc = canvas.toDataURL('image/png')
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
      let that = this
      if (that.username === '') {
        that.alert = true
        return
      }
      if (that.grade === '') {
        that.alert = true
        return
      }
      if (that.qq === '') {
        that.alert = true
        return
      }
      if (that.tel === '') {
        that.alert = true
        return
      }
      if (!that.tel.match(/^(((1[3-9][0-9]))+\d{8})$/)) {
        that.$toast('请填正确的联系电话')
        return
      }
      if (that.title === '') {
        that.alert = true
        return
      }
      if (that.txt === '') {
        that.alert = true
        return
      }
      if (that.uploadDataUrl === '') {
        that.$toast('请上传视频')
        return
      }
      that.$loading('上传中<br>请耐心等待')
      // var vtype = '.mp4'
      // that.captureImage()
      that.uploader.start()
      // let key = that.tel + '_' + Date.parse(new Date()) + vtype
      // let putExtra = {
      //   fname: key,
      //   params: {}
      // }
      // let config = {
      //   useCdnDomain: true,
      //   region: window.qiniu.region.z0
      // }
      // let observer = {
      //   next (res) {
      //     that.$loading('上传中（' + Math.floor(res.total.percent) + '%）<br>请耐心等待')
      //   },
      //   complete (res) {
      //     let video = 'https://static-k12edu-camprecord.codemao.cn/' + res.key
      //     let data = new FormData()
      //     data.append('username', that.username)
      //     data.append('grade', that.grade)
      //     data.append('tel', that.tel)
      //     data.append('qq', that.qq)
      //     data.append('title', that.title)
      //     data.append('txt', that.txt.replace(/\n/g, '<br>'))
      //     data.append('video', video)
      //     data.append('imgsrc', that.imgsrc)
      //     that.axios.post(that.Url + 'userinfo', data).then((res) => {
      //       if (res.data.res === 'success') {
      //         that.$loading.close()
      //         that.setCookie('wl_tel', that.tel, 99)
      //         that.setCookie('wuli_ismy_' + res.data.id, 'wuli_ismy_' + res.data.id, 99)
      //         that.$store.commit('uvid', res.data.id)
      //         that.$emit('slideto', 3)
      //       }
      //     })
      //   },
      //   error (err) {
      //     alert('err:' + JSON.stringify(err))
      //   }
      // }
      // var observable = window.qiniu.upload(file, key, that.uptoken, putExtra, config)
      // observable.subscribe(observer)
    }
  }
}
</script>

<style>
</style>
