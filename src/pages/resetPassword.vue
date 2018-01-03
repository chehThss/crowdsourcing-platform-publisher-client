<template>
  <div>
    <h1 class="title">重置密码</h1>
    <Form :label-width="80" class="form">
      <FormItem label="新密码：" :error="passwordForm.newPassword.error">
        <Input type="password" v-model="passwordForm.newPassword.content" autofocus></Input>
      </FormItem>
      <FormItem label="确认密码：" :error="passwordForm.passwordCheck.error">
        <Input type="password" v-model="passwordForm.passwordCheck.content"></Input>
      </FormItem>
    </Form>
    <div>
      <Button type="primary" @click="handleSubmitButtonClicked">提交</Button>
    </div>
    <Modal
      title="提交"
      v-model="showConfirmModal"
      @on-ok="handleSubmit"
      class="vertical-center-modal">
      <p>确认提交？</p>
    </Modal>
  </div>
</template>

<script>
  class FormItem {
    constructor(validator){
      this.content='';
      this.error='';
      this.validate = validator;
    }
  }

  export default {
    data(){
      return {
        passwordForm: {
          newPassword: new FormItem(function () {
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
        showConfirmModal: false,
      }
    },
    watch: {
      'passwordForm.newPassword.content'() {
        this.passwordForm.newPassword.validate();
      },
      'passwordForm.passwordCheck.content'() {
        this.passwordForm.passwordCheck.validate({
          password: this.passwordForm.newPassword.content
        });
      },
    },
    computed: {
      valid() {
        return !this.passwordForm.newPassword.error &&
          !this.passwordForm.passwordCheck.error;
      }
    },
    methods: {
      handleSubmit() {
        this.$store.dispatch('user/confirmMail', {
          id: this.$route.query.token,
          action: 'reset-password',
          password: this.passwordForm.newPassword.content
        }).then(() => {
          this.$Message.success('修改密码成功，请重新登录！');
        }).catch(err => {
          switch (err.message) {
            case 'Invalid token':
              this.$Message.error('修改密码失败，无效的凭证！');
              break;
            default:
              console.error(err);
              this.$Message.error(err.message);
          }
        }).then(() => {
          this.$router.push({name: 'home'});
        });
      },
      handleSubmitButtonClicked() {
        const formValidateArgs = {passwordCheck: {
          password: this.passwordForm.newPassword.content
        }};
        for(let key in this.passwordForm) {
          if(key) {
            this.passwordForm[key].validate(formValidateArgs[key]);
          }
        }
        if(!this.valid)
          return;
        this.showConfirmModal = true;
      }
    }
  }
</script>

<style lang="less" scoped>
  .title {
    margin-bottom: 20px;
  }

  .form {
    width: 400px;
  }
</style>
