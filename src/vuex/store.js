// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    sid: null,
    user_id: '',
    package_id: '',
    id: '',
    haiinfo: [],
    res: null,
    free_er: '',
    bendi: [
      {
        'mo': '/static/img/mo1.png',
        'mini': '/static/img/mo1.png'
      },
      {
        'mo': '/static/img/mo2.png',
        'mini': '/static/img/mo2.png'
      },
      {
        'mo': '/static/img/mo3.png',
        'mini': '/static/img/mo3.png'
      }
    ]
  },
  mutations: {
    uRes: (state, data) => {
      const obj = state
      obj.res = data
    },
    uSid: (state, data) => {
      const obj = state
      obj.sid = data
    },
    uUserId: (state, data) => {
      const obj = state
      obj.user_id = data
    },
    uPackageId: (state, data) => {
      const obj = state
      obj.package_id = data
    },
    uId: (state, data) => {
      const obj = state
      obj.id = data
    },
    uHaiinfo: (state, data) => {
      const obj = state
      obj.haiinfo = data
    },
    uFreeEr: (state, data) => {
      const obj = state
      obj.free_er = data
    }
  }
})

export default store
