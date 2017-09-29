// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '../../node_modules/vuetify/dist/vuetify.min.css'
import '../static/css/material_icon.css'
import '../static/js/jquery.min.js'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,  // inject Vuex store into all child components
  template: '<App/>',
  components: { App }
})