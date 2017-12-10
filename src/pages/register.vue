<template>
  <div class="register-page">
    <h2 class="register-title">发布者注册</h2>
    <Form class="register-form"
          ref="formValidate"
          :label-width="80">
      <FormItem :error="formRegister.email.error" label="邮箱：">
        <Input type="text" v-model="formRegister.email.content" placeholder="" autofocus></Input>
      </FormItem>
      <FormItem :error="formRegister.username.error" label="用户名：">
        <Input type="text" v-model="formRegister.username.content" placeholder=""></Input>
      </FormItem>
      <FormItem :error="formRegister.password.error" label="密码：">
        <Input type="password" v-model="formRegister.password.content"placeholder=""></Input>
      </FormItem>
      <FormItem :error="formRegister.passwordCheck.error" label="确认密码：">
        <Input type="password" v-model="formRegister.passwordCheck.content"></Input>
      </FormItem>
      <FormItem class="register-form-button">
        <Button type="primary" @click="handleSubmit">确认</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const usernameRegex = /^[a-z_0-9]+$/i;

  class FormItem {
    constructor(validator){
      this.content='';
      this.error='';
      this.validate = validator;
    }
  }

  export default {
    data () {
      return {
        formRegister: {
          username: new FormItem(function() {
            if(!this.content)
              this.error = '用户名不能为空';
            else if(!usernameRegex.test(this.content))
              this.error = '用户名只能由英文、数字、下划线组成';
            else
              this.error = '';
          }),
          email: new FormItem(function() {
            if(!this.content)
              this.error = '邮箱不能为空';
            else if (!emailRegex.test(this.content))
              this.error = '非法的邮箱';
            else
              this.error = '';
          }),
          password: new FormItem(function () {
            if(!this.content)
              this.error = '密码不能为空';
            else if(this.content.length < 8)
              this.error = '密码长度至少8位';
            else
              this.error = '';
          }),
          passwordCheck: new FormItem(function (args) {
            if(!this.content)
              this.error = '请再次输入密码';
            else if(this.content !== args.password)
              this.error = '密码不一致';
            else
              this.error = '';
          })
        },
      }
    },
    watch: {
      'formRegister.username.content'() {
        this.formRegister.username.validate();
      },
      'formRegister.email.content'() {
        this.formRegister.email.validate();
      },
      'formRegister.password.content'() {
        this.formRegister.password.validate();
      },
      'formRegister.passwordCheck.content'() {
        this.formRegister.passwordCheck.validate({
          password: this.formRegister.password.content
        });
      },
    },
    computed: {
      valid() {
        return !this.formRegister.username.error &&
          !this.formRegister.email.error &&
          !this.formRegister.password.error &&
          !this.formRegister.passwordCheck.error;
      }
    },
    methods : {
      handleSubmit() {
        const formValidateArgs = {passwordCheck: {
          password: this.formRegister.password.content
        }};
        for(let key in this.formRegister) {
          if(key) {
            this.formRegister[key].validate(formValidateArgs[key]);
          }
        }
        if(this.valid) {
          const msg = this.$Message.loading({
            content: '正在发送邮件',
            duration:0
          });
          this.$store.dispatch('user/sendMail', {
            action: 'create-user',
            email: this.formRegister.email.content,
            to: '/admin',
            username: this.formRegister.username.content,
            password: this.formRegister.password.content,
            roles: ['PUBLISHER']
          }).then(() => {
            msg();
            this.$router.push({name:'home'});
            this.$Message.info({
              content: '验证邮件已发送，请前往邮箱完成验证',
              duration: 10,
            });
          }).catch(err => {
            msg();
            switch (err.message) {
              case 'Username has been taken':
                this.formRegister.username.error = '用户名已被注册';
                break;
              case 'Email has been taken':
                this.formRegister.email.error = '邮箱已被注册';
                break;
              default:
                console.error(err);
                this.$Message.err(err.message);
            }
          })
        }
      }
    }
  }
</script>

<style lang="less">
  .register-page {
    margin: auto;
    padding: 20px 30px;
  }
  .register-title {
    text-align: left;
    margin-bottom: 20px;
  }
  .register-form {
    width: 400px;
  }
  .register-form-button {
    text-align: right;
  }
</style>
