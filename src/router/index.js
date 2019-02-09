import Vue from 'vue'
import Router from 'vue-router'
import detail_hotel from '@/components/detail/index'
import login from '@/components/login'
import contacto from '@/components/contact'
import admin_index from '@/components/admin/index'
import admin_members from '@/components/admin/Members'
import admin_users from '@/components/admin/Users'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    
    {
      path: '/members',
      component: admin_members,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      // name: 'tours',
      component: login
    },
    {
      path: '/contacto',
      // name: 'hotels',
      component: contacto
    },
    {
      path: '/admin',
      component: admin_index,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/users',
      component: admin_users,
      meta: {
        requiresAuth: true
      }
    },
    // {
    //   path: '/admin/hotels',
    //   // name: 'hotels',
    //   component: admin_hotel
    // },
    {
      path: '/detail/:id',
      // name: 'hotel_detail',
      component: detail_hotel
    },

  ]
})
