import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activePage: ''
  },
  mutations: {
    setActivePage (state, payload) {
      state.activePage = payload.name
    }
  }
})

export default store
console.log('VueX created')
