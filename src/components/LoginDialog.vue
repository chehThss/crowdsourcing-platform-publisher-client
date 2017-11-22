<style lang="less">
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
<template>
  <Modal
    title="Title"
    v-model="visiable"
    class-name="vertical-center-modal">
    <p>Content of dialog</p>
    <p>Content of dialog</p>
    <p>Content of dialog</p>
  </Modal>
</template>
<script>
  export default {
    data () {
      return {
        email: undefined,
        password: undefined,
        emailError: null,
        passwordError: null
      }
    },
    computed: {
      visiable: {
        get() {
          console.log('here')
          console.log(this.$store);
          return this.$store.state.appshell.loginDialog;
        },
        set(value) {
          this.$store.commit('loginDialogSet', value);
        }
      }
    }
  }
</script>
