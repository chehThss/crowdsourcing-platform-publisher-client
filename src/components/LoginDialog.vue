<template>
  <Modal
    v-model="visible"
    class-name="vertical-center-modal"
    :closable="false"
    :mask-closable="true"
    @on-cancel="handleCancel"
    :width="400"
  >
    <p slot="header" style="font-size: 18px; text-align: center">
      云众包
    </p>
    <div>
      <Form ref="formValidate">
        <FormItem :error="usernameError">
          <p>用户名或邮箱</p>
          <Input ref="usernameInput" type="text" v-model="username" placeholder=""></Input>
        </FormItem>
        <FormItem :error="passwordError">
          <p>密码</p>
          <Input ref="passwordInput" type="password" v-model="password" placeholder="" @on-enter="handleLogin"></Input>
        </FormItem>
      </Form>
      <div style="position: relative">
        <a @click="handleRegister">注册账号</a>
        <a style="position: absolute; right: 0;"
           @click="$router.push({name: 'forgetPassword'});">忘记密码</a>
      </div>
    </div>
    <div slot="footer">
      <Button type="primary" @click="handleLogin">登录</Button>
      <Button type="ghost" @click="handleCancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
  const usernameRegex = /^((([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})|[a-z_0-9]+)$/i;
  export default {
    data () {
      return {
        username: '',
        password: '',
        usernameError: '',
        passwordError: ''
      }
    },
    watch: {
      username: function () {
        if(this.visible)
          this.checkUsername();
      },
      password: function () {
        if(this.visible)
          this.checkPassword();
      },
      visible: function () {
        this.username = '';
        this.password = '';
        this.resetError();
      }
    },
    computed: {
      visible: {
        get() {
          return this.$store.state.appshell.loginDialog;
        },
        set(value) {
          this.$store.commit('appshell/loginDialogSet', value);
        }
      },
      formValid: () => { return !this.usernameError && !this.passwordError }
    },
    methods: {
      checkUsername() {
        if(this.username.length === 0)
          this.usernameError = '用户名不能为空';
        else if(!usernameRegex.test(this.username))
          this.usernameError = '非法的用户名或邮箱';
        else
          this.usernameError = '';
      },
      checkPassword(){
        if (this.password.length === 0)
          this.passwordError = '密码不能为空';
        else if (this.password.length < 8)
          this.passwordError = '密码长度至少8位';
        else
          this.passwordError = '';
      },
      resetError(){
        this.usernameError = '';
        this.passwordError = '';
      },
      handleLogin() {
        this.checkUsername();
        this.checkPassword();
        if(this.formValid === false)
          return;
        const data = {payload: {password: this.password}};
        if (this.username.indexOf('@') === -1) {
          // Username
          data.strategy = 'username';
          data.payload.username = this.username;
        } else {
          // Email
          data.strategy = 'email';
          data.payload.email = this.username;
        }
        this.$store.dispatch('auth/authAndGetUser', data).then(result => {
          this.visible = false;
          this.$router.push({name: 'home'});
          this.$Message.success(
            {
              content: '登录成功',
              duration: 1,
            },
          )
        }).catch(error => {
          switch (error.message) {
            case 'User does not exist':
              this.usernameError = '用户不存在';
              this.$refs.usernameInput.focus();
              break;
            case 'Wrong password':
              this.passwordError = '密码错误';
              this.$refs.passwordInput.focus();
              break;
            case 'Permission denied':
              this.usernameError = '用户无权限访问该页面';
              this.$refs.usernameInput.focus();
              break;
            default:
              console.error(error);
              this.$Message.error(
                {
                  content: error,
                  duration: 2
                },
              );
          }
        });
      },
      handleCancel () {
        this.visible = false;
      },
      handleRegister () {
        this.visible = false;
        this.$router.push({name: 'register'});
      }
    }
  }
</script>

<style lang="less">
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
