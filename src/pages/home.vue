<template>
  <div class="home-body">
    <div class="login-card-container" v-if="!user">
      <h2 class="login-title">登录</h2>
      <div class="login-card">
        <Form ref="formValidate">
          <FormItem :error="usernameError">
            <p>用户名或邮箱</p>
            <Input ref="usernameInput"
                   type="text"
                   v-model="username"
                   placeholder=""></Input>
          </FormItem>
          <FormItem :error="passwordError">
            <p>密码</p>
            <Input ref="passwordInput"
                   type="password"
                   v-model="password"
                   placeholder=""
                   @on-enter="handleLogin"></Input>
          </FormItem>
        </Form>
        <div class="register">
          <a @click="handleRegister">注册账号</a>
          <a class="forget-pass"
             @click="handleForgetPassword">忘记密码</a>
        </div>
        <div>
          <Button type="primary"
                  @click="handleLogin"
                  class="login-button">登录</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import User from '../components/User.vue'
  import Login from '../components/Login.vue'

  export default {
    mixins: [User, Login],
    watch: {
      user() {
        if(this.user) {
          this.$router.push({name: this.redirectName});
        }
      }
    },
    computed: {
      redirectName() {
        if(this.user){
          if(this.user.roles.indexOf('PUBLISHER') !== -1)
            return 'myTasksManage';
          else
            return 'home';
        }
        return '';
      }
    },
    methods: {
      handleLogin() {
        if(!this.checkForm())
          return;
        this.login().then(result => {
          this.$router.push({name: this.redirectName});
          this.$Message.success(
            {
              content: '登录成功',
              duration: 1,
            },
          )
        }).catch(error => {
          switch (error.message) {
            case 'User does not exist':
              this.$refs.usernameInput.focus();
              break;
            case 'Wrong password':
              this.$refs.passwordInput.focus();
              break;
            case 'Permission denied':
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
      handleRegister () {
        this.$router.push({name: 'register'});
      },
      handleForgetPassword() {
        this.$router.push({name: 'forgetPassword'});
      }
    }
  }
</script>

<style lang="less" scoped>
  .login-card-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .login-card {
    width: 340px;
    border-radius: 20px;
    border: solid 1px #d3d3d3;
    padding: 20px;
  }

  .login-title {
     text-align: center;
     margin-bottom: 20px;
  }

  .register {
     position: relative;
     top: -5px;
  }

  .forget-pass {
    position: absolute;
    right: 0;
  }

  .login-button {
    width: 100%;
  }
</style>
