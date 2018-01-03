<template>
  <div>
    <div class="search-filter-box">
      <div class="users-manage-search">
        <div class="search-box">
          <Input v-model="textSearch"
                 placeholder="请输入要查找的用户名或邮箱"
                 @on-enter="handleSearch"
                 class="search-input">
          <Button slot="append"
                  icon="ios-search"
                  @click="handleSearch">搜索</Button>
          </Input>
          <Button type="default"
                  :icon="filterIcon"
                  @click="isFilterCollapse = !isFilterCollapse">{{filterButtonText}}</Button>
        </div>
        <div>
          <Button icon="refresh" @click="refresh">刷新</Button>
          <Button type="primary"
                  icon="plus"
                  @click="handleAddUser">添加</Button>
        </div>
      </div>
      <Card :style="{display: filterBoxDisplay}">
        <Row class="search-filter-row">
          <Col span="3" class="search-filter-label">用户类型：</Col>
          <Col span="20" class="search-filter-content">
            <RadioGroup v-model="userRoleFilter">
              <Radio label="all">全部</Radio>
              <Radio label="SUBSCRIBER">订阅者</Radio>
              <Radio label="PUBLISHER">发布者</Radio>
              <Radio label="TASK_ADMIN">任务管理员</Radio>
              <Radio label="USER_ADMIN">用户管理员</Radio>
              <Radio label="SITE_ADMIN">网站管理员</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="search-filter-row">
          <Col span="3" class="search-filter-label">封禁状态：</Col>
          <Col span="20" class="search-filter-content">
            <RadioGroup v-model="userBlockFilter">
              <Radio label="all">全部</Radio>
              <Radio label="notBlocked">正常</Radio>
              <Radio label="blocked">封禁</Radio>
            </RadioGroup>
          </Col>
        </Row>
      </Card>
    </div>
    <p v-if="searchTotal !== null" class="count">共{{searchTotal}}条记录</p>
    <div>
      <Card v-for="(item, index) in populatedUserList" :key="item._id">
        <div class="info-box">
          <img class="avatar"
               v-if="item.avatarThumbnail64"
               :src="item.avatarThumbnail64"/>
          <img v-else class="avatar" :src="defaultAvatar"/>
          <div>
            <div>
              <div class="user-info-label">用户名：</div>
              <div class="user-info-text">{{item.username}}</div>
            </div>
            <div>
              <div class="user-info-label">用户邮箱：</div>
              <div class="user-info-text">{{item.email ? item.email : '未绑定'}}</div>
            </div>
            <div>
              <div class="user-info-label">创建时间：</div>
              <div class="user-info-text user-info-date">{{formatDate(item.createdAt)}}</div>
            </div>
            <div>
              <div class="user-info-label">权限：</div>
              <div class="user-info-text">
                <CheckboxGroup :value="item.roles" @on-change="handleRoleChange(item, arguments[0])">
                  <Checkbox label="SUBSCRIBER">
                    <span>订阅</span>
                  </Checkbox>
                  <Checkbox label="PUBLISHER">
                    <span>发布</span>
                  </Checkbox>
                  <Checkbox label="TASK_ADMIN">
                    <span>任务管理</span>
                  </Checkbox>
                  <Checkbox label="USER_ADMIN">
                    <span>用户管理</span>
                  </Checkbox>
                  <Checkbox label="SITE_ADMIN">
                    <span>网站管理</span>
                  </Checkbox>
                </CheckboxGroup>
              </div>
            </div>
          </div>
          <div class="buttons">
            <Button v-if="!item.blocked" @click="handleBlock(item, true)"  type="warning">
              <i class="fa fa-ban button-icon" aria-hidden="true"></i>禁用
            </Button>
            <Button v-else @click="handleBlock(item, false)" type="success">
              <i class="fa fa-circle-o button-icon" aria-hidden="true"></i>解禁
            </Button>
            <Button type="error" @click="confirmDelete(item)">
              <i class="fa fa-trash button-icon" aria-hidden="true"></i>删除
            </Button>
          </div>
        </div>
      </Card>
      <div class="scroll">
        <div v-if="!finished" ref="loader">
          <Spin>
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载中</div>
          </Spin>
        </div>
      </div>
    </div>
    <create-user-dialog v-model="createUserDialogVisible" @create-success="refresh"></create-user-dialog>
  </div>
</template>

<script>
  import User from '../../components/User.vue'
  import dateFormat from 'dateformat'
  const FetchLimit = 8;

  export default {
    mixins: [User],
    data() {
      return {
        textSearch: '',
        isFilterCollapse: false,
        userRoleFilter: 'all',
        userBlockFilter: 'all',
        userList: [],
        lastId: '',
        finished: false,
        loading: false,
        scrollListener: null,
        createUserDialogVisible: false,
        searchTotal: null
      }
    },
    computed: {
      filterIcon() {
        return this.isFilterCollapse ? 'ios-arrow-down' : 'ios-arrow-up';
      },
      filterButtonText() {
        return this.isFilterCollapse ? '高级筛选' : '收起筛选';
      },
      filterBoxDisplay() {
        return this.isFilterCollapse ? 'none' : 'block';
      },
      populatedUserList() {
        return this.userList.map(id => this.$store.state.user.users[id]);
      }
    },
    watch: {
      '$route': 'fetchData',
      userRoleFilter() {
        this.handleSearch();
      },
      userBlockFilter() {
        this.handleSearch();
      }
    },
    methods: {
      isEndOfPage() {
        return this.$refs.loader.offsetTop < window.scrollY + window.innerHeight
      },
      handleScroll() {
        if (!this.finished && !this.loading && this.isEndOfPage())
          this.fetchUsers();
      },
      queryData(isFirstQuery) {
        let data = {populate: true, limit: FetchLimit, filter: {}};
        if (this.textSearch) {
          data.filter.search = this.textSearch;
        }
        if (this.userRoleFilter !== 'all')
          data.filter.role = this.userRoleFilter;
        switch (this.userBlockFilter) {
          case 'notBlocked':
            data.filter.blocked = false;
            break;
          case 'blocked':
            data.filter.blocked = true;
            break;
        }
        if (Object.keys(data.filter).length === 0 && data.filter.constructor === Object)
          delete data.filter;
        if (isFirstQuery)
          data.count = true;
        else
          data.lastId = this.lastId;
        return data;
      },
      fetchUsers(isFirstQuery) {
        this.loading = true;
        this.$store.dispatch('user/find', this.queryData(isFirstQuery)).then((response) => {
          if(isFirstQuery)
            this.searchTotal = response.total;
          this.userList = this.userList.concat(response.data.map(item => item._id));
          if (response.data.length < FetchLimit) {
            this.finished = true;
          } else {
            this.lastId = response.lastId;
            this.$nextTick(() => {
              if (this.isEndOfPage())
                this.fetchUsers();
            });
          }
        }).catch((err) => {
          this.$Message.error(err.message);
          console.error(err);
        }).then(() => {
          this.loading = false;
        });
      },
      handleSearch() {
        if (!this.loading) {
          const query = {};
          if (this.textSearch.length)
            query.search = this.textSearch;
          if (this.userRoleFilter !== 'all')
            query.role = this.userRoleFilter;
          if (this.userBlockFilter !== 'all')
            query.block = this.userBlockFilter;
          if (query.search !== this.$route.query.search ||
            query.role !== this.$route.query.role ||
            query.block !== this.$route.query.block) {
            this.$router.push({
              name: 'usersManage', query
            });
          }
        }
      },
      fetchData() {
        this.finished = false;
        this.userList = [];
        this.lastId = '';
        this.searchTotal = null;
        this.textSearch = this.$route.query.search || '';
        this.userRoleFilter = this.$route.query.role || 'all';
        this.userBlockFilter = this.$route.query.block || 'all';
        this.fetchUsers(true);
      },
      formatDate(date) {
        return dateFormat(date, 'yyyy年mm月dd日, hh时MM分');
      },
      handleRoleChange(item, newRoles) {
        const oldRoles = item.roles;
        item.roles = newRoles;
        this.$nextTick(() => item.roles = oldRoles);
        this.$store.dispatch('user/patch', {
          id: item._id,
          roles: newRoles
        }).catch((err) => {
          this.$Message.error(err.message);
          console.error(err);
        });
      },
      handleBlock(item, block) {
        this.$store.dispatch('user/patch', {
          id: item._id,
          blocked: block
        }).catch((err) => {
          this.$Message.error(err.message);
          console.error(err);
        });
      },
      confirmDelete(item) {
        this.$Modal.confirm({
          title: '确认删除用户',
          content: '<p>删除用户可能会导致部分任务、作业的功能出现异常，且无法撤回，确认删除用户？</p>',
          onOk: () => {
            this.handleDelete(item);
          }
        })
      },
      handleDelete(user) {
        const id = user._id;
        this.$store.dispatch('user/delete', id).catch((err) => {
          this.$Message.error(err.message);
          console.error(err);
        });
      },
      handleAddUser() {
        this.createUserDialogVisible = true;
      },
      refresh() {
        if(!this.loading) {
          this.finished = false;
          this.userList = [];
          this.lastId = '';
          this.searchTotal = null;
          this.fetchUsers(true);
        }
      }
    },
    destroyed() {
      window.removeEventListener('scroll', this.scrollListener);
    },
    mounted() {
      window.addEventListener('scroll', this.scrollListener = this.handleScroll.bind(this));
      this.fetchData();
    },
  }
</script>

<style lang="less" scoped>
  .search-filter-box {
    border-bottom: solid 1px #dddddd;
  }

  .users-manage-search {
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
  }

  .search-box {
    display: flex;
  }

  .search-input {
    width: 400px;
    top: 0;
    padding-right: 5px;
  }

  .search-filter-row {
     margin-bottom: 5px;
     margin-top: 5px;
  }

  .search-filter-label {
    text-align: right;
    padding-right: 5px;
  }

  .search-filter-content {
    padding-left: 10px;
  }

  .count {
    margin: 8px;
    color: grey;
  }

  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }

  .info-box {
    display: flex;
    align-items: center;
  }

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 32px;
  }

  .user-info-label, .user-info-text {
    display: inline-block;
  }

  .user-info-label {
    width: 100px;
    text-align: right;
    padding-right: 5px;
  }

  .user-info-date {
    font-size: 0.9em;
    color: #6d7380ba;
  }

  .buttons {
    align-self: flex-end;
    flex: 1;
    text-align: right;
  }

  .button-icon {
    margin-right: 4px
  }

  .scroll {
    display: flex;
    justify-content: center;
    padding-top: 20px;
  }

  .submitted-buttons {
    margin-bottom: 5px;
  }
</style>
