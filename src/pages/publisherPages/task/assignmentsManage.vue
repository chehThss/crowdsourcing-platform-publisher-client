<template>
  <div>
    <div style="border-bottom: solid 1px #dddddd">
      <div class="assignments-manage-search">
        <div style="display: flex">
          <Input v-model="textSearch" placeholder="搜索作业" @on-enter="handleSearch"
                 style="width: 400px; top: 0; padding-right: 5px">
          <Button slot="append" icon="ios-search" @click="handleSearch">搜索</Button>
          </Input>
          <Button type="default" :icon="filterIcon" @click="isFilterCollapse = !isFilterCollapse">{{filterButtonText}}</Button>
        </div>
        <Button icon="refresh" @click="refresh">刷新</Button>
      </div>
      <Card :style="{display: filterBoxDisplay}">
        <Row class="search-filter-row">
          <Col span="4" class="search-filter-label">作业状态：</Col>
          <Col span="20" class="search-filter-content">
          <RadioGroup v-model="status">
            <Radio label="">全部</Radio>
            <Radio v-for="item in statusMap"
                   :label="item.key"
                   :key="item.key">{{item.name}}</Radio>
          </RadioGroup>
          </Col>
        </Row>
      </Card>
    </div>
    <p v-if="searchTotal !== null" style="margin: 8px; color: grey">共{{searchTotal}}条记录</p>
    <div>
      <Card v-for="(item, index) in populatedAssignmentList" v-if="item" :key="item._id">
        <Row type="flex" align="bottom">
          <Col span="18">
          <Row>
            <Col span="12">
              <b>作业总结：</b>{{item.summary}}
            </Col>
          </Row>
          <Row>
            <Col span="8">
            <div v-if="$store.state.user.users[item.subscriber]" style="display: flex; height: 30px; align-items: center">
              <img v-if="$store.state.user.users[item.subscriber].avatarThumbnail64"
                   :src="$store.state.user.users[item.subscriber].avatarThumbnail64"
                   style="width: 30px; border-radius: 5px;"/>
              <img v-else :src="defaultAvatar" style="width: 30px; border-radius: 5px;"/>
              <div style="display: inline-block; padding-left: 10px; width: 25%">
                {{$store.state.user.users[item.subscriber].username}}
              </div>
            </div>
            </Col>
            <Col span="12" class="assignment-info-date">
            {{formatDate(item.updatedAt)}}
            </Col>
            <Col span="4" class="assignment-info-status">
            {{getStatusName(item.status)}}
            </Col>
          </Row>
          </Col>
          <Col span="6">
            <div v-if="item.status === 1">
              <Button type="primary" @click="handlePass(item)">通过</Button>
              <Button type="warning" @click="handleReject(item)">拒绝</Button>
            </div>
          </Col>
        </Row>
      </Card>
      <div @scroll="handleScroll" style="display: flex; justify-content: center;">
        <div v-if="!finished" ref="loader" style="padding-top: 20px">
          <Spin>
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载中</div>
          </Spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import User from '../../../components/User.vue'
  import dateFormat from 'dateformat'
  const FetchLimit = 8;

  export default {
    mixins: [User],
    data() {
      return {
        statusMap: [{key:'0', name:'待提交', value: 'EDITING'},
          {key: '1', name: '待审核', value: 'SUBMITTED'},
          {key: '2', name: '已通过', value: 'ADMITTED'},
          {key: '3', name: '已拒绝', value: 'REJECTED'}],
        textSearch: '',
        isFilterCollapse: false,
        status: '',
        assignments: [],
        lastId: '',
        finished: false,
        loading: false,
        scrollListener: null,
        searchTotal: null,
        fromOptions: {
          disabledDate:(date) => {
            if(this.deadlineTo)
              return date && date.getTime() > this.deadlineTo.getTime();
          }
        },
        toOptions: {
          disabledDate:(date) => {
            if(this.deadlineFrom)
              return date && date.getTime() < this.deadlineFrom.getTime();
          }
        }

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
      populatedAssignmentList() {
        return this.assignments.map(id => this.$store.state.assignment.assignments[id]);
      },
    },
    watch: {
      '$route': 'fetchData',
      status(){
        this.handleSearch();
      },
      assignmentType() {
        this.handleSearch();
      },
      deadlineFrom() {
        this.handleSearch();
      },
      deadlineTo() {
        this.handleSearch();
      },
      valid() {
        this.handleSearch();
      },
      completed() {
        this.handleSearch();
      }
    },
    methods: {
      isEndOfPage() {
        return this.$refs.loader.offsetTop < window.scrollY + window.innerHeight
      },
      handleScroll() {
        if (!this.finished && !this.loading && this.isEndOfPage())
          this.fetchAssignments();
      },
      fetchAssignments(isFirstQuery) {
        if(isFirstQuery){
          this.finished = false;
          this.assignments = [];
          this.lastId = '';
          this.searchTotal = null;
        }
        this.loading = true;
        const query = this.queryData(isFirstQuery);
        this.$store.dispatch('assignment/find', query).then((response) => {
          if(isFirstQuery)
            this.searchTotal = response.total;
          this.assignments = this.assignments.concat(response.data.map(item => item._id));
          if (response.data.length < FetchLimit) {
            this.finished = true;
          } else {
            this.lastId = response.lastId;
            this.$nextTick(() => {
              if (this.isEndOfPage())
                this.fetchAssignments();
            });
          }
          for(let assignment of response.data) {
            if(!this.$store.state.user.users[assignment.subscriber])
              this.$store.dispatch('user/get', assignment.subscriber);
          }
        }).catch((err) => {
          this.$Message.error(err.message);
          console.error(err);
        }).then(() => {
          this.loading = false;
        });
      },
      queryData(isFirstQuery) {
        let data = {
          populate: true,
          limit: FetchLimit,
          filter: {
            task: this.$route.params.id,
            publisher: this.user._id,
          }};
        // Set filter
        if (this.textSearch)
          data.filter.search = this.textSearch;
        if (this.status)
          data.filter.status = this.statusMap.find(item => item.key === this.status).value;
        if (isFirstQuery)
          data.count = true;
        else
          data.lastId = this.lastId;
        return data;
      },
      handleSearch() {
        if (!this.loading) {
          const query = {};
          if (this.textSearch.length)
            query.search = this.textSearch;
          if (this.status)
            query.status = this.status;
          if (query.search !== this.$route.query.search ||
            query.status !== this.$route.query.status) {
            this.$router.push({
              name: 'assignmentsManage', query
            });
          }
        }
      },
      fetchData() {
        this.textSearch = this.$route.query.search || '';
        this.status = this.$route.query.status || '';
        this.fetchAssignments(true);
      },
      formatDate(date) {
        return dateFormat(date, 'yyyy年mm月dd日, hh时MM分');
      },
      refresh() {
        if(!this.loading) {
          this.fetchAssignments(true);
        }
      },
      handlePass(item) {
        this.$store.dispatch('assignment/patch', {
          id: item._id,
          status: 'ADMITTED'
        }).then(() => {
          this.$Message.success('操作成功');
        }).catch(err => {
          console.error(err);
          this.$Message.error(err.message);
        })
      },
      handleReject(item) {
        this.$store.dispatch('assignment/patch', {
          id: item._id,
          status: 'REJECTED'
        }).then(() => {
          this.$Message.success('操作成功');
        }).catch(err => {
          console.error(err);
          this.$Message.error(err.message);
        })
      },
      getStatusName(status) {
        return this.statusMap.find(item => Number(item.key) === status).name;
      },
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

<style lang="less">
  .assignments-manage-search {
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
  }

  .search-filter-row {
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .search-filter-label {
    text-align: right;
    padding-right: 5px;
  }

  .search-filter-label, .search-filter-content > .ivu-radio-group {
    line-height: 30px;
  }

  .search-filter-content {
    padding-left: 10px;
  }

  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }

  .assignment-info-label, .assignment-info-text {
    display: inline-block;
  }

  .assignment-info-label {
    width: 100px;
    text-align: right;
    padding-right: 5px;
  }

  .assignment-info-date {
    font-size: 0.9em;
    color: #6d7380ba;
  }

  .assignment-info-status, .assignment-info-date {
    height: 30px;
    line-height: 30px;
  }

  .assignment-title-link {
    color: #202e40;
  }

  .assignment-title-link:hover {
    color: #435569;
  }
</style>
