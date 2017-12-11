<script>
  const usernameRegex = /^((([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})|[a-z_0-9]+)$/i;
  export default {
    data() {
      return {
        username: '',
        password: '',
        usernameError: '',
        passwordError: ''
      }
    },
    watch: {
      username: function () {
        this.checkUsername();
      },
      password: function () {
        this.checkPassword();
      },
    },
    computed: {
      formValid() {
        return !this.usernameError && !this.passwordError;
      }
    },
    methods: {
      checkUsername() {
        if (this.username.length === 0)
          this.usernameError = '用户名不能为空';
        else if (!usernameRegex.test(this.username))
          this.usernameError = '非法的用户名或邮箱';
        else
          this.usernameError = '';
      },
      checkPassword() {
        if (this.password.length === 0)
          this.passwordError = '密码不能为空';
        else if (this.password.length < 8)
          this.passwordError = '密码长度至少8位';
        else
          this.passwordError = '';
      },
      resetError() {
        this.usernameError = '';
        this.passwordError = '';
      },
      checkForm() {
        this.checkUsername();
        this.checkPassword();
        return this.formValid;
      },
      login() {
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
        return this.$store.dispatch('auth/authAndGetUser', data).catch(error => {
          switch (error.message) {
            case 'User does not exist':
              this.usernameError = '用户不存在';
              break;
            case 'Wrong password':
              this.passwordError = '密码错误';
              break;
            case 'Permission denied':
              this.usernameError = '用户无权限访问该页面';
              break;
          }
          throw error;
        });
      }
    }
  }
</script>
