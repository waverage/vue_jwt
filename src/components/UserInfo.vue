<template>
  <div class="col-sm-6 col-sm-offset-3">
    <h1>Get Norris info!</h1>
    <button class="btn btn-warning" v-on:click="getInfo()">Get info</button>
    <br>
    <div class="quote-area" v-if="userInfo">
      <pre>
        <code>
        {{ userInfo }}
        </code>
      </pre>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
import api from '../utils/api';

export default {

  data() {
    return {
      userInfo: '{}'
    }
  },

  methods: {
    getInfo() {
      api.get('admin/customers/customer/1').then(response => {
          var data = response.data;
          console.log('data', data);
          this.userInfo = JSON.stringify(data, null, 4);
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