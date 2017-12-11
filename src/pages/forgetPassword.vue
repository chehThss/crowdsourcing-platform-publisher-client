<template>
  <div>
    <p>请输入您的邮箱，我们将向您发送验证邮件。</p>
    <Form :label-width="60" class="forget-password-form">
      <FormItem :error="emailError" label="邮箱：">
        <Input type="text" v-model="email" @on-enter="handleSubmit" autofocus></Input>
      </FormItem>
      <FormItem style="display: none">
        <Input type="text" @on-enter="handleSubmit"></Input>
      </FormItem>
    </Form>
    <div>
      <Button type="primary" @click="handleSubmit">提交</Button>
    </div>
  </div>
</template>

<script>
  const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  export default {
    data() {
      return {
        email: '',
        emailError: ''
      }
    },
    watch: {
      email() {
        this.validateEmail();
      },
    },
    computed: {
      valid() {
        return !this.emailError;
      }
    },
    methods: {
      validateEmail() {
        if (this.email.length === 0)
          this.emailError = '邮箱不能为空';
        else if (!emailRegex.test(this.email))
          this.emailError = '非法的邮箱';
        else
          this.emailError = '';
      },
      handleSubmit() {
        this.validateEmail();
        if(!this.valid)
          return;
        const loadingMsg = this.$Message.loading({
          content: '正在发送',
          duration: 0
        });
        this.$store.dispatch('user/sendMail', {
          action: 'reset-password',
          email: this.email,
          to: '/admin/reset-password',
        }).then(() => {
          loadingMsg();
          this.$Message.info('验证邮件已发送！');
          this.$router.push({name: 'home'});
        }).catch(err => {
          loadingMsg();
          switch (err.message) {
            case 'User does not exist':
              this.emailError = '用户不存在';
              break;
            default:
              console.error(err);
              this.$Message.error(err.message);
          }
        });
      }
    }
  }
</script>

<style lang="less">
  .forget-password-form {
    width: 400px;
    margin-top: 20px;
  }
</style>
