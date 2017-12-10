<template>
  <div v-if="user" class="profile-card">
    <Avatar class="avatar" :src="avatar" shape="square"></Avatar>
    <div class="username">{{user.username}}</div>
  </div>
</template>

<script>
  import User from '../components/User.vue';

  export default {
    mixins: [User],
    data () {
      return {
      }
    },
    computed: {
    }
  }
</script>

<style lang="less">
  .profile-card {
    width: 240px;
  }
  .avatar {
    width: 220px;
    height: 220px;
    margin-bottom: 20px;
  }

  .username {
    font-size: 20px;
  }
</style>
