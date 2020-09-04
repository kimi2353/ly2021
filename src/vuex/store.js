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
    res: null
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
    }
  }
})

export default store
