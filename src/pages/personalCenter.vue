<template>
  <Row style="margin-top: 20px">
    <Col span="4">
      <personal-center-menu current-setting="profileSettings"></personal-center-menu>
    </Col>
    <Col span="20" style="padding-left: 20px">
      <router-view></router-view>
    </Col>
  </Row>
</template>

<script>
  export default {
  }
</script>
