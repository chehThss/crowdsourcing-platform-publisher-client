<template>
  <div>
    <div class="search-filter-box">
      <div class="tasks-manage-search">
        <div class="search-box">
          <Input v-model="textSearch"
                 placeholder="搜索我的任务"
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
                  @click="$router.push({name: 'taskCreate'})">新建任务</Button>
        </div>
      </div>
      <Card :style="{display: filterBoxDisplay}">
        <Row class="search-filter-row">
          <Col span="3" class="search-filter-label">任务状态：</Col>
          <Col span="20" class="search-filter-content">
            <RadioGroup v-model="status">
              <Radio label="">全部</Radio>
              <Radio v-for="item in statusMap"
                      :label="item.key"
                      :key="item.key">{{item.name}}</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="search-filter-row">
          <Col span="3" class="search-filter-label">任务类型：</Col>
          <Col span="20" class="search-filter-content">
            <Select v-model="taskType"
                    class="type-select"
                    clearable>
              <Option v-for="item in taskTypes"
                      :value="item._id"
                      :key="item._id">{{item.name}}</Option>
            </Select>
          </Col>
        </Row>
        <Row class="search-filter-row">
          <Col span="3" class="search-filter-label">截止日期：</Col>
          <Col span="20" class="search-filter-content">
          <DatePicker class="date-picker"
                      type="date"
                      placeholder="开始"
                      v-model="deadlineFrom"
                      :options="fromOptions"></DatePicker>到
          <DatePicker class="date-picker"
                      type="date"
                      placeholder="结束"
                      v-model="deadlineTo"
                      :options="toOptions"></DatePicker>
          </Col>
        </Row>
        <Row class="search-filter-row">
          <Col span="3" class="search-filter-label">编辑：</Col>
          <Col span="20" class="search-filter-content">
            <RadioGroup v-model="valid">
              <Radio label="">全部</Radio>
              <Radio label="true">已完成</Radio>
              <Radio label="false">未完成</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="search-filter-row">
          <Col span="3" class="search-filter-label">完成：</Col>
          <Col span="20" class="search-filter-content">
            <RadioGroup v-model="completed">
              <Radio label="">全部</Radio>
              <Radio label="true">已完成</Radio>
              <Radio label="false">未完成</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="search-filter-row">
          <Col span="3" class="search-filter-label">标签：</Col>
          <Col span="20" class="search-filter-content">
            <Input v-model="tag"
                   @on-enter="handleSearch"
                   placeholder="输入回车发起搜索"
                   class="tag-input"></Input>
          </Col>
        </Row>
      </Card>
    </div>
    <p v-if="searchTotal !== null" class="count">共{{searchTotal}}条记录</p>
    <div>
      <Card v-for="(item, index) in populatedTaskList" v-if="item" :key="item._id">
        <Row type="flex">
          <Col span="20">
            <h2><router-link
              :to="{name: 'myTaskInfo', params: {id: item._id}}"
              class="task-title-link">
              {{item.name}}
            </router-link></h2>
            <p>{{item.excerption}}</p>
            <div class="info-last-line">
              <div class="tags">
                <i>标签：</i>
                <Tag v-if="item.tags.length > 0" v-for="(tag, index) in item.tags"
                     :key="index" @click.native="handleTagClick(tag)">{{tag}}</Tag>
                <i v-if="item.tags.length === 0">无</i>
              </div>
              <div class="task-info-date">
                上次更新{{formatDate(item.updatedAt)}}
              </div>
              <div>{{getStatus(item.status)}}</div>
            </div>
          </Col>
          <Col span="4" class="buttons">
            <div>
              <Button v-if="item.status === 0" type="primary"
                      @click="$router.push({name: 'taskEdit', params: {id: item._id}})">
                <i class="fa fa-pencil button-icon" aria-hidden="true"></i>编辑
              </Button>
              <Button v-if="item.status === 2" type="primary" @click="handlePublish(item)">
                发布
              </Button>
              <Button type="error" @click="confirmDelete(item)">
                <i class="fa fa-trash button-icon" aria-hidden="true"></i>删除
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
      <div @scroll="handleScroll" class="scroll">
        <div v-if="!finished" ref="loader">
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
  import User from '../../components/User.vue'
  import TaskTypes from '../../components/TaskTypes.vue'
  import dateFormat from 'dateformat'
  const FetchLimit = 8;

  export default {
    mixins: [User, TaskTypes],
    data() {
      return {
        statusMap: [{key:'0', name:'编辑中', value: 'EDITING'},
          {key: '1', name: '审核中', value: 'SUBMITTED'},
          {key: '2', name: '待发布', value: 'ADMITTED'},
          {key: '3', name: '已发布', value: 'PUBLISHED'}],
        textSearch: '',
        isFilterCollapse: false,
        status: '',
        taskType: '',
        deadlineFrom: null,
        deadlineTo: null,
        valid: '',
        completed: '',
        tag: '',
        tasks: [],
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
      populatedTaskList() {
        return this.tasks.map(id => this.$store.state.task.tasks[id]);
      },
    },
    watch: {
      '$route': 'fetchData',
      status(){
        this.handleSearch();
      },
      taskType() {
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
          this.fetchTasks();
      },
      fetchTasks(isFirstQuery) {
        if(isFirstQuery){
          this.finished = false;
          this.tasks = [];
          this.lastId = '';
          this.searchTotal = null;
        }
        this.loading = true;
        const query = this.queryData(isFirstQuery);
        this.$store.dispatch('task/find', query).then((response) => {
          if(isFirstQuery)
            this.searchTotal = response.total;
          this.tasks = this.tasks.concat(response.data.map(item => item._id));
          if (response.data.length < FetchLimit) {
            this.finished = true;
          } else {
            this.lastId = response.lastId;
            this.$nextTick(() => {
              if (this.isEndOfPage())
                this.fetchTasks();
            });
          }
        }).catch((err) => {
          this.$Message.error(err.message);
          console.error(err);
        }).then(() => {
          this.loading = false;
        });
      },
      queryData(isFirstQuery) {
        let data = {populate: true, limit: FetchLimit, filter: { publisher: this.user._id }};
        // Set filter
        if (this.textSearch)
          data.filter.search = this.textSearch;
        if (this.status)
          data.filter.status = this.statusMap.find(item => item.key === this.status).value;
        if(this.taskType)
          data.filter.type = this.taskType;
        if(this.deadlineFrom)
          data.filter.deadline = { from: this.deadlineFrom };
        if(this.deadlineTo) {
          if (data.filter.deadline)
            data.filter.deadline.to = this.deadlineTo;
          else
            data.filter.deadline = {to: this.deadlineTo};
        }
        if(this.valid)
          data.filter.valid = this.valid === 'true';
        if(this.completed)
          data.filter.completed = this.completed === 'true';
        if(this.tag)
          data.filter.tag = this.tag;
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
          if (this.taskType)
            query.type = this.taskType;
          if (this.deadlineFrom)
            query.from = this.deadlineFrom.getTime();
          if (this.deadlineTo)
            query.to = this.deadlineTo.getTime();
          if (this.valid)
            query.valid = this.valid;
          if (this.completed)
            query.completed = this.completed;
          if (this.tag)
            query.tag = this.tag;
          if (query.search !== this.$route.query.search ||
            query.status !== this.$route.query.status ||
            query.type !== this.$route.query.type ||
            query.from !== this.$route.query.from ||
            query.to !== this.$route.query.to ||
            query.valid !== this.$route.query.valid ||
            query.completed !== this.$route.query.completed ||
            query.tag !== this.$route.query.tag) {
            this.$router.push({
              name: 'myTasksManage', query
            });
          }
        }
      },
      fetchData() {
        this.textSearch = this.$route.query.search || '';
        this.status = this.$route.query.status || '';
        this.taskType = this.$route.query.type || '';
        this.deadlineFrom = this.$route.query.from ? new Date(Number(this.$route.query.from)) : null;
        this.deadlineTo = this.$route.query.to ? new Date(Number(this.$route.query.to)) : null;
        this.valid = this.$route.query.valid || '';
        this.completed = this.$route.query.completed || '';
        this.tag = this.$route.query.tag || '';
        this.fetchTasks(true);
      },
      formatDate(date) {
        return dateFormat(date, 'yyyy年mm月dd日, hh时MM分');
      },
      refresh() {
        if(!this.loading) {
          this.fetchTasks(true);
        }
      },
      confirmDelete(item) {
        this.$Modal.confirm({
          title: '确认删除任务',
          content: '<p>任务一旦删除将无法找回，确认删除任务？</p>',
          onOk: () => {
            this.handleDelete(item);
          }
        })
      },
      handleDelete(task) {
        const id = task._id;
        this.$store.dispatch('task/delete', id).catch((err) => {
          this.$Message.error(err.message);
          console.error(err);
        });
      },
      handlePublish(task) {
        this.$store.dispatch('task/patch', {id: task._id, status: 'PUBLISHED'}).then(() => {
          this.$Message.success('操作成功');
        }).catch((err) => {
          this.$Message.error(err.message);
          console.error(err);
        })
      },
      getStatus(status) {
        return this.statusMap.find(item => Number(item.key) === status).name;
      },
      handleTagClick(tag) {
        this.tag = tag;
        this.handleSearch();
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

  .tasks-manage-search {
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

  .date-picker {
    width: 200px;
    display: inline-block;
    margin-right: 5px;
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

  .type-select {
    width: 40%;
  }

  .tag-input {
    width: 200px;
    top: 0;
  }

  .count {
    margin: 8px;
    color: grey;
  }

  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }

  .task-info-label, .task-info-text {
    display: inline-block;
  }

  .task-info-label {
    width: 100px;
    text-align: right;
    padding-right: 5px;
  }

  .info-last-line {
    display: flex;
  }

  .tags {
    height: 26px;
    width: 40%;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .task-info-date {
    width: 40%;
    font-size: 0.9em;
    color: #6d7380ba;
  }

  .task-title-link {
    color: #202e40;
    border-bottom: solid 1px #000000a8;
  }

  .task-title-link:hover {
    color: #435569;
  }

  .buttons {
    align-self: flex-end;
    > div {
      text-align: right;
    }
  }

  .button-icon {
    margin-right: 4px
  }

  .scroll {
    display: flex;
    justify-content: center;
    padding-top: 20px;
  }
</style>
