import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import LabStatus from '../components/LabStatus'

import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/lab_status',
      name: 'Lab Status',
      component: LabStatus
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.commit('setActivePage', to)
  next()
})

export default router
