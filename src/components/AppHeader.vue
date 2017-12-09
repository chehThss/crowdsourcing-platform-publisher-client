<template>
  <Row class="app-header">
    <Row class="header-content">
      <Col span="4" class="logo">
      云众包
      </Col>
      <Col span="8"  class="search-box">
      <Input v-model="searchContent" icon="ios-search-strong" placeholder="搜索任务"></Input>
      </Col>
      <Col span="12">
        <Col span="18" class="nav">
        <Menu mode="horizontal"
              theme="light"
              ref="nav"
              @on-select="navigationSelected"
              active-name="home">
          <MenuItem to="/" name="home">
            <Icon type="home"></Icon>
            首页
          </MenuItem>
          <MenuItem v-if="user" name="manage-task">
            <Icon type="ios-list-outline"></Icon>
            管理任务
          </MenuItem>
        </Menu>
        </Col>
        <Col span="6" class="nav-user">
          <Dropdown v-if="user" class="user-menu">
            <Avatar :src="avatarThumbnail" class="user-avatar"></Avatar>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="">个人中心</DropdownItem>
              <DropdownItem @click.native="onLogout">登出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button size="large" v-else type="text" icon="ios-person" @click="loginButtonClicked">登录</Button>
        </Col>
      </Col>
    </Row>
  </Row>
</template>

<script>
  import User from '../components/User.vue';

  export default {
    mixins: [User],
    data() {
      return {
        searchContent: '',
      }
    },
    methods: {
      loginButtonClicked() {
        this.$store.commit('appshell/loginDialogSet', true);
      },
      navigationSelected(name) {
        switch(name){
          case 'home':
            this.$router.push({name: 'home'});
            break;
          default:
        }
      },
      onLogout() {
        this.$store.commit('auth/updateToken');
        this.$Message.info('退出登录');
        this.$router.push({name: 'home'});
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
    background: #dddee1;
    visibility: visible;
    position: relative;
    top: -1px;
    width: 100%;
  }

  .logo{
    text-align: center;
    vertical-align: middle;
    font-size: 20px;
    height: @header-height;
    line-height: @header-height;
  }
  .header-content{
    max-width: 1024px;
    margin: auto;
  }

  .search-box{
    height: @header-height;
    line-height: @header-height;
    padding-right: 10px;
  }

  .nav-user, .user-menu div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-user {
    height: @header-height;
  }

  @avatar-width: 40px;

  .user-avatar {
    width: @avatar-width;
    height: @avatar-width;
    cursor: pointer;
    border-radius: 50%;
  }

  .user-icon{
  }
</style>
