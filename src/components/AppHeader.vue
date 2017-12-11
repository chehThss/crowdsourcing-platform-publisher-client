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
          <MenuItem name="myTasksManage">
            <Icon type="ios-list-outline"></Icon>
            我的任务
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
        set(value) {
          this.$store.commit('appshell/menuNameSet', value);
        }
      }
    },
    watch: {
      '$router.history.current.name'(){
        console.log(this.$router.history.current.name)
      }
    },
    methods: {
      loginButtonClicked() {
        this.$store.commit('appshell/loginDialogSet', true);
      },
      navigationSelected(value) {
        this.menuName = value;
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
