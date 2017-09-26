import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '../components/Welcome'
//import LabStatus from '@/components/LabStatus'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    // {
    //   path: '/lab_status'
    //   name: 'Lab Status',
    //   component: LabStatus
    // }
  ]
})

export default router
