<template>
  <Row>
    <Col span="4">
      <personal-center-menu :current-setting="profileSettingsName"></personal-center-menu>
    </Col>
    <Col span="20" class="router-view">
      <router-view></router-view>
    </Col>
  </Row>
</template>

<script>
  export default {
    computed: {
      profileSettingsName() {
        return this.$router.history.current.name;
      }
    }
  }
</script>

<style lang="less" scoped>
  .router-view{
    padding-left: 20px;
  }
</style>
