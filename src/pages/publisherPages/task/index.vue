<template>
  <Row v-if="!loading">
    <i-col span="4">
      <Menu theme="light" :active-name="menuName" @on-select="$router.push({name: name});"
            style="width: auto">
        <MenuItem name="taskEdit">
          基础信息
        </MenuItem>
        <MenuItem v-if="editContentDisabled" name="contentEdit">
          任务内容
        </MenuItem>
      </Menu>
    </i-col>
    <i-col span="20" style="padding-left: 20px">
      <router-view></router-view>
    </i-col>
  </Row>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        menuName: 'taskEdit'
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
    }
  }
</script>
