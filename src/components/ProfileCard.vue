<template>
  <div>
    <img class="avatar" :src="avatarUrl">
    <div class="username">{{user.username}}</div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        user: ''
      }
    },
    computed: {
      avatarUrl() {
        if(this.user.avatar) {
          return this.user.avatar;
        } else {
          return '/static/img/default_avatar.jpeg';
        }
      },
    }
  }
</script>

<style lang="less">
  .avatar {
    width: 100%;
    border-radius: 16px;
    border-style: none;
    margin-bottom: 20px;
  }

  .username {
    font-size: 20px;
  }
</style>
