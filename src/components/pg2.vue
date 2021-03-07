<template>
  <div class='pg2'>
    <div class='pg2_main' v-if='task'>
      <div class='pg2_tit'>{{task.taskname}}</div>
      <img :src="'https://static-k12edu-camprecord.codemao.cn/' + task.banner" class="pg2_banner">
      <div class='pg2_center1' v-if="uploadDataUrl===''">
        <div class='zuoyeShowBtn' id='zuoyeShowBtn'>
          <input type="file" id='zuoye_add_btn'>
          <span class='btnname'>上传图片</span>
        </div>
        <div class='pg2_center1_txt1'>仅支持jpg/png图片格式，图片1M内</div>
      </div>
      <div class='pg2_center' v-if="uploadDataUrl!==''&&(!imginfo||(imginfo&&imginfo.flag!==2))">
        <img :src="uploadDataUrl" class="pg2_userimg">
        <div style='margin-top: .48rem;font-size: 0;' >
          <div class='wl_up_btn' v-show='uploadDataUrl!==""&&flag!==0' id='wl_up_btn'>
            <input type="file" id='wl_add_btn'>
            <i class='reupload'/><span>重新上传图片</span>
          </div>
          <div class='wl_pg2_btn' @click='btnfn' v-show="flag!==0&&btnshow">提交图片</div>
        </div>
        <div class='pg2_center1_txt1'>仅支持jpg/png图片格式，图片1M内</div>
        <div class='pg2_center1_txt1' style="font-weight: 600;" v-if="imginfo&&imginfo.flag===1">您的图片已上传成功，正在审核阶段，请耐心等待</div>
        <div class='pg2_center1_txt1' style="font-weight: 600;" v-if="imginfo&&imginfo.flag===3">您的图片已没有通过审核，<br>请重新上传符合规定的图片哦！</div>
      </div>
      <div class='pg2_center' v-if="imginfo&&imginfo.flag===2">
        <img :src="uploadDataUrl" class="pg2_userimg">
        <div class='pg2_center1_txt1' style="font-weight: 600;">您的图片已审核通过，快去查看活动详情吧！</div>
        <a :href="task.url" class='wl_pg2_btn' style='margin-top: .7rem;'>点击查看详情</a>
      </div>
      <div class='main4'>
        <div class="rule_tit">活动规则</div>
        <div class="rule_body">
          <ul class="rule">
            <li class='' v-for="(item, index) in rules" :key="index">
              <span>{{ index + 1 }}</span>
              <div>{{ item }}</div>
            </li>
          </ul>
          <span class='rule_bottom'>———本此活动的最终解释权归编程猫所有———</span>
        </div>
      </div>
      <div style="height:2rem;"/>
    </div>
  </div>
</template>

<script>
import { uptoken, imgUpLoad } from '@/api/login'

export default {
  name: 'pg2',
  data () {
    return {
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
      videoinfo: null,
      rules: []
    }
  },
  computed: {
    task () {
      return this.$store.state.task
    },
    user_id () {
      return this.$store.state.user_id
    },
    imginfo () {
      return this.$store.state.imginfo
    }
  },
  mounted () {
    const that = this
    that.changeTitle(that.task.tit)
    // console.log(that.task.rules)
    that.rules = that.task.rules.split('|')
    that.init()
  },
  methods: {
    slideto (res) {
      const that = this
      that.$emit('slideto', res)
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
      // console.log(that.imginfo)
      if (that.imginfo) {
        that.uploadDataUrl = 'https://static-k12edu-camprecord.codemao.cn/' + that.imginfo.img
      }
      // console.log(that.imginfo)
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
                if (file.name.indexOf('jpg') === -1 && file.name.indexOf('jpeg') === -1 && file.name.indexOf('png') === -1 && file.name.indexOf('JPG') === -1 && file.name.indexOf('PNG') === -1 && file.name.indexOf('JPEG') === -1) {
                  that.$toast('请上传jpg或者png格式文件')
                  self.files.splice(self.files.length - 1, 1)
                  return
                }
                const size = parseInt(file.size / 1000000)
                if (size >= 1) {
                  that.$toast('图片太大啦<br>请重新选择~')
                  document.getElementById('zuoye_add_btn').value = ''
                  self.files.splice(self.files.length - 1, 1)
                  return
                }
                that.$toast('已选择图片~')
                that.btnshow = true
                that.uploadDataUrl = ''
                that.uploadDataUrl = that.getObjectURL(file.getNative())
                // console.log(that.uploadDataUrl)
                // document.getElementById('upvideo').querySelector('source').src = that.uploadDataUrl
                // document.getElementById('upvideo').src = that.uploadDataUrl
                // document.getElementById('upvideo').poster = ''
                // document.getElementById('wl_up_btn').querySelector('div').style.width = '100%'
                // document.getElementById('wl_up_btn').querySelector('div').style.height = '100%'
                // that.videoinfo = that.obj
              })
            },
            UploadProgress: function (up, file) {
              that.$loading('上传中（' + Math.floor(up.total.percent) + '%）<br>请耐心等待')
            },
            FileUploaded: function (up, file, info) {
              const res = JSON.parse(info.response)
              const img = res.key
              const data = {
                openid: window.Global.openid,
                unionid: window.Global.unionid,
                nickname: window.Global.nickname,
                headimgurl: window.Global.headimgurl,
                img,
                id: that.task.id,
                user_id: that.user_id,
                taskname: that.task.remark,
                remark: that.task.remark
              }
              imgUpLoad(data).then(res => {
                that.$loading.close()
                if (res.res === 'success') {
                  that.$toast('图片上传成功，请等待审核~')
                  that.$emit('init')
                  that.$emit('slideto', 4)
                } else if (res.res === 'update') {
                  that.$toast('图片通过审核了，无法修改~')
                  that.$emit('init')
                  that.$emit('slideto', 4)
                }
              })
              // videoUp(data).then((res) => {
              //   that.$store.commit('uVideoIndex', that.videoIndex)
              //   if (res.res === 'success') {
              //   } else if (res.res === 'again') {
              //   } else if (res.res === 'old') {
              //     that.$loading.close()
              //     that.$toast('图片不可修改啦')
              //     that.$emit('slideto', 1)
              //   } else if (res.res === 'sys' || res.res === 'nouser') {
              //     that.$toast('系统异常，请刷新重试')
              //   }
              // })
            },
            Key: function (up, file) {
              const vtype = '.jpg'
              const key = window.Global.openid + '_' + Date.parse(new Date()) + vtype
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
        that.$toast('您还未选择图片，点击按钮选择图片吧')
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
