<template>
  <div>
    <img class="avatar" :src="avatar">
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
  .avatar {
    width: 90%;
    border-radius: 16px;
    border-style: none;
    margin-bottom: 20px;
  }

  .username {
    font-size: 20px;
  }
</style>
