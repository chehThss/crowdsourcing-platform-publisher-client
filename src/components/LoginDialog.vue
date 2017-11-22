<style lang="less">
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
<template>
  <Modal
    v-model="visible"
    class-name="vertical-center-modal"
    :closable="false"
    :mask-closable="true"
    @on-cancel="handleCancel"
  >
    <p slot="header" style="font-size: 18px; text-align: center">
      云众包
    </p>
    <div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
        <FormItem prop="user">
          <p>用户名或邮箱</p>
          <Input type="text" v-model="formValidate.user" placeholder=""></Input>
        </FormItem>
        <FormItem prop="password">
          <p>密码</p>
          <Input type="password" v-model="formValidate.password" placeholder=""></Input>
        </FormItem>
      </Form>
      <a @click="handleRegister">注册账号</a>
    </div>
    <div slot="footer">
      <Button type="primary" @click="handleSubmit">登录</Button>
      <Button type="ghost" @click="handleCancel">取消</Button>
    </div>
  </Modal>
</template>
<script>
  export default {
    data () {
      return {
        formValidate: {
          user: '',
          password: ''
        },
        ruleValidate: {
          user: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      visible: {
        get() {
          return this.$store.state.appshell.loginDialog;
        },
        set(value) {
          this.$store.commit('loginDialogSet', value);
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs.formValidate.validate((valid) => {
          if (valid) {
            this.$refs.formValidate.resetFields();
            this.visible = false;
          }
        })
      },
      handleCancel () {
        this.$refs.formValidate.resetFields();
        this.visible = false;
      },
      handleRegister () {
        this.$refs.formValidate.resetFields();
        this.visible = false;
        this.$router.push('/register');
      }
    }
  }
</script>
