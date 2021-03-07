<template>
  <div class='pg1'>
    <iscroll-view class='scroll-view' ref='iscroll1' :options='scrollOptions' @scroll='scrollfn' @pullUp='load' @scrollEnd='scrollfn'>
      <div class="all_main">
        <div class='pg1_main'>
          <!-- <img src="@/assets/img/bg.jpg" class="bg"> -->
          <div class="all_num">{{ all_num }}</div>
          <div>
            <div class="jing_tit"/>
            <ul class="jing">
              <li v-for="(item, index) in jinglist" :key="index">
                <div class="jing_info">
                  <div class="jing_txt1">{{ item.by }}的留言</div>
                  <div class="jing_txt2">“{{ item.txt }}”</div>
                </div>
                <div class="tojing" @click.stop="tojingfn(index)"/>
              </li>
            </ul>
          </div>
          <ul class='typelist' :class="{active1:(btntype!==1||my.length==0), active2: btntype===1&&my.length>0}">
            <li :class="{active: type===1}" @click="typefn(1)">热门HOT</li>
            <li :class="{active: type===2}" @click="typefn(2)">最新NEW</li>
            <li :class="{active: type===3}" v-show="btntype===1&&my.length>0" @click="typefn(3)" >我的留言</li>
          </ul>
          <div class='yan'>
            <ul class="ulData">
              <li v-for='(item, index) in ulData' :key='index'>
                <div class="yan_tit">
                  <div class="n_info">
                    <div class="n1">
                      <img :src="item.headimgurl">
                    </div>
                    <div class="nickname">{{item.by}}</div>
                    <img src="@/assets/img/n3.png" class="n3">
                  </div>
                  <div class="bb" />
                  <div class="righttxt">
                    <div class="zan" v-if="item.flag==2" :class="{zan1:!item.zan,zan2:item.zan}" @click="goodBtn(item.id)">
                      <span v-show="item.num">{{item.num}}</span>
                    </div>
                    <div v-if="type===3&&item.flag===3" class="edit" @click="edit(item)"/>
                  </div>
                </div>
                <div class="info">
                  <div class="txt" :class="{no_txt: item.flag===3}" v-show="item.show">
                    {{item.txt}}
                    <span v-if="type===3&&item.flag===1" class="txt_f1">（待审核）</span>
                    <span v-if="type===3&&item.flag===2" class="txt_f2">（审核通过）</span>
                    <span v-if="type===3&&item.flag===3" class="txt_f3">（未通过-可重新提交）</span>
                  </div>
                  <div class="txt" :class="{no_txt: item.flag===3}" v-show="!item.show">
                    {{item.txt.slice(0, 60) + '...' }}
                    <span v-if="type===3&&item.flag===1" class="txt_f1">（待审核）</span>
                    <span v-if="type===3&&item.flag===2" class="txt_f2">（审核通过）</span>
                    <span v-if="type===3&&item.flag===3" class="txt_f3">（未通过-可重新提交）</span>
                    <span class="zhankai" @click="showbtn(item.id)">展开</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </iscroll-view>
    <!-- <div v-show="top_show" class="totop" @click="topfn"/> -->
    <div class="btnlist" v-show="!(btntype===1&&my.length>0&&my[0].flag!==2)">
      <div v-show="btntype===1&&my.length===0" class="tea_btn1" @click="yannavfn" />
      <div v-show="btntype===2" class="tea_btn3" @click="buy" />
      <div class="tea_blist" v-show="btntype===1&&my.length>0&&my[0].flag===2">
        <div class="tea_btn4" @click="htmlfn" />
      </div>
    </div>
    <div class="p1_tips" v-show="my.length>0&&my[0].flag==1">
      <img src="@/assets/img/p1_tips2.png" class="p1_tips2">
    </div>
    <transition name="falde">
      <div class='nav nav1' v-show="yannav">
        <div class="yaninput">
          <div class="yan_close" @click="yannavbtn(yaninfo.type)"/>
          <div class="yaninput_info">
            <img :src="headimgurl" class='yan_head'>
            <span class="yan_nick">{{ nickname }}</span>
            <div class="bb" />
          </div>
          <input v-model="yaninfo.by" class="yan_inp yan_to" maxlength="8" placeholder="最多8个字" @blur="inputBlur"/>
          <!-- <input v-model="yaninfo.by" class="yan_inp yan_by" maxlength="8" placeholder="最多8个字" @blur="inputBlur"/> -->
          <textarea v-model="yaninfo.txt" class="yan_text" maxlength="200" placeholder="有什么话想说的？来分享下吧！最少20个字哦" @blur="inputBlur" />
          <div v-if="yaninfo.type===1" class="yan_btn1" @click="yanbtn(yaninfo.type)"/>
          <div v-if="yaninfo.type===3" class="yan_btn3" @click="yanbtn(yaninfo.type)"/>
        </div>
      </div>
    </transition>
    <transition name="falde">
      <div class='nav' v-show="jing_show">
        <div class='navjing'>
          <div class='close' @click="jing_show=false"/>
          <div class="you_info">
            <img :src="jinginfo.headimgurl">
            <div class='by'>{{ jinginfo.by }}</div>
            <div class='bb' />
          </div>
          <div class="jing_main">
            <p class='txt2'>{{ jinginfo.txt }}</p>
          </div>
          <div class="jing_next" @click="jing_next"/>
        </div>
      </div>
    </transition>
    <transition name="falde">
      <div class='nav' v-show="work_show">
        <div class='navwork'>
          <div class='close' @click="work_show_fn"/>
          <div class="you_info">
            <img :src="workinfo.headimgurl">
            <div class='by'>{{ workinfo.by }}</div>
            <div class='bb' />
            <div class="zan" :class="{zan1:!workinfo.zan,zan2:workinfo.zan}" @click="goodBtn(workinfo.id, 1)">
              <span v-show="workinfo.num">{{ workinfo.num }}</span>
            </div>
          </div>
          <div class="jing_main">
            <p class='txt2'>{{ workinfo.txt }}</p>
          </div>
          <div class="work_btn" @click="goodBtn(workinfo.id, 1)"/>
        </div>
      </div>
    </transition>
    <transition name="falde">
      <div class="nav nav1" v-show="mo_show">
        <div class="mo_nav_border">
          <div class="mo_nav1"/>
          <div class="mo_close" @click="mo_showfn" />
          <img :src="mo_img" class="mo_img" @touchstart="gotouchstart" @touchmove="gotouchmove" @touchend="gotouchend">
          <div class="mo_txt2" />
          <div class="mo_nav2">
            <div class="fen_txt">{{ fen_txt[fen_index] }}</div>
            <div class="mo_b1" @click='fenfn'/>
            <div class="mo_b2" v-clipboard:copy="fen_txt[fen_index]" v-clipboard:success="onCopy" v-clipboard:error="onError"/>
          </div>
        </div>
      </div>
    </transition>
    <transition name="falde">
      <div class="nav" v-show="work_show2">
        <div class="work_buy">
          <div class="close" @click="work_show2_fn"/>
          <div class="work_buy_btn" @click="buy"/>
        </div>
      </div>
    </transition>
    <div class="shadow" />
    <div class="bj_mo" id="bj_mo">
      <img src="@/assets/img/mo.jpg" class="mo_jpg">
      <!-- <img :src="my_info.headimgurl" class="headimgurl">
      <span class="nickname">{{ my_info.nickname }}</span> -->
      <span class="mo_txt1">{{ my_info.by }}：</span>
      <span class="mo_txt2">{{ my_info.txt.length >= 74 ? my_info.txt.slice(0, 74) + '...' : my_info.txt }}</span>
      <img class='qrcode' id='qrcode' :src="my_info.qrc"/>
    </div>
  </div>
</template>

<script>
import { teaLongTap, checkLyInfo, lyUpLoad, checkLyYan, lyZan, lyCancelZan } from '@/api/login'
import * as iris from '@cmao/iris'

export default {
  name: 'pg1',
  computed: {
    iscroll1 () {
      return this.$refs.iscroll1
    }
  },
  data () {
    return {
      scrollOptions: {
        mouseWheel: true,
        click: true,
        tap: true
      },
      codemaoCaptcha: null,
      CodemaoAuth: null,
      pid: 'UvOFXx2tfv',
      wall: null,
      user_id: '',
      package_id: '',
      yannav: false,
      textarea: '',
      ulData: [],
      page: 0,
      maxPage: 1,
      c_num: 0,
      allnum: 0,
      headlist: [],
      ruleshow: false,
      jing: [],
      type: 1,
      isTeacher: false,
      yanteachernav: false,
      teachertxt: '',
      teachertxtid: '',
      zid: '',
      telLogin: '',
      hb: null,
      btntype: 0,
      headimgurl: '',
      nickname: '',
      my: [],
      yaninfo: {
        by: '',
        txt: '',
        type: ''
      },
      jinglist: [],
      jinginfo: {
        to: '',
        by: '',
        txt: '',
        txt1: '',
        headimgurl: '',
        index: 0
      },
      workinfo: {
        headimgurl: '',
        by: '',
        txt: '',
        num: 0,
        zan: true
      },
      jing_show: false,
      my_info: {
        headimgurl: '',
        nickname: '',
        by: '',
        txt: '',
        qrc: ''
      },
      mo_img: '',
      mo_show: false,
      timeOutEvent: null,
      top_show: false,
      all_num: 0,
      fen_txt: [
        '在编程猫学编程有一段时间了，本来担心宝贝会觉得枯燥坐不住，结果发现担心有点多余，孩子学编程像搭积木一样有趣，思维活跃了好多！快来扫码为我的祝福助力，送你4节超有料的编程课喔！',
        '孩子最爱的编程猫过6岁生日啦！老师教得好，动画也好看，孩子学编程学得不亦乐乎，假期还挺充实！请扫码为我的祝福点赞，送你4节超有料的编程课喔！',
        '挺感编程猫的老师，负责任也有耐心，我家宝贝也学会独立设计小游戏啦，小小脑袋大大创想，杠杠的！这不编程猫6周年了，希望它发展的越来越好！扫码来看看孩子学习故事，送你4节神奇的编程课！'
      ],
      fen_index: 0,
      work_show: false,
      work_show2: false,
      ytan: true,
      flaginit: true
    }
  },
  mounted () {
    const that = this
    iris.init({
      env: process.env.IRIS,
      domain: ''
    })
    iris.auth.init({
      pid: that.pid,
      product_code: 'kids',
      platform: 'h5'
    })
    that.codemaoCaptcha = new iris.captcha.CodemaoCaptcha({
      pid: that.pid
    })
    that.CodemaoAuth = iris.auth.get_auth_instance()
    that.$loading('Loading...')
    that.ytan = true
    that.ready()
    // that.init()
  },
  methods: {
    yannavbtn (t) {
      if (t === 1) {
        const element = {
          'page_name': '编程猫6周年活动',
          'element': '提交成功弹窗-右上角x',
          'user_id': this.user_id,
          'package_id': this.package_id
        }
        this.$emit('sgbtnfn', element)
      } else if (t === 3) {
        const element = {
          'page_name': '编程猫6周年活动',
          'element': '重新提交弹窗-右上角x',
          'user_id': this.user_id,
          'package_id': this.package_id
        }
        this.$emit('sgbtnfn', element)
      }
      this.yannav = false
    },
    work_show_fn () {
      const element = {
        'page_name': '编程猫6周年活动',
        'element': '客态点赞弹窗-右上角x',
        'user_id': this.user_id,
        'package_id': this.package_id
      }
      this.$emit('sgbtnfn', element)
      this.work_show = false
    },
    work_show2_fn () {
      const element = {
        'page_name': '编程猫6周年活动',
        'element': '客态前往会场弹窗-右上角x',
        'user_id': this.user_id,
        'package_id': this.package_id
      }
      this.$emit('sgbtnfn', element)
      this.work_show2 = false
    },
    mo_showfn () {
      const element = {
        'page_name': '编程猫6周年活动',
        'element': '分享弹窗-右上角x',
        'user_id': this.user_id,
        'package_id': this.package_id
      }
      this.$emit('sgbtnfn', element)
      this.mo_show = false
    },
    async ready () {
      const that = this
      try {
        await that.CodemaoAuth.get_profile().then(res => {
          that.flaginit = false
          that.init(res.data.id, res.data.nickname, res.data.avatar_url)
        }).cache(e => {
          console.log(e)
          that.flaginit = false
          that.init()
        })
      } catch (e) {
        setTimeout(() => {
          if (that.flaginit) {
            that.init()
          }
        }, 1000)
        console.log(e)
      }
    },
    onCopy () {
      const that = this
      const element = {
        'page_name': '编程猫6周年活动',
        'element': '「一键复制」',
        'user_id': that.user_id,
        'package_id': that.package_id
      }
      that.$emit('sgbtnfn', element)
      that.$toast('复制成功')
    },
    onError () {
      this.$toast('您的浏览器不支持该复制操作')
    },
    fenfn () {
      const that = this
      that.fen_index++
      if (that.fen_index === 3) {
        that.fen_index = 0
      }
      const element = {
        'page_name': '编程猫6周年活动',
        'element': '「换一条」',
        'user_id': that.user_id,
        'package_id': that.package_id
      }
      that.$emit('sgbtnfn', element)
    },
    topfn () {
      const that = this
      that.iscroll1.scrollTo(0, 0, 100)
    },
    scrollfn (iscroll) {
      // console.log(iscroll.y)
      // if (iscroll.y < -250) {
      //   this.top_show = true
      // } else {
      //   this.top_show = false
      // }
    },
    gotouchstart (item) {
      const that = this
      if (that.timeOutEvent) {
        clearTimeout(that.timeOutEvent)
      }
      that.timeOutEvent = null
      that.timeOutEvent = setTimeout(function () {
        const data = {
          id: that.my[0].id
        }
        teaLongTap(data)
      }, 1200)
    },
    gotouchend () {
      const that = this
      clearTimeout(that.timeOutEvent)
      if (!that.timeOutEvent) {
        that.timeOutEvent = null
      }
    },
    gotouchmove () {
      const that = this
      if (that.timeOutEvent) {
        clearTimeout(that.timeOutEvent)
        that.timeOutEvent = null
      }
    },
    buy () {
      const that = this
      const element = {
        'page_name': '编程猫6周年活动',
        'element': '火速前往',
        'user_id': that.user_id,
        'package_id': that.package_id
      }
      that.$emit('sgbtnfn', element)
      setTimeout(() => {
        window.location.href = 'https://activity.codemao.cn/6year'
      }, 200)
    },
    jing_next () {
      const that = this
      let index = that.jinginfo.index
      index++
      if (index === 3) {
        index = 0
      }
      that.jinginfo = that.jinglist[index]
      that.jinginfo.index = index
    },
    tojingfn (index) {
      const that = this
      that.jinginfo = that.jinglist[index]
      that.jinginfo.index = index
      that.jing_show = true
    },
    typereturnfn (id) {
      this.teachertxtid = id
      this.yanteachernav = true
    },
    edit (item) {
      const that = this
      that.yaninfo = {
        by: item.by,
        txt: item.txt,
        type: 3
      }
      const page = {
        'page_name': '6周年留言页-重新提交弹窗',
        'user_id': that.user_id
      }
      that.$emit('sgpgfn', page)
      that.yannav = true
    },
    yannavfn (t) {
      const that = this
      that.yaninfo = {
        to: '',
        by: '',
        txt: '',
        type: 1
      }
      const page = {
        'page_name': '6周年留言页-留言弹窗',
        'user_id': that.user_id
      }
      that.$emit('sgpgfn', page)
      const element = {
        'page_name': '编程猫6周年活动',
        'element': '底部中间按钮-「在时光机留言」',
        'user_id': that.user_id,
        'package_id': that.package_id
      }
      that.$emit('sgbtnfn', element)
      that.yannav = true
    },
    init (userId, nick, avatar) {
      const that = this
      if (nick) {
        window.Global.nickname = nick
      }
      if (avatar) {
        window.Global.headimgurl = avatar
      }
      const utmsource = that.getQueryString('utm_source')
      const utmcontent = that.getQueryString('utm_content')
      const utmterm = that.getQueryString('utm_term')
      const id = that.getQueryString('id')
      that.nickname = window.Global.nickname
      that.headimgurl = window.Global.headimgurl
      const data = {
        openid: window.Global.openid,
        unionid: window.Global.unionid,
        headimgurl: window.Global.headimgurl,
        nickname: window.Global.nickname,
        utm_source: utmsource,
        utm_term: utmcontent,
        utm_content: utmterm,
        id,
        userId
      }
      checkLyInfo(data).then(res => {
        // res.isTeacher = 1
        that.$loading.close()
        if (res.res === 'error') {
          that.$loading('异常，请刷新重试。')
        } else if (res.res === 'success') {
          that.user_id = res.user_id
          that.package_id = res.package_id
          that.jinglist = res.jing
          const page = {
            'page_name': '6周年留言页-在时光机留言',
            'user_id': that.user_id
          }
          that.$emit('sgpgfn', page)
          if (that.package_id) {
            that.btntype = 1
          } else {
            that.btntype = 2
          }
          that.ul_info('f')
          that.toShare('', utmsource, utmcontent, utmterm)
          if (res.keinfo) {
            that.workinfo = res.keinfo
            if (!res.keinfo.iszan) {
              const thiscookie = 'ly_iszan_' + that.workinfo.sid
              that.setCookie(thiscookie)
            }
            that.workinfo.zan = that.checkzan(that.workinfo.id)
            const page = {
              'page_name': '6周年留言页-客态点赞弹窗',
              'user_id': that.user_id
            }
            that.$emit('sgpgfn', page)
            that.work_show = true
          }
          setTimeout(function () {
            that.iscroll1.refresh()
          }, 400)
          setTimeout(function () {
            that.iscroll1.refresh()
          }, 1000)
        } else {
          that.$loading('异常，请刷新重试。')
        }
      })
    },
    slideto (res) {
      const that = this
      that.$emit('slideto', res)
    },
    format (shijianchuo) {
      if (!shijianchuo) {
        return ''
      }
      const time = new Date(shijianchuo * 1000)
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      const h = time.getHours()
      const mm = time.getMinutes()
      const s = time.getSeconds()
      function shi (s) {
        s = '' + s
        if (s.length < 2) {
          s = '0' + s
        }
        return s
      }
      return y + '-' + shi(m) + '-' + shi(d) + ' ' + shi(h) + ':' + shi(mm) + ':' + shi(s)
    },
    yanbtn (t) {
      const that = this
      if (t === 1) {
        const element = {
          'page_name': '编程猫6周年活动',
          'element': '「确认提交」',
          'user_id': this.user_id,
          'package_id': that.package_id
        }
        this.$emit('sgbtnfn', element)
      } else if (t === 3) {
        const element = {
          'page_name': '编程猫6周年活动',
          'element': '「重新提交」',
          'user_id': this.user_id,
          'package_id': that.package_id
        }
        this.$emit('sgbtnfn', element)
      }
      if (that.yaninfo.by === '') {
        that.$toast('请填写留言人')
        return
      }
      if (that.yaninfo.txt === '') {
        that.$toast('请填写您的留言')
        return
      }
      if (that.yaninfo.txt.length < 20) {
        that.$toast('请至少填写20字符')
        return
      }
      const utmsource = that.getQueryString('utm_source')
      const utmcontent = that.getQueryString('utm_content')
      const utmterm = that.getQueryString('utm_term')
      const data = {
        ...that.yaninfo,
        openid: window.Global.openid,
        unionid: window.Global.unionid,
        nickname: window.Global.nickname,
        headimgurl: window.Global.headimgurl,
        user_id: that.user_id,
        package_id: that.package_id,
        utm_source: utmsource,
        utm_term: utmcontent,
        utm_content: utmterm,
        txt: that.yaninfo.txt.replace(/\n/g, ' ')
      }
      // console.log(data)
      that.$loading('提交中...')
      lyUpLoad(data).then(res => {
        that.$loading.close()
        const page = {
          'page_name': '6周年留言页-提交成功弹窗',
          'user_id': that.user_id
        }
        that.$emit('sgpgfn', page)
        that.$toast('提交成功，耐心等待审核~')
        that.clearCookie('ly_bo_' + that.user_id)
        that.yannav = false
        that.textarea = ''
        that.ul_info('f')
      })
    },
    load () {
      let that = this
      that.ul_info()
    },
    goodBtn (id, flag) {
      const that = this
      const thiscookie = 'ly_iszan_' + id
      if (!that.getCookie(thiscookie)) {
        lyZan({
          id,
          user_id: that.user_id,
          unionid: window.Global.unionid
        }).then(function (res) {
          if (res.res === 'success') {
            that.setCookie(thiscookie, thiscookie, 99)
            const element = {
              'page_name': '编程猫6周年活动',
              'element': '点赞',
              'user_id': that.user_id,
              'package_id': that.package_id
            }
            that.$emit('sgbtnfn', element)
            for (var i = 0; i < that.ulData.length; i++) {
              if (that.ulData[i].id === id) {
                that.ulData[i].num = res.info.num
                that.ulData[i].zan = false
                break
              }
            }
            if (that.workinfo && that.workinfo.id === id) {
              that.workinfo.num = res.info.num
              that.workinfo.zan = false
              that.work_show = false
              const element = {
                'page_name': '编程猫6周年活动',
                'element': '「请为我的留言的点赞」',
                'user_id': that.user_id,
                'package_id': that.package_id
              }
              that.$emit('sgbtnfn', element)
              that.work_show2 = true
            }
          } else if (res.res === 'pow') {
            that.$toast('请让好友来为你点赞吧！')
          }
        })
      } else if (!flag) {
        lyCancelZan({
          id,
          user_id: that.user_id,
          unionid: window.Global.unionid
        }).then(function (res) {
          if (res.res === 'success') {
            that.clearCookie(thiscookie)
            for (var i = 0; i < that.ulData.length; i++) {
              if (that.ulData[i].id === id) {
                that.ulData[i].num = res.info.num
                that.ulData[i].zan = true
                break
              }
            }
            if (that.workinfo && that.workinfo.id === id) {
              that.workinfo.num = res.info.num
              that.workinfo.zan = true
            }
          }
        })
      } else if (flag) {
        that.work_show = false
        const page = {
          'page_name': '6周年留言页-客态前往弹窗',
          'user_id': that.user_id
        }
        that.$emit('sgpgfn', page)
        const element = {
          'page_name': '编程猫6周年活动',
          'element': '「请为我的留言的点赞」',
          'user_id': that.user_id,
          'package_id': that.package_id
        }
        that.$emit('sgbtnfn', element)
        this.$toast('您已经为该条留言点赞啦，快去看看别的吧')
        // that.work_show2 = true
      }
    },
    showbtn (id) {
      const that = this
      for (var i = 0; i < that.ulData.length; i++) {
        if (that.ulData[i].id === id) {
          that.ulData[i].show = true
          that.$nextTick(() => {
            that.iscroll1.refresh()
          })
          break
        }
      }
    },
    ul_info (f) {
      const that = this
      if (f) {
        that.page = 1
        that.maxPage = 2
        that.ulData = []
      }
      if (that.maxPage - that.page < 0) {
        return
      }
      if (that.maxPage - that.page >= 0) {
        const data = {
          page: that.page,
          type: that.type,
          user_id: that.user_id,
          unionid: window.Global.unionid
        }
        checkLyYan(data).then(res => {
          if (res.res === 'success') {
            that.c_num = res.count
            // res.my = 1
            that.all_num = res.num
            that.my = res.my
            if (that.my && that.my.length > 0 && that.my[0]['user_id'] && that.my[0]['flag'] === 2) {
              if (!that.getCookie('ly_' + that.my[0].user_id)) {
                that.htmlfn()
                that.setCookie('ly_' + that.my[0].user_id, that.my[0].user_id, 99)
              }
            } else if (that.ytan && that.btntype === 1 && that.package_id && that.my.length === 0 && !that.workinfo.id) {
              that.ytan = false
              that.yannavfn()
            } else if (that.my && that.my.length > 0 && that.my[0]['user_id'] && that.my[0]['flag'] === 3) {
              if (!that.getCookie('ly_bo_' + that.my[0].user_id)) {
                that.setCookie('ly_bo_' + that.my[0].user_id, that.my[0].user_id, 99)
                that.edit(that.my[0])
              }
            }
            that.maxPage = Math.ceil(that.c_num / 20)
            that.page++
            for (let i = 0; i < res.zan.length; i++) {
              const thiscookie = 'ly_iszan_' + res.zan[i].sid
              that.setCookie(thiscookie)
            }
            for (let i = 0; i < res.info.length; i++) {
              const a = res.info[i]
              a.zan = that.checkzan(a.id)
              if (a.txt.length > 70) {
                a.show = false
              } else {
                a.show = true
              }
              that.ulData.push(a)
            }
          } else {
            that.$toast('服务器繁忙<br>请稍后重试')
            that.$emit('slideto', 1)
          }
          that.$nextTick(() => {
            that.iscroll1.refresh()
          })
        })
      }
    },
    typefn (type) {
      const that = this
      if (type !== that.type) {
        that.type = type
        if (type === 1) {
          const element = {
            'page_name': '编程猫6周年活动',
            'element': '切换tab-「热门HOT」',
            'user_id': that.user_id,
            'package_id': that.package_id
          }
          that.$emit('sgbtnfn', element)
        } else if (type === 2) {
          const element = {
            'page_name': '编程猫6周年活动',
            'element': '切换tab-「最新NEW」',
            'user_id': that.user_id,
            'package_id': that.package_id
          }
          that.$emit('sgbtnfn', element)
        } else if (type === 3) {
          const element = {
            'page_name': '编程猫6周年活动',
            'element': '切换tab-「我的留言」',
            'user_id': that.user_id,
            'package_id': that.package_id
          }
          that.$emit('sgbtnfn', element)
        }
        that.ul_info('f')
      }
    },
    html2Canvas () {
      const that = this
      var shareContent = document.querySelector('#bj_mo')
      var width = shareContent.clientWidth
      var height = shareContent.clientHeight
      var canvas = document.createElement('canvas')
      var context = canvas.getContext('2d')
      var scaleBy = 3
      canvas.width = width * scaleBy
      canvas.height = height * scaleBy
      context.scale(scaleBy, scaleBy)
      var opts = {
        allowTaint: true,
        tainttest: false,
        canvas: canvas,
        width: width * scaleBy,
        height: height * scaleBy,
        onrendered: function (canvas) {
          canvas.id = 'mycanvas'
          var dataUrl = canvas.toDataURL()
          document.execCommand('dataUrl')
          var newImg = document.createElement('img')
          newImg.crossOrigin = 'anonymous'
          newImg.src = dataUrl
          that.mo_img = dataUrl
          that.$loading.close()
          that.mo_show = true
        }
      }
      window.html2canvas(shareContent, opts)
    },
    htmlfn () {
      const that = this
      that.my_info = {
        headimgurl: process.env.QRC_URL + 'head_' + that.user_id + '.jpg',
        nickname: window.Global.nickname,
        by: that.my[0].by,
        txt: that.my[0].txt,
        qrc: process.env.QRC_URL + 'er1_' + that.user_id + '.png'
      }
      const page = {
        'page_name': '6周年留言页-分享留言集6个赞',
        'user_id': that.user_id
      }
      that.$emit('sgpgfn', page)
      const element = {
        'page_name': '编程猫6周年活动',
        'element': '底部中间按钮-「分享留言集6个赞」',
        'user_id': that.user_id,
        'package_id': that.package_id
      }
      that.$emit('sgbtnfn', element)
      that.$loading('祝福卡生成中...')
      setTimeout(() => {
        that.html2Canvas()
      }, 500)
    }
  }
}
</script>

<style>
</style>
