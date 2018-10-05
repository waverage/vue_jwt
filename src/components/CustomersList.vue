<template>
  <div class="col-sm-6 col-sm-offset-3">
    <h1>Customers list</h1>
    <button class="btn btn-warning" v-on:click="refreshList()">Refresh</button>
    <br>
    <div class="quote-area">
        Records count: <b>{{ recordsAmount }}</b>
    </div>
  </div>
</template>

<script>
import auth from '../auth'
import api from '../utils/api';


export default {
  data() {
    return {
      recordsAmount: 0
    }
  },

  methods: {
    refreshList() {
        let search = {
            'main_attributes': {
                status: 'active'
            }
        };
        api.head('admin/customers/customer?' + api.http_build_query(search)).then(response => {
            console.log('HEAD', response);
            this.recordsAmount = response.headers['x-total-count'];
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