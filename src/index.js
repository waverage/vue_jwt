import Vue from 'vue'
import App from './components/App.vue'
import UserInfo from './components/UserInfo.vue'
import Login from './components/Login.vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import auth from './auth'

Vue.use(VueAxios, axios)
Vue.use(VueRouter)

// Check the user's auth status when the app starts
auth.checkAuth()

export var router = new VueRouter()

router.map({
  'userinfo': {
    component: UserInfo
  },
  '/login': {
    component: Login
  }
})

if (auth.user.authenticated) {
  router.redirect({
    '*': '/userinfo'
  })
} else {
  router.redirect({
    '*': '/login'
  })
}

router.start(App, '#app')

