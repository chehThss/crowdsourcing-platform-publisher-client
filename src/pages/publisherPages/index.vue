<template>
  <div v-if="isPublisher">
    <router-view></router-view>
  </div>
</template>

<script>
  import User from '../../components/User.vue'

  export default {
    mixins: [User],
    computed: {
      isPublisher() {
        return this.user && this.user.roles.indexOf('PUBLISHER') !== -1;
      },
    }
  }
</script>
