<template>
  <div class="col-sm-6 col-sm-offset-3">
    <h1>Get Norris info!</h1>
    <button class="btn btn-warning" v-on:click="getInfo()">Get info</button>
    <br>
    <div class="quote-area" v-if="login">
      <p>Login: <b>{{ login }}</b></p>
      <p>Name: <b>{{ name }}</b></p>
      <p>Password: <b>{{ password }}</b></p>
      <p>Phone: <b>{{ phone }}</b></p>
      <p>Last online: <b>{{ last_online }}</b></p>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
import api from '../utils/api';

export default {

  data() {
    return {
      name: '',
      login: '',
      password: '',
      phone: '',
      last_online: '',
    }
  },

  methods: {
    getInfo() {
      api.get('admin/customers/customer/1').then(response => {
          var data = response.data;
          console.log('data', data);
          this.name = data.name;
          this.login = data.login;
          this.password = data.password;
          this.phone = data.phone;
          this.last_online = data.last_online;
        }, err => {
          console.log(err)
        })
    }
  },

  route: {
    canActivate() {
      return auth.user.authenticated
    }
  }

}
</script>