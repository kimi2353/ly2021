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
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>1.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '蜡烛螺旋',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>2.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '伯努利原理',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>3.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '走马灯',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>4.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '绽放的纸花',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>5.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '拔罐实验',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>6.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '隔空控物',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>7.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '绳水实验',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>8.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '海底火山',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>9.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '冷热水扩散',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>10.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '乒乓球吹起',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>1.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      },
      {
        name: '彩虹糖的梦',
        url: 'https://1257805666.vod2.myqcloud.com/d9ef0cb0vodcq1257805666/c50502875285890784100285640/H4YmfkEdSAIA.mp4',
        poster: '/static/img/wl_pg1_bg.jpg',
        active: false,
        txt: '<p>1.取一只玻璃瓶（或者矿泉水瓶），倒水至距瓶口1厘米处；</p><p>2.拿一个口服液小瓶，注一半水，反扣在玻璃瓶中，使其刚好漂浮；</p><p>3.用手掌压在瓶口上，不要漏气，用力压，小瓶会下沉（矿泉水瓶拧上盖子挤压即可）。</p>'
      }
    ]
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
    }
  }
})

export default store
