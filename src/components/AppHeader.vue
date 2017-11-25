<template>
  <Row class="app-header">
    <Row class="header-content">
      <Col span="4" class="logo">
      云众包
      </Col>
      <Col span="8"  class="search-box">
      <Input v-model="serachContent" icon="ios-search-strong" placeholder="搜索任务"></Input>
      </Col>
      <Col span="12">
        <Menu mode="horizontal" theme="light">
          <MenuItem to="/" name="3">
            <Icon type="home"></Icon>
            首页
          </MenuItem>
          <MenuItem v-if="user" name="4">
            <Icon type="ios-list-outline"></Icon>
            管理任务
          </MenuItem>
          <MenuItem v-if="user" name="5.1" class="user-center">
            <Icon type="person" class="user-icon"></Icon>
          </MenuItem>
          <MenuItem v-else name="5.2" class="login-button" @click.native="loginButtonClicked">
            <Icon type="person" class="user-icon"></Icon>
            登录
          </MenuItem>
        </Menu>
      </Col>
    </Row>
  </Row>
</template>

<script>
  export default {
    data() {
      return {
        searchContent: '',
        user: 'dfsljal',
      }
    },
    methods: {
      loginButtonClicked() {
        this.$store.commit('loginDialogSet', true);
      }
    }
  }
</script>

<style lang="less">
  @header-height: 60px;

  .app-header {
    background-color: #ffffff;
  }

  .app-header::after {
    display: block;
    height: 1px;
    width:100%;
    background: #dddee1;
    visibility: visible;
    position: relative;
    top: -1px;
  }

  .logo{
    text-align: center;
    vertical-align: middle;
    font-size: 20px;
    height: @header-height;
    line-height: @header-height;
  }
  .header-content{
    width: 800px;
    margin: auto;
  }

  .search-box{
    height: @header-height;
    line-height: @header-height;
    padding-right: 10px;
  }

  .user-center, .login-button{
    float: right !important;
  }

  .user-icon{
  }
</style>
