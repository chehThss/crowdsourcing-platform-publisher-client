<template>
  <div>
    <h1 style="padding-bottom: 20px">修改密码</h1>
    <Form :label-width="80" style="width: 400px">
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
      <p>确认更改？</p>
    </Modal>
  </div>
</template>

<script>
  import User from '../components/User.vue'

  class FormItem {
    constructor(validator){
      this.content='';
      this.error='';
      this.validate = validator;
    }
  }

  export default {
    mixins: [User],
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
        const username = this.user.username;
        this.$store.dispatch('user/patch', {
          id: this.user._id,
          password: this.passwordForm.newPassword.content,
        }).then(() => {
          this.$Message.success('更改密码成功');
          const data = {
            strategy: 'username',
            payload: {
              password: this.passwordForm.newPassword.content,
              username: username,
          }};
          this.$store.dispatch('auth/authAndGetUser', data).catch(error => {
            console.error(error);
            this.$Message.error(
              {
                content: error,
                duration: 2
              },
            );
          });
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
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
