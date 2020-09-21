<template>
  <div class='pg2'>
    <div class='pg2_main'>
      <div class='main4'>
        <div class="p2_btn1" @click="slideto(1)">返回</div>
        <div class="p2_btn2" @click="rule_nav=true"/>
        <img v-if="shenhe" :src="'https://static-k12edu-camprecord.codemao.cn/' + shenhe.tab_banner" class="tab_banner">
        <div v-show="zjtab" class="tohai" @click="topic">生成专属海报</div>
        <div v-show="jytab" class="tohai" @click="tojy">我的结营证书</div>
      </div>
      <div class="main2">
        <div class='pg2_txt1'>{{ zuoye_num===0 ? '分享截图，赢丰厚奖品' : ('再完成' + (shenhetab.length - zuoye_num) + '个任务有机会得到丰厚奖品~') }}</div>
      </div>
      <ul class="shenhetab">
        <li v-for="(item, index) in shenhetab" :key="index">
          <div>
            <span class='sh_txt1'>{{ item.name }}</span>
            <span v-if="item.zuoye.disabled_begin" class="sh_upload_info sh_upload_info1">（活动未开始）</span>
            <span v-if="item.zuoye.disabled_end" class="sh_upload_info sh_upload_info2">（活动已过期）</span>
            <span v-if="!item.zuoye.disabled" class="sh_upload_info sh_upload_info3">（活动进行中）</span>
          </div>
          <span class='sh_txt2'>{{ format(item.begin) }}-{{ format(item.end) }}</span>
          <div class='upload' v-if="!item.zuoye.disabled||(item.zuoye.disabled&&item.zuoye.img)">
            <img v-if="item.zuoye.flag&&item.zuoye.img" :src="item.zuoye.img" class='pre_load'>
            <van-uploader
              v-if="!item.zuoye.flag"
              v-model="item.zuoye.fileList"
              :preview-full-image="false"
              :show-upload="!item.zuoye.flag||item.zuoye.flag==3||item.zuoye.flag==1"
              :max-size="5 * 1024 * 1024"
              :deletable="(!item.zuoye.flag||item.zuoye.flag==3||item.zuoye.flag==1)&&!(item.zuoye.disabled||shenhe.begin>now||shenhe.end<now)"
              :disabled="item.zuoye.disabled||shenhe.begin>now||shenhe.end<now"
              max-count="1"
              :name="index"
              @oversize="onOversize"
              :after-read="readfn2"
              />
          </div>
          <div class="tab_info" v-if="!item.zuoye.disabled">
            <!-- <span v-if="item.zuoye.disabled" class="upload_info1">不在活动参与期内</span> -->
            <div v-if="!item.zuoye.flag&&item.zuoye.fileList.length>0" class="upload_info2" @click="uploadfn(index)">
              提交截图
            </div>
            <span v-else-if="item.zuoye.fileList.length===0" class="upload_info1 upload_info4">
              <img src="@/assets/img/sh_ico1.png" class="ico">
              还未上传任何截图
            </span>
            <div v-else-if="item.zuoye.flag===1">
              <span class="upload_info1 upload_info3">
                <img src="@/assets/img/sh_ico3.png" class="ico">
                审核中，耐心等待哦~
              </span>
              <van-uploader
                v-if="!(item.zuoye.disabled||shenhe.begin>now||shenhe.end<now)&&item.zuoye.flag!=2"
                max-count="1"
                :name="index"
                :max-size="5 * 1024 * 1024"
                :after-read="readfn"
                @oversize="onOversize">
                <div class="upload_info6" />
              </van-uploader>
            </div>
            <span v-else-if="item.zuoye.flag===2" class="upload_info1 upload_info7">
              <img src="@/assets/img/sh_ico2.png" class="ico">
              已通过，再接再厉哦~
            </span>
            <div v-else-if="item.zuoye.flag===3">
              <span class="upload_info1 upload_info5">
                <img src="@/assets/img/sh_ico4.png" class="ico">
                审核不通过（{{item.zuoye.bo}}）
              </span>
              <van-uploader
                v-if="!(item.zuoye.disabled||shenhe.begin>now||shenhe.end<now)&&item.zuoye.flag!=2"
                max-count="1"
                :name="index"
                :max-size="5 * 1024 * 1024"
                :after-read="readfn"
                @oversize="onOversize">
                <div class="upload_info6" />
              </van-uploader>
            </div>
          </div>
        </li>
      </ul>
      <div style="height:2rem;"/>
    </div>
    <transition name="fade">
      <div class='nav' v-show="suc_nav">
        <div class='p2_nav'>
          <img src="@/assets/img/p2_nav.png" class='p2_nav_img'>
          <span class="p2_nav_tit">截图提交成功</span>
          <span class="p2_nav_msg">请耐心等待截图审核</span>
          <div class='p2_nav_btn' @click="suc_nav=false">确定</div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class='nav' v-show="rule_nav">
        <div class='rule_border'>
          <div class="rule_tit" />
          <div class="rule_close" @click="rule_nav=false"/>
          <div class="rule_content">
            <div class="rule_body">
              <ul class="rule">
                <li v-for="(item, index) in rules" :key="index">
                  <span>{{ index + 1 }}、</span>
                  <div>{{ item }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { uptoken, shenhetabinfo, shenheupload } from '@/api/login'
import { Toast } from 'vant'
import axios from 'axios'

export default {
  name: 'pg2',
  data () {
    return {
      uploadDataUrl: '',
      uptoken: '',
      domain: '',
      uploader: null,
      flag: null,
      rules: [],
      task: null,
      imginfo: null,
      pg2_txt1: '',
      zuoye_num: 0,
      shenhetab: [],
      readindex: null,
      now: 0,
      files: [],
      shenhe: null,
      workid: 40,
      suc_nav: false,
      zjtab: false,
      jytab: false,
      rule_nav: false,
      preimg: null
    }
  },
  computed: {
    sid () {
      return this.$store.state.sid
    },
    user_id () {
      return this.$store.state.user_id
    },
    package_id () {
      return this.$store.state.package_id
    }
  },
  mounted () {
    const that = this
    uptoken().then(res => {
      that.uptoken = res.uptoken
      that.domain = res.domain
    })
    that.init()
  },
  methods: {
    beforeReadfn (index, name) {
      console.log(index)
      console.log(name)
    },
    readfn2 (res, name) {
      const that = this
      console.log(res)
      console.log(name)
      const fileList = that.shenhetab[name.name]
      console.log(fileList)
    },
    readfn (res, name) {
      const that = this
      const fileList = that.shenhetab[name.name]
      fileList.zuoye.flag = 0
      fileList.zuoye.img = res.content
      fileList.zuoye.fileList = [res]
      that.$set(that.shenhetab, name.name, fileList)
    },
    topic () {
      const that = this
      const bp = {
        'element': '生成专属海报',
        'page_name': '详情页-' + that.shenhe.remark
      }
      that.$emit('btnInfo', bp)
      that.$emit('createImg')
      // window.location.href = 'https://festival.codemao.cn/h5/zj2020?page=hai&workid=' + that.workid
    },
    tojy () {
      const that = this
      const bp = {
        'element': '我的结营证书',
        'page_name': '详情页-' + that.shenhe.remark
      }
      that.$emit('btnInfo', bp)
      // that.$emit('createImg')
      window.location.href = 'https://festival.codemao.cn/h5/jyzs2019'
    },
    tourl (url) {
      const that = this
      const bp = {
        'element': '活动详情',
        'page_name': '详情页-' + that.shenhe.remark
      }
      that.$emit('btnInfo', bp)
      window.location.href = url
    },
    upload () {
      const that = this
      let img = []
      for (let i = 0; i < that.files.length && i < 3; i++) {
        img.push(that.files[i].url)
      }
      img = img.join(',')
      const utmContent = that.getQueryString('utm_content')
      const utmTerm = that.getQueryString('utm_term')
      const utmSource = that.getQueryString('utm_source')
      const data = {
        openid: window.Global.openid,
        unionid: window.Global.unionid,
        headimgurl: window.Global.headimgurl,
        nickname: window.Global.nickname,
        user_id: that.user_id,
        package_id: that.package_id,
        utm_content: utmContent,
        utm_term: utmTerm,
        utm_source: utmSource,
        sid: that.sid,
        img,
        shid: that.shenhetab[that.readindex].id
      }
      shenheupload(data).then(res => {
        // console.log(res)
        that.$loading.close()
        if (res.res === 'time') {
          Toast('不在活动参与期内')
        } else if (res.res === 'package_id') {
          Toast('对不起，您暂无参与资格')
        } else if (res.res === 'noflag') {
          Toast('对不起，您暂时无法更新您的上传图片')
        } else if (res.res === 'nopic') {
          Toast('请选择图片并上传')
        } else if (res.res === 'success') {
          that.suc_nav = true
          that.init()
        }
      })
    },
    uploadVoice (index) {
      const that = this
      let i = index
      if (that.files.length > i) {
        if (that.files[i].url) {
          that.uploadVoice(++i)
        } else {
          const formData = new FormData()
          // console.log(that.files[i].file.type)
          let j = '.png'
          if (that.files[i].file.type === 'image/jpeg') {
            j = '.jpg'
          } else if (that.files[i].file.type === 'image/gif') {
            j = '.gif'
          }
          const key = that.randomWord() + j
          formData.append('resource_key', key)
          formData.append('token', that.uptoken)
          formData.append('file', that.files[i].file)
          formData.append('key', key)
          axios.post('https://upload.qiniup.com', formData).then(res => {
            that.files[i].url = 'https://static-k12edu-camprecord.codemao.cn/' + res.data.key
            that.uploadVoice(++i)
          })
        }
      } else {
        that.upload()
      }
    },
    uploadfn (index) {
      const that = this
      // console.log(this.shenhetab[index].zuoye.fileList)
      if (that.shenhetab[index].zuoye.fileList.length > 0) {
        that.readindex = index
        that.files = that.shenhetab[that.readindex].zuoye.fileList
        that.$loading('上传中<br>请耐心等待')
        const bp = {
          'element': '提交截图',
          'page_name': '详情页-' + that.shenhe.remark
        }
        that.$emit('btnInfo', bp)
        that.uploadVoice(0)
      }
    },
    randomWord () {
      let str = ''
      const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      // 随机产生
      for (let i = 0; i < 20; i++) {
        str += arr[Math.round(Math.random() * (arr.length - 1))]
      }
      str += Date.parse(new Date())
      return str
    },
    onOversize (file) {
      // console.log(file)
      Toast('图片太大啦~')
    },
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
      const utmContent = that.getQueryString('utm_content')
      const utmTerm = that.getQueryString('utm_term')
      const utmSource = that.getQueryString('utm_source')
      const data = {
        openid: window.Global.openid,
        unionid: window.Global.unionid,
        headimgurl: window.Global.headimgurl,
        nickname: window.Global.nickname,
        user_id: that.user_id,
        package_id: that.package_id,
        utm_content: utmContent,
        utm_term: utmTerm,
        utm_source: utmSource,
        sid: that.sid
      }
      that.readindex = null
      that.now = 0
      that.files = []
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      })
      shenhetabinfo(data).then(res => {
        // console.log(res)
        toast.clear()
        if (res.res === 'error') {
          Toast('参数错误')
          that.slideto(1)
        } else {
          that.shenhe = res.shenhe
          document.title = that.shenhe.remark
          const pagename = '详情页-' + that.shenhe.remark
          that.$emit('pageInfo', pagename)
          that.rules = that.shenhe.rules.split('|')
          that.zuoye_num = 0
          that.now = res.now
          that.zjtab = that.shenhe.zjtab === 1
          that.jytab = that.shenhe.jytab === 1
          if (res.zj) {
            that.workid = res.zj[0].id
          }
          const haiinfo = []
          for (let i = 0; i < res.haiinfo.length; i++) {
            res.haiinfo[i].img = process.env.IMG_URL + 'img/' + res.haiinfo[i].img
            res.haiinfo[i].qrurl = process.env.QRC_URL + 'er_' + window.Global.openid + '_' + that.workid + '_' + res.haiinfo[i].package_id + '.png'
            if (res.haiinfo[i].sys) {
              res.haiinfo[i].sys = res.haiinfo[i].sys.split('|')
            } else {
              res.haiinfo[i].sys = []
            }
            haiinfo.push(res.haiinfo[i])
          }
          // console.log(that.haiinfo)
          that.$store.commit('uHaiinfo', haiinfo)
          for (let i = 0; i < res.shenhetab.length; i++) {
            if (res.shenhetab[i].zuoye) {
              that.zuoye_num++
              res.shenhetab[i].zuoye.fileList = []
              res.shenhetab[i].zuoye.disabled_begin = (that.now < res.shenhetab[i].begin)
              res.shenhetab[i].zuoye.disabled_end = (that.now > res.shenhetab[i].end)
              res.shenhetab[i].zuoye.disabled = !(that.now >= res.shenhetab[i].begin && that.now <= res.shenhetab[i].end)
              const img = res.shenhetab[i].zuoye.img.split(',')
              for (let j = 0; j < img.length; j++) {
                res.shenhetab[i].zuoye.fileList.push({
                  url: img[j],
                  size: 200
                })
              }
            } else {
              res.shenhetab[i].zuoye = {
                fileList: [],
                disabled: !(that.now >= res.shenhetab[i].begin && that.now <= res.shenhetab[i].end),
                disabled_begin: (that.now < res.shenhetab[i].begin),
                disabled_end: (that.now > res.shenhetab[i].end)
              }
            }
          }
          that.shenhetab = res.shenhetab
          // console.log(res.shenhetab)
          that.toShare(that.shenhe.id, that.shenhe.sharetit, that.shenhe.sharedec)
        }
      })
    },
    ret () {
      let that = this
      that.$emit('slideto', 1)
    },
    format (shijianchuo) {
      if (!shijianchuo) {
        return ''
      }
      const time = new Date(shijianchuo * 1000)
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      // const h = time.getHours()
      // const mm = time.getMinutes()
      // const s = time.getSeconds()
      function shi (s) {
        s = '' + s
        if (s.length < 2) {
          s = '0' + s
        }
        return s
      }
      return y + '.' + shi(m) + '.' + shi(d)
    }
  }
}
</script>

<style>
</style>
