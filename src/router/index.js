import Vue from 'vue'
import Router from 'vue-router'
import tours from '@/components/tours'
import hotels from '@/components/hotels'
import detail_hotel from '@/components/detail/index'
import login from '@/components/login'
import contacto from '@/components/contact'
import admin_index from '@/components/admin/index'
// import admin_hotel from '@/components/admin/hotel'
// import admin_tour from '@/components/admin/tour'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    
    // {
    //   path: '/',
    //   // name: 'tours',
    //   component: tours
    // },
    {
      path: '/',
      // name: 'tours',
      component: login
    },
    {
      path: '/hotels',
      // name: 'hotels',
      component: hotels
    },
    {
      path: '/contacto',
      // name: 'hotels',
      component: contacto
    },
    {
      path: '/admin',
      // name: 'hotels',
      component: admin_index,
      meta: {
        requiresAuth: true
      }
    },
    // {
    //   path: '/admin/tours',
    //   // name: 'hotels',
    //   component: admin_tour
    // },
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
