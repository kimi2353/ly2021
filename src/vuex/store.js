// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    tel: '',
    token: '',
    vid: '0',
    tru: '1',
    type: 1,
    obj: null,
    cla: true,
    videoIndex: -1,
    videoList: []
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
    uObj: (state, data) => {
      const obj = state
      obj.obj = data
    },
    ureturn: (state, data) => {
      const obj = state
      obj.tru = data
    },
    utype: (state, data) => {
      const obj = state
      obj.type = data
    },
    uCla: (state, data) => {
      const obj = state
      obj.cla = data
    },
    uVideoIndex: (state, data) => {
      const obj = state
      obj.videoIndex = data
    },
    uVideoList: (state, data) => {
      const obj = state
      obj.videoList = data
    }
  }
})

export default store
