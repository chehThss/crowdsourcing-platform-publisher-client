<template>
  <Menu mode="horizontal" theme="light" class="app-header">
    <MenuItem name="1">云菜包</MenuItem>
    <MenuItem name="2" class="search-box">
      <Input v-model="serachContent" icon="ios-search-strong" placeholder="搜索任务"></Input>
    </MenuItem>
    <MenuItem name="3">
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
    <MenuItem v-else name="5.2" class="login-button">
      <Icon type="person" class="user-icon"></Icon>
      登录
    </MenuItem>
  </Menu>
</template>

<script>
  export default {
    data: {
      searchContent: '',
      user: ''
    }
  }
</script>

<style lang="less">
  .app-header{
    min-width: 1000px;
  }

  .search-box{
    width: 30%;
  }

  .user-center, .login-button{
    float: right !important;
  }

  .user-icon{
  }
</style>
