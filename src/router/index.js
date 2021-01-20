import Vue from 'vue'
import Router from 'vue-router'
import Gmap from '@/components/home/Gmap'

import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import firebase from 'firebase'
import ViewProfile from '@/components/profile/ViewProfile'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Gmap',
      component: Gmap,

      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      //params in url
      path: '/profile/:id',
      name: 'ViewProfile',
      component: ViewProfile,

      meta:{
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  //check if route requires auth
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    //check auth state of user
    let user = firebase.auth().currentUser
    if(user){
      //user signed ind. let them go to desired page
      next()
    } else {
      //redirect to login page
      next({ name: 'Login' })
    }
    //no meta requiresAuth
  } else {
    next()
  }
})

export default router