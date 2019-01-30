// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    tel: '',
    token: '',
    videoinfo: [
      {
        name: '沉浮子',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a4a6e2725285890784256283308/MV1by6rsL6wA.mp4',
        poster: '/static/img/wl_c1.jpg',
        active: false,
        txt: '<p>1.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '蜡烛螺旋',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a6eb193f5285890784256375697/n8ErljBrhRIA.mp4',
        poster: '/static/img/wl_c2.jpg',
        active: false,
        txt: '<p>1.将一张纸螺旋剪开；</p><p>2.纸的中心挂在一根长竹签上；</p><p>3.小碗蜡烛点燃，放在竹签正下方，观察现象。</p>'
      },
      {
        name: '伯努利原理',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a4a6d60d5285890784256283033/uJuJVAt1OtUA.mp4',
        poster: '/static/img/wl_c3.jpg',
        active: false,
        txt: '<p>1.将乒乓球放入玻璃杯中，用力向杯口上方吹气；</p><p>2.将两只纸杯叠在一起，向上方杯口吹气。</p>'
      },
      {
        name: '走马灯',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a953f1db5285890784256488328/XQzKEpE8TzQA.mp4',
        poster: '/static/img/wl_c4.jpg',
        active: false,
        txt: '<p>1.将两只纸杯剪成需要的形状；</p><p>2.把铁丝弯成Z字型，粘在开方口的纸杯上；</p><p>3.将另一只杯子反扣在铁丝上，可以自由转动；</p><p>4.拿来小碗蜡烛从方口放入纸杯中，点燃。</p>'
      },
      {
        name: '绽放的纸花',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a6eb8f8e5285890784256376130/38UDOXvDgWUA.mp4',
        poster: '/static/img/wl_c5.jpg',
        active: false,
        txt: '<p>1.将彩纸剪成花的形状，折成没有开的样子；</p><p>2.取一装有水的杯子（或盘子），纸花放在水面上，观察纸花盛开的过程。</p>'
      },
      {
        name: '拔罐实验',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a8e5b5725285890784256425229/gv9QAxaDDtsA.mp4',
        poster: '/static/img/wl_c6.jpg',
        active: false,
        txt: '<p>1.取一个大盘子，放在桌面上；</p><p>2.剪一段卫生纸，折叠成手掌宽的长度，放在盘子中央；</p><p>3.往纸上倒水，浸湿卫生纸；</p><p>4.取一段大蜡烛（或者煤油灯），放在纸上，点燃；</p><p>5.用一只玻璃杯扣住蜡烛。</p>'
      },
      {
        name: '隔空控物',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a6eb03755285890784256375156/Kx7kdTyb29IA.mp4',
        poster: '/static/img/wl_c7.jpg',
        active: false,
        txt: '<p>1.把一个火柴横在一支笔帽上；</p><p>2.用一支薄玻璃杯（或者透明塑料杯）盖住火柴；</p><p>3.取一只气球在头上摩擦后，靠近玻璃杯。</p>'
      },
      {
        name: '绳水实验',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a4a76bb95285890784256284296/IWQq2rMMxdIA.mp4',
        poster: '/static/img/wl_c8.jpg',
        active: false,
        txt: '<p>1.将一根粗绳两端用胶带粘在两只水杯内侧；</p><p>2.往一只水杯中倒入适量的水；</p><p>3.把有水的杯子抬高，将绳子拉直，轻轻沿着绳子倒水。</p>'
      },
      {
        name: '海底火山',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a4a6ebfa5285890784256283586/DqTq4JH5aUsA.mp4',
        poster: '/static/img/wl_c9.jpg',
        active: false,
        txt: '<p>1.取一个玻璃小瓶，滴入几点颜料，倒入热水；</p><p>2.将小瓶放入盛满冷水的大玻璃瓶中。</p>'
      },
      {
        name: '冷热水扩散',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a6eb14975285890784256375563/MRF0PlQW5MsA.mp4',
        poster: '/static/img/wl_c10.jpg',
        active: false,
        txt: '<p>1.取两只杯子，分别注入冷水和热水；</p><p>2.将水溶性颜料（或者墨汁）分别滴入冷热水。</p>'
      },
      {
        name: '乒乓球吹起',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a6eb20db5285890784256375828/dsiej1HSdi0A.mp4',
        poster: '/static/img/wl_c11.jpg',
        active: false,
        txt: '<p>1.取来吹风机（如果风力不够大，就扣一个饮料瓶在上边），打开最大档位；</p><p>2.把一个乒乓球放在出风口，任意晃动吹风机，观察球的动向。</p>'
      },
      {
        name: '彩虹糖的梦',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/a8e5c2125285890784256425517/S1ca48daMcwA.mp4',
        poster: '/static/img/wl_c12.jpg',
        active: false,
        txt: '<p>1.取一个白色碟子（或者泡面底），将彩虹糖摆好；</p><p>2.往碟子中轻轻倒水，让水刚好没过彩虹糖；</p><p>3.观察现象。</p>'
      }
    ],
    vid: '0',
    tru: '1',
    type: 1
  },
  mutations: {
    uVdinfo: (state, data) => {
      const obj = state
      for (let i = 0; i < obj.videoinfo.length; i++) {
        let val = obj.videoinfo[i]
        val.active = false
        Vue.set(obj.videoinfo, i, val)
      }
      let val = obj.videoinfo[data]
      val.active = true
      Vue.set(obj.videoinfo, data, val)
    },
    uvid: (state, data) => {
      const obj = state
      obj.vid = data
    },
    ureturn: (state, data) => {
      const obj = state
      obj.tru = data
    },
    utype: (state, data) => {
      const obj = state
      obj.type = data
    }
  }
})

export default store
