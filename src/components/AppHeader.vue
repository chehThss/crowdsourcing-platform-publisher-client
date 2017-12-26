<template>
  <Row class="app-header">
    <Row class="header-content">
      <Col span="4" class="logo">
      云众包
      </Col>
      <Col span="20" v-if="user">
        <Col span="18" class="nav">
        <Menu mode="horizontal"
              theme="light"
              ref="nav"
              @on-select="navigationSelected"
              :active-name="menuName">
          <MenuItem v-if="isPublisher" name="myTasksManage">
            <Icon type="ios-list-outline"></Icon>
            我的任务
          </MenuItem>
          <MenuItem v-if="isTaskAdmin" name="tasksManage">
            <Icon type="ios-paper-outline"></Icon>
            管理任务
          </MenuItem>
          <MenuItem v-if="isUserAdmin" name="usersManage">
            <Icon type="ios-people-outline"></Icon>
            管理用户
          </MenuItem>
        </Menu>
        </Col>
        <Col span="6" class="nav-user">
          <Dropdown class="user-menu">
            <Avatar :src="avatarThumbnail" class="user-avatar-thumbnail"></Avatar>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="$router.push({name: 'profileSettings'})">个人中心</DropdownItem>
              <DropdownItem @click.native="onLogout">登出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Col>
      <Col v-else span="20">
        <Menu mode="horizontal"
            theme="light"
            ref="nav"
            @on-select="navigationSelected"
            :active-name="menuName">
          <MenuItem to="/" name="home">
            <Icon type="home"></Icon>
            首页
          </MenuItem>
        </Menu>
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
    computed: {
      menuName: {
        get() {
          return this.$store.state.appshell.menuName;
        },
      },
      isPublisher() {
        return this.user.roles.indexOf('PUBLISHER') !== -1;
      },
      isTaskAdmin() {
        return this.user.roles.indexOf('TASK_ADMIN') !== -1;
      },
      isUserAdmin() {
        return this.user.roles.indexOf('USER_ADMIN') !== -1;
      }
    },
    methods: {
      navigationSelected(value) {
        this.$router.push({name: value});
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
    min-width: 750px;
    margin: auto;
  }

  .search-box{
    height: @header-height;
    line-height: @header-height;
    padding-right: 10px;
  }

  .nav-user, .user-menu > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-user {
    height: @header-height;
    position: relative;
  }

  .nav-user > div {
    position: absolute;
    right: 10px;
  }

  @avatar-width: 40px;

  .user-avatar-thumbnail {
    width: @avatar-width;
    height: @avatar-width;
    cursor: pointer;
    border-radius: 50%;
  }

  .user-icon{
  }
</style>
