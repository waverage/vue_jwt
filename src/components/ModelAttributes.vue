<template>
  <div class="col-sm-6 col-sm-offset-3">
    <h1>Customers attributes</h1>
    <button class="btn btn-warning" v-on:click="getAttributes()">Get attributes</button>
    <br>
    <div class="quote-area" v-if="attributesContent">
      <br>
      <pre>
          {{ attributesContent }}
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
      attributesContent: '',
    }
  },

  methods: {
    getAttributes() {
      api.options('admin/administration/partners').then(response => {
          var data = response.data;
          console.log('data', data);
          this.attributesContent = JSON.stringify(data, null, 4);
        }, err => console.log(err))
    }
  },

  route: {
    canActivate() {
      return auth.user.authenticated
    }
  }

}
</script>