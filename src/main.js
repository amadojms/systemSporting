// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import firebase from 'firebase'
import VueSweetalert2 from 'vue-sweetalert2';
import axios from 'axios';
import VueAxios from 'vue-axios'
// import velocity from 'velocity-animate'
// import Vuex from 'vuex'
import  {store}  from './store'
import Spinner from '@/components/spinner'
import 'vuetify/dist/vuetify.min.css'
// import { VueEditor } from "vue2-editor";
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  // const currentUser = firebase.auth().currentUser;
  var uid = localStorage.getItem("Uid")
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // console.log(currentUser,requiresAuth,to,from);
  // console.log(from);
  // console.log(requiresAuth, uid);
  if (requiresAuth && uid !== null) {
    // console.log("entro aqui 2", uid, requiresAuth);
      next();
  } else if (requiresAuth == true && uid == null && to.path == '/admin') {
      // console.log("1", from)
      next('/login');
  }else{
    // console.log("else vue route", to.path);
    next();
  }
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDGxeLHv3_jcfKxUh5PQPL8ESZm282v8nY",
  authDomain: "descubriendoelcaribe-fb135.firebaseapp.com",
  databaseURL: "https://descubriendoelcaribe-fb135.firebaseio.com",
  projectId: "descubriendoelcaribe-fb135",
  storageBucket: "descubriendoelcaribe-fb135.appspot.com",
  messagingSenderId: "586415413263"
};
firebase.initializeApp(config);
Vue.use(VueAxios, axios);
Vue.use(VueSweetalert2);
// Vue.use(VueEditor);
Vue.use(VueQuillEditor)
// Vue.use(velocity);
// Vue.use(Vuex);
Vue.use(Spinner);
Vue.use(Vuetify, { theme: {
  primary: '#4785f5',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107'
}})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App, Spinner },
  template: '<App/>'
})
