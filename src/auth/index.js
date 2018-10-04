import {router} from '../index'
import api from '../utils/api'

const LOGIN_URL = 'admin/auth/token'

export default {
  user: {
    authenticated: false
  },

  login(context, creds, redirect) {
    console.log('make login')
    api.post(LOGIN_URL, creds).then((response) => {
      var data = response.data;
      console.log('data', data);
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('at_expiration', data.access_token_expiration)
      localStorage.setItem('rt_expiration', data.refresh_token_expiration)

      context.$http.defaults.headers.common['Authorization'] = this.getAuthHeader()
      this.user.authenticated = true

      if(redirect) {
        router.go(redirect)
      }

    }, err => {
      context.error = err
    })
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('at_expiration')
    localStorage.removeItem('rt_expiration')
    this.user.authenticated = false
  },

  checkAuth() {
    var jwt = localStorage.getItem('access_token')
    if(jwt) {
      this.user.authenticated = true
    }
    else {
      this.user.authenticated = false
    }
  },

  getAuthHeader() {
    return 'Splynx-EA (access_token=' + localStorage.getItem('access_token') + ')'
  }
}
