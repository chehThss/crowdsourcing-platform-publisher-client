<style lang="less">
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
<template>
  <Button @click="modal10 = true">Vertical center</Button>
  <Modal
    title="Title"
    v-model="modal10"
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
        modal10: false,
      }
    }
  }
</script>
