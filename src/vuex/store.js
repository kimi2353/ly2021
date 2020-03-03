// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    imginfo: null,
    task: null,
    user_id: 0
  },
  mutations: {
    uTask: (state, data) => {
      const obj = state
      obj.task = data
    },
    uImgInfo: (state, data) => {
      const obj = state
      obj.imginfo = data
    },
    uUserId: (state, data) => {
      const obj = state
      obj.user_id = data
    }
  }
})

export default store
