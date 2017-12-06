<template>
  <div class="home-body">
    <Row style="padding: 20px">
      <Col span="6">
        <profile-card class="profile"></profile-card>
      </Col>
      <Col span="18">
        <Tabs value="my-tasks">
          <TabPane label="我的任务" name="my-tasks">

          </TabPane>
        </Tabs>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: 'Home'
  }
</script>

<style lang="less">
  .home-body{
  }
  .profile {
    padding-right: 20px;
  }
</style>
