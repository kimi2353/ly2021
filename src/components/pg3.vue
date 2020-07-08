<template>
  <div class='pg3'>
    <div class="p3_btn1" @click="slideto(1)">返回</div>
    <div class='list' v-for="(item, index) in list" :key="index">
      <div class='info'>
        <div class='p3_txt1'>{{ item.remark }}</div>
        <div class='p3_txt2'>{{ format(item.begin) }}-{{ format(item.end) }}</div>
        <div class='p3_txt3'>已完成{{ item.over }}个任务，{{ item.all - item.over }}个任务未完成</div>
        <div>
          <div class='p3_txt3'>任务奖励：{{ item.win }}</div>
          <div v-show="item.tap" class="tap tap1" @click="item.tap=!item.tap">收起</div>
          <div v-show="!item.tap" class="tap tap2" @click="item.tap=!item.tap">展开</div>
        </div>
      </div>
      <ul class="shenhetab" v-show="item.tap">
        <li v-for="(it, idx) in item.shenhetab" :key="idx">
          <div class="flag" :class="{flag1:it.tab==='已通过',flag2:it.tab==='未通过', flag3:it.tab==='审核中'}" />
          <div class="sht">
            <span class='sht_txt1'>{{ it.name }}</span>
            <!-- <van-tag class="sht_txt2" :type="it.tab==='已通过'?'success':(it.tab==='未通过'?'danger':(it.tab==='审核中'?'warning':'primary'))">{{ it.tab }}</van-tag> -->
          </div>
          <div class="sht_info">
            <span class="sht_info_txt1" v-if="it.tab==='已通过'">审核通过时间：{{format(it.zuoye.stimes)}}</span>
            <div v-else-if="it.tab==='未通过'">
              <span class="sht_info_txt2">{{it.zuoye.bo}}</span>
              <span class="sht_info_txt3" @click="totab(item)">重新上传</span>
            </div>
            <span class="sht_info_txt1" v-else-if="it.tab==='审核中'">编程猫老师正在火速审核中, 请耐心等待哦~</span>
            <span class="sht_info_txt4" v-else-if="it.tab==='未开始'">未开始 开始时间：{{ format(it.begin) }}</span>
            <span class="sht_info_txt5" v-else-if="it.tab==='已结束'">已结束</span>
            <div v-else-if="it.tab==='未参加'">
              <span class="sht_info_txt6">未参加</span>
              <span class="sht_info_txt3" @click="totab(item)">重新上传</span>
            </div>
            <!-- <van-button v-if="it.tab==='未参加'||it.tab==='未通过'" class="itbtn" size="small" type="primary" @click="totab(item)">点击上传截图</van-button> -->
            <!-- <van-tag class='sht_info_txt1' v-if="it.tab==='未开始'"></van-tag> -->
            <!-- span  class='sht_info_txt1'></span> -->
          </div>
        </li>
      </ul>
    </div>
    <div style="height: 3rem;"/>
  </div>
</template>

<script>
import { checkShenheMenu, checkShenheMsg } from '@/api/login'
import { Toast } from 'vant'

export default {
  name: 'pg3',
  data () {
    return {
      list: [],
      activeNames: [],
      now: 0
    }
  },
  computed: {
    user_id () {
      return this.$store.state.user_id
    },
    package_id () {
      return this.$store.state.package_id
    }
  },
  mounted () {
    const that = this
    window.document.title = '上传记录'
    const pagename = '上传记录页'
    that.$emit('pageInfo', pagename)
    that.init()
  },
  methods: {
    totab (item) {
      const that = this
      const bp = {
        'element': '点击上传截图',
        'page_name': '上传记录页'
      }
      that.$emit('btnInfo', bp)
      const data = {
        unionid: window.Global.unionid,
        user_id: that.user_id,
        sid: item.id,
        package_id: that.package_id
      }
      that.$loading('加载中...')
      checkShenheMsg(data).then(res => {
        // console.log(res)
        that.$loading.close()
        if (res.res === 'error') {
          Toast('系统错误，请刷新重试')
        } else if (res.res === 'package_id') {
          Toast('对不起，您暂无参与资格')
        } else if (res.res === 'success') {
          if (res.package_id) {
            that.$store.commit('uPackageId', res.package_id)
          }
          that.$store.commit('uSid', item.id)
          that.slideto('2')
        } else if (res.res === 'time') {
          Toast('项目已结束')
        }
      })
    },
    fmt (flag, begin1, end1, begin2, end2) {
      const that = this
      if (!flag) {
        if (that.now < begin1 || that.now < begin2) {
          return '未开始'
        }
        if (that.now > end1 || that.now > end2) {
          return '已结束'
        }
        return '未参加'
      } else if (flag === 1) {
        return '审核中'
      } else if (flag === 2) {
        return '已通过'
      } else if (flag === 3) {
        return '未通过'
      }
      return ''
    },
    slideto (res) {
      const that = this
      that.$emit('slideto', res)
    },
    init () {
      const that = this
      const data = {
        unionid: window.Global.unionid,
        user_id: that.user_id
      }
      checkShenheMenu(data).then(res => {
        // console.log(res)
        if (res.res === 'success') {
          that.now = res.now
          for (let i = 0; i < res.info.length; i++) {
            res.info[i].all = 0
            res.info[i].over = 0
            if (res.info[i].begin <= that.now && res.info[i].end + 1296000 >= that.now) {
              // that.activeNames.push(i)
              res.info[i].tap = true
            } else {
              res.info[i].tap = false
            }
            for (let j = 0; j < res.info[i].shenhetab.length; j++) {
              res.info[i].all++
              if (res.info[i].shenhetab[j].zuoye) {
                if (res.info[i].shenhetab[j].zuoye && res.info[i].shenhetab[j].zuoye.flag === 2) {
                  res.info[i].over++
                }
                res.info[i].shenhetab[j].tab = that.fmt(res.info[i].shenhetab[j].zuoye.flag, res.info[i].shenhetab[j].begin, res.info[i].shenhetab[j].end, res.info[i].begin, res.info[i].end)
              } else {
                res.info[i].shenhetab[j].tab = that.fmt('', res.info[i].shenhetab[j].begin, res.info[i].shenhetab[j].end, res.info[i].begin, res.info[i].end)
              }
            }
          }
          that.list = res.info
        }
      })
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
      return y + '.' + shi(m) + '.' + shi(d) + ' ' + shi(h) + ':' + shi(mm) + ':' + shi(s)
    }
  }
}
</script>

<style>
</style>
