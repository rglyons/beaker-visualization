import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home'
import LabStatus from '../components/LabStatus'
import TestHistory from '../components/TestHistory'

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
      props: true,
      component: LabStatus
    },
    {
      path: '/test_history',
      name: 'Test History',
      component: TestHistory
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.commit('setActivePage', to)
  next()
})

export default router
