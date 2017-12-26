<template>
  <div v-if="isTaskAdmin">
    <router-view></router-view>
  </div>
</template>

<script>
  import User from '../../components/User.vue'

  export default {
    mixins: [User],
    computed: {
      isTaskAdmin() {
        return this.user && this.user.roles.indexOf('TASK_ADMIN') !== -1;
      },
    }
  }
</script>
