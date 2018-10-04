import Vue from 'vue'
import auth from '../../auth'
import {router} from '../../index'

const API_URL = 'http://tsumanchuk.dev.spl/api/2.0/'
const RENEW_TOKEN_URL = 'admin/auth/token'

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
    }
}