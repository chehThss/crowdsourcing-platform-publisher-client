<template>
  <Row v-if="!loading && task">
    <Col span="4">
      <Menu theme="light" :active-name="menuName" @on-select="handleSelect"
            style="width: auto">
        <MenuItem name="myTaskInfo">
          基础信息
        </MenuItem>
        <MenuItem v-if="task.status === 0" name="taskEdit">
          编辑信息
        </MenuItem>
        <MenuItem v-if="task.status === 0 && editContentDisabled" name="taskContentEdit">
          编辑任务内容
        </MenuItem>
      </Menu>
    </Col>
    <Col span="20" style="padding-left: 20px">
      <router-view></router-view>
    </Col>
  </Row>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        menuName: this.$route.name
      }
    },
    computed: {
      task() {
        return this.$store.state.task.tasks[this.$route.params.id];
      },
      editContentDisabled() {
        return this.task && this.task.type;
      }
    },
    mounted() {
      if(this.task)
        return;
      this.loading = true;
      this.$store.dispatch('task/get', this.$route.params.id).then(response => {
        this.loading = false;
      }).catch(err => this.$Message.error(err.message));
    },
    methods: {
      handleSelect(value) {
        this.$router.push({name: value});
      }
    }
  }
</script>
