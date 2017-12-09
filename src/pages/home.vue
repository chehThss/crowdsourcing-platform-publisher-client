<template>
  <div class="home-body">
    <Row v-if="user" style="padding: 20px">
      <Col span="6">
        <profile-card class="profile"></profile-card>
      </Col>
      <Col span="18">
      <div class="nav-home">
        <Button type="text">我的任务</Button>
      </div>
      <div class="task-filter">
        <Select v-model="taskType">
          <Option v-for="item in taskTypeList"
                  :value="item.value"
                  :key="item.value">
            {{item.label}}
          </Option>
        </Select>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import User from '../components/User.vue'

  export default {
    mixins: [User],
    data() {
      return {
        taskType: '',
        taskTypeList: [
          { value: 'all', label: '全部' },
          { value: 'saved', label: '暂存' },
          { value: 'checking', label: '待审查' },
          { value: 'toBePublished', label: '待发布' },
          { value: 'doing', label: '正在进行' },
          { value: 'done', label: '已完成' }
        ],
      }
    }
  }
</script>

<style lang="less">
  .home-body{
  }
  .profile {
    padding-right: 20px;
  }
  .nav-home {
    border-bottom: solid 1px #b4b4b4;
    margin-bottom: 5px;
  }
  .nav-home .ivu-btn {
    font-size: 16px;
  }
</style>
