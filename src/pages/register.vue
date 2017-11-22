<template>
  <div class="register-page">
    <h2 class="register-title">发布者注册</h2>
    <Form class="register-form" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem prop="user" label="用户名: ">
        <Input type="text" v-model="formValidate.user" placeholder=""></Input>
      </FormItem>
      <FormItem prop="email" label="邮箱: ">
        <Input type="text" v-model="formValidate.email" placeholder=""></Input>
      </FormItem>
      <FormItem prop="password" label="密码: ">
        <Input type="password" v-model="formValidate.password" placeholder=""></Input>
      </FormItem>
      <FormItem prop="passwordCheck" label="确认密码: ">
        <Input type="password" v-model="formValidate.passwordCheck"></Input>
      </FormItem>
      <FormItem class="register-form-button">
        <Button type="primary" @click="handleSubmit">确认</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback (new Error('请输入密码'));
        } else if(value.length < 8) {
          callback (new Error('密码长度在8位以上'));
        }
        else {
          if (this.formValidate.passwordCheck !== '') {
            this.$refs.formValidate.validateField('passwordCheck');
          }
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != this.formValidate.password) {
          callback(new Error('输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        formValidate: {
          user: '',
          email: '',
          password: '',
          passwordCheck: ''
        },
        ruleValidate: {
          user: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请提供邮箱', trigger: 'blur'},
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur'},
            { validator: validatePass, trigger: 'blur'}
          ],
          passwordCheck: [
            { required: true, message: '请再次输入密码', trigger: 'blur'},
            { validator: validatePassCheck, trigger: 'blur'}
          ]
        }
      }
    },
    methods : {
      handleSubmit() {
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            this.$refs.formValidate.resetFields();
            this.$router.push('/');
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .register-page {
    width: 1000px;
    margin: auto;
    padding: 40px 30px;
    background-color: #fafafa;
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
