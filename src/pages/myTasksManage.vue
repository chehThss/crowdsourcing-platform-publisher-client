<template>
  <div v-if="user" class="user-home">
    <div style="width: 100%;">
      <div class="nav-home">
        <Button type="text">我的任务</Button>
      </div>
      <div class="task-filter">
        <Select v-model="taskType" class="task-type-select">
          <Option v-for="item in taskTypeList"
                  :value="item.value"
                  :key="item.value">
            {{item.label}}
          </Option>
        </Select>
        <div>
          <Button type="primary" icon="plus-round" @click="$router.push({ name: 'submit' })">新建任务</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import User from '../components/User.vue'

  export default {
    mixins: [User],
    data() {
      return {
        taskType: 'all',
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
  .user-home {
    display: flex;
  }

  .profile {
    padding-right: 20px;
  }
  .nav-home .ivu-btn {
    font-size: 16px;
  }
  .task-filter {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 5px;
    border-top: solid 1px #b4b4b4;
    border-bottom: solid 1px #b4b4b4;
  }
  .task-filter > div {
    margin: 5px;
  }
  .task-type-select {
    width: 25%;
  }
</style>
