<script>
  import default_avatar from '../assets/img/default_avatar.jpeg';

  export default {
    computed: {
      user() {
        return this.$store.getters['auth/user'];
      },
      avatar() {
        const user=this.$store.getters['auth/user'];
        if(!user)
          return null;
        if(user.avatar)
          return user.avatar;
        else
          return default_avatar;
      },
      avatarThumbnail() {
        const user = this.$store.getters['auth/user'];
        if(!user)
          return null;
        if(user.avatarThumbnail64)
          return user.avatarThumbnail64;
        else
          return default_avatar;
      },
      defaultAvatar() {
        return default_avatar;
      }
    }
  }
</script>
