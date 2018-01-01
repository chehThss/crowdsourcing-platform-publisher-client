<template>
  <components :is="editContentComponent"></components>
</template>

<script>
  export default {
    data() {
      return {
        editContentComponent: '',
      }
    },
    computed: {
      task() {
        return this.$store.state.task.tasks[this.$route.params.id];
      },
    },
    mounted() {
      if(this.task) {
        this.editContentComponent = this.task.type + '-edit';
      }
    }
  }
</script>
