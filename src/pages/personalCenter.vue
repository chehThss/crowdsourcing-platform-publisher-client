<template>
  <Row>
    <Col span="4">
      <personal-center-menu :current-setting="profileSettingsName"></personal-center-menu>
    </Col>
    <Col span="20" style="padding-left: 20px">
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
