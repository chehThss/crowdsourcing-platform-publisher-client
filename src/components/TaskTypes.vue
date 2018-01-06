<script>
  export default {
    computed: {
      taskTypes() {
        return this.$store.state.taskType.taskTypes;
      }
    },
    methods: {
      taskTypeById(id) {
        return this.taskTypes.find(item => item._id === id);
      }
    },
  }
</script>
