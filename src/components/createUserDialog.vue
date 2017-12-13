<template>
  <Modal v-model="visible">
    <p slot="header">添加用户</p>
    <div>
      <Form class="register-form"
            ref="formValidate"
            :label-width="80">
        <FormItem :error="formRegister.username.error" label="用户名：">
          <Input type="text" v-model="formRegister.username.content" placeholder=""></Input>
        </FormItem>
        <FormItem :error="formRegister.password.error" label="密码：">
          <Input :type="passwordVisible ? 'text': 'password'"
                 v-model="formRegister.password.content"
                 :icon="passwordVisible ? 'eye': 'eye-disabled'"
                 @on-click="passwordVisible = !passwordVisible"></Input>
        </FormItem>
        <FormItem label="用户类型：">
          <CheckboxGroup v-model="formRegister.roles.content">
            <Checkbox label="SUBSCRIBER">
              <span>订阅</span>
            </Checkbox>
            <Checkbox label="PUBLISHER">
              <span>发布</span>
            </Checkbox>
            <Checkbox label="TASK_ADMIN">
              <span>任务管理</span>
            </Checkbox>
            <Checkbox label="USER_ADMIN">
              <span>用户管理</span>
            </Checkbox>
            <Checkbox label="SITE_ADMIN">
              <span>网站管理</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="visible=false">取消</Button>
      <Button type="primary" @click="handleSubmit">提交</Button>
    </div>
  </Modal>
</template>

<script>
  const usernameRegex = /^[a-z_0-9]+$/i;

  class FormItem {
    constructor(validator){
      this.content='';
      this.error='';
      this.validate = validator;
    }
  }

  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        visible: this.value,
        passwordVisible: false,
        formRegister: {
          username: new FormItem(function () {
            if (!this.content)
              this.error = '用户名不能为空';
            else if (!usernameRegex.test(this.content))
              this.error = '用户名只能由英文、数字、下划线组成';
            else
              this.error = '';
          }),
          password: new FormItem(function () {
            if (!this.content)
              this.error = '密码不能为空';
            else if (this.content.length < 8)
              this.error = '密码长度至少8位';
            else
              this.error = '';
          }),
          roles: {
            content: [],
            validate: function () {}
          }
        }
      }
    },
    computed: {
      valid() {
        return !this.formRegister.username.error &&
          !this.formRegister.password.error;
      }
    },
    watch: {
      visible() {
        this.$emit('input', this.visible);
      },
      value() {
        this.visible = this.value;
      },
      'formRegister.username.content'() {
        this.formRegister.username.validate();
      },
      'formRegister.password.content'() {
        this.formRegister.password.validate();
      },
    },
    methods: {
      handleSubmit() {
        for (let key in this.formRegister) {
          if (key) {
            this.formRegister[key].validate();
          }
        }
        if (this.valid) {
          const msg = this.$Message.loading({
            content: '正在创建用户',
            duration: 0
          });
          this.$store.dispatch('user/create', {
            username: this.formRegister.username.content,
            password: this.formRegister.password.content,
            roles: this.formRegister.roles.content
          }).then(() => {
            msg();
            this.$Message.info({
              content: '创建成功',
              duration: 2,
            });
            this.$emit('create-success');
            this.visible = false;
          }).catch(err => {
            msg();
            switch (err.message) {
              case 'Username has been taken':
                this.formRegister.username.error = '用户名已被注册';
                break;
              default:
                console.error(err);
                this.$Message.error(err.message);
            }
          })
        }
      }
    }
  }
</script>
