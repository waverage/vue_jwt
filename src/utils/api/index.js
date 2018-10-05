import Vue from 'vue'
import auth from '../../auth'
import {router} from '../../index'

const API_URL = 'http://tsumanchuk.dev.spl/api/2.0/'
const RENEW_TOKEN_URL = 'admin/auth/tokens'

export default {
    beforeRequest() {
        return new Promise((resolve, reject) => {
            if (auth.user.authenticated && this.accessTokenExpired()) {
                console.log('Token expired');
                if (this.refreshTokenExpired()) {
                    // Log off
                    auth.logout();
                    router.go('login')
                    reject();
                } else {
                    this.renewToken().then(() => {
                        resolve();
                    }, () => {
                        reject();
                    })
                }
            } else {
                resolve();
            }
        });
    },
    accessTokenExpired() {
        let currentTime = Math.floor(Date.now() / 1000)
        console.log('Access token time left ', localStorage.getItem('at_expiration') - currentTime)
        return currentTime > localStorage.getItem('at_expiration')
    },
    refreshTokenExpired() {
        let currentTime = Math.floor(Date.now() / 1000)
        console.log('Refresh token time left ', localStorage.getItem('rt_expiration') - currentTime)
        return currentTime > localStorage.getItem('rt_expiration')
    },
    renewToken() {
        let refreshToken = localStorage.getItem('refresh_token');
        let url = API_URL + RENEW_TOKEN_URL + '/' + refreshToken;
        localStorage.removeItem('access_token')

        return new Promise((resolve, reject) => {
            Vue.axios.get(url).then(response => {
                let data = response.data;
                console.log('renew response', data);
                localStorage.setItem('access_token', data.access_token)
                localStorage.setItem('refresh_token', data.refresh_token)
                localStorage.setItem('at_expiration', data.access_token_expiration)
                localStorage.setItem('rt_expiration', data.refresh_token_expiration)
                resolve();
            }, err => {
                reject();
            })
        })
    },
    post(url, data, options) {
        console.log('--------------------------');
        console.log('Make POST', url);
        return new Promise((resolve, reject) => {
            this.beforeRequest().then(ok => {
                if (typeof options == 'undefined') {
                    var options = {
                        headers: {}
                    };
                }
                options.headers['Authorization'] = auth.getAuthHeader()

                Vue.axios.post(API_URL + url, data, options).then(res => {
                    resolve(res);
                }, err => {
                    reject(err);
                })
            }, err => {
                reject(err);
            })
        })
    },
    get(url, options) {
        console.log('--------------------------');
        console.log('Make GET request', url);
        return new Promise((resolve, reject) => {
            this.beforeRequest().then(ok => {
                if (typeof options == 'undefined') {
                    var options = {
                        headers: {}
                    };
                }
                options.headers['Authorization'] = auth.getAuthHeader()
                Vue.axios.get(API_URL + url, options).then(res => {
                    resolve(res);
                }, err => {
                    reject(err);
                })
            }, err => {
                console.log('err', err);
                reject(err);
            })
        })
    },

    options(url, options) {
        console.log('--------------------------');
        console.log('Make OPTIONS request', url);

        return new Promise((resolve, reject) => {
            this.beforeRequest().then(ok => {
                if (typeof options == 'undefined') {
                    var options = {
                        headers: {}
                    };
                }
                options.headers['Authorization'] = auth.getAuthHeader()
                Vue.axios.options(API_URL + url, options).then(res => {
                    resolve(res);
                }, err => {
                    reject(err);
                })
            }, err => {
                console.log('err', err);
                reject(err);
            })
        })
    },

    head(url) {
        console.log('--------------------------');
        console.log('Make HEAD request', url);

        return new Promise((resolve, reject) => {
            this.beforeRequest().then(ok => {
                var options = {
                    headers: {}
                };
                options.headers['Authorization'] = auth.getAuthHeader()
                Vue.axios.head(API_URL + url, options).then(res => {
                    resolve(res);
                }, err => {
                    reject(err);
                })
            }, err => {
                console.log('err', err);
                reject(err);
            })
        })
    },

    urlencode (str) {
        str = (str + '')
        return encodeURIComponent(str)
          .replace(/!/g, '%21')
          .replace(/'/g, '%27')
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
          .replace(/\*/g, '%2A')
          .replace(/%20/g, '+')
      },

    http_build_query (formdata, numericPrefix, argSeparator) {      
        var encodeFunc = this.urlencode
      
        var value
        var key
        var tmp = []
      
        var _httpBuildQueryHelper = function (key, val, argSeparator) {
          var k
          var tmp = []
          if (val === true) {
            val = '1'
          } else if (val === false) {
            val = '0'
          }
          if (val !== null) {
            if (typeof val === 'object') {
              for (k in val) {
                if (val[k] !== null) {
                  tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
                }
              }
              return tmp.join(argSeparator)
            } else if (typeof val !== 'function') {
              return encodeFunc(key) + '=' + encodeFunc(val)
            } else {
              throw new Error('There was an error processing for http_build_query().')
            }
          } else {
            return ''
          }
        }
      
        if (!argSeparator) {
          argSeparator = '&'
        }
        for (key in formdata) {
          value = formdata[key]
          if (numericPrefix && !isNaN(key)) {
            key = String(numericPrefix) + key
          }
          var query = _httpBuildQueryHelper(key, value, argSeparator)
          if (query !== '') {
            tmp.push(query)
          }
        }
      
        return tmp.join(argSeparator)
      }
}