// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    tel: '',
    token: ''
  },
  mutations: {
    uTel: (state, data) => {
      const obj = state
      obj.tel = data
    },
    uToken: (state, data) => {
      const obj = state
      obj.token = data
    }
  }
})

export default store
