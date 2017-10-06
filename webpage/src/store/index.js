import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activePage: '',
    host: 'http://10.76.144.103:3000',
    querying_labStatus: true,
    labData: {
      mustang: { all: [], automated: [], broken: [], manual: [], removed: []},
      merlin: { all: [], automated: [], broken: [], manual: [], removed: []},
      osprey: { all: [], automated: [], broken: [], manual: [], removed: []},
      distros: []
    }
  },
  mutations: {
    setActivePage (state, payload) {
      state.activePage = payload.name
    },
    setQuerying (state, value) {
      state.querying_labStatus = value
    },
    updateLabData (state, payload) {
      state.labData = payload
    }
  }
})

export default store
console.log('VueX created')
