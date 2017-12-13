<template>
  <div v-if="user" class="profile-content">
    <div class="profile-form">
      <h1 style="margin-bottom: 10px">个人信息</h1>
      <div>
        <div class="profile-info-label">用户名：</div>
        <div class="profile-info-content">{{user.username}}</div>
      </div>
      <div>
        <div class="profile-info-label">邮箱：</div>
        <div class="profile-info-content">{{user.email ? user.email: '未绑定'}}</div>
      </div>
    </div>
    <div class="avatar-bar" style="text-align: center">
      <Avatar :src="avatar" class="user-avatar" shape="square"></Avatar>
      <Upload action="" :before-upload="uploadAvatar">
        <Button type="ghost">上传头像</Button>
      </Upload>
    </div>
  </div>
</template>

<script>
  import User from '../components/User.vue'

  export default {
    mixins: [User],
    methods: {
      uploadAvatar(file) {
        if (!file)
          return false;
        if (['image/gif', 'image/jpeg', 'image/png'].indexOf(file.type) === -1) {
          this.$Message.error('未知的图片格式!');
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.$Message.error('图片大小必须小于5M!');
          return false;
        }
        const uploadMsg = this.$Message.loading({
          content: '上传中',
          duration: 0
        });
        this.$store.dispatch('user/patch', {
          id: this.user._id,
          avatar: file
        }).then(() => {
          uploadMsg();
          this.$Message.success('上传成功');
        }).catch(err => {
          uploadMsg();
          console.error(err);
          this.$Message.error(err.message);
        });
        return false;
      }
    }

  }
</script>

<style lang="less">
  .profile-content {
    display: flex;
  }

  .profile-form {
    width: 100%;
  }

  @avatar-width: 200px;
  .avatar-bar {
    width: @avatar-width;
  }

  .user-avatar {
    width: @avatar-width;
    height: @avatar-width;
    margin-bottom: 20px;
  }

  @profile-info-font-size: 16px;

  .profile-info-label {
    width: 80px;
    /*text-align: right;*/
    font-size: @profile-info-font-size;
    display: inline-block;
  }

  .profile-info-content {
    display: inline-block;
    font-size: @profile-info-font-size;
  }

</style>
