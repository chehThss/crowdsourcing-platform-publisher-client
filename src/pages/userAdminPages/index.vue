<template>
  <div v-if="isUserAdmin">
    <router-view></router-view>
  </div>
</template>

<script>
  import User from '../../components/User.vue'

  export default {
    mixins: [User],
    computed: {
      isUserAdmin() {
        return this.user && this.user.roles.indexOf('USER_ADMIN') !== -1;
      },
    }
  }
</script>
