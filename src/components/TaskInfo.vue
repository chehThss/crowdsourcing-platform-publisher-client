<template>
  <div v-if="!loading && task" class="task-info-body">
    <h1>{{task.name}}</h1>
    <p class="publisher-name">{{publisher? publisher.username: ''}}</p>
    <div v-if="task.picture" class="task-picture"
         :style="{backgroundImage: imageURL}"></div>
    <div v-if="task.tags.length > 0" class="task-tags">
      <Tag v-for="(tag, index) in task.tags" :key="index">{{tag}}</Tag>
    </div>
    <p class="task-excerption">{{task.excerption}}</p>
    <div class="task-description github-markdown markdown-body"
         v-html="compiledDescription"></div>
  </div>
</template>

<script>
  import marked from 'marked'

  export default {
    props: {
      id: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        loading: false,
      }
    },
    computed: {
      task() {
        return this.$store.state.task.tasks[this.id];
      },
      publisher() {
        if(this.task)
          return this.$store.state.user.users[this.task.publisher];
        else
          return null;
      },
      imageURL() {
        return 'url("' + this.task.picture + '")';
      },
      compiledDescription() {
        return marked(this.task.description);
      }
    },
    mounted() {
      if(!this.task) {
        this.loading = true;
        this.$store.dispatch('task/get', this.id).then(response => {
          this.loading = false;
          if(!this.$store.state.user.users[response.publisher])
            this.$nextTick(() => {
              this.$store.dispatch('user/get', response.publisher).catch(
                err => this.$Message.error(err.message)
              )
            })
        }).catch(err => this.$Message.error(err.message));
      }
      else if(!this.publisher) {
        this.$store.dispatch('user/get', this.task.publisher).catch(
          err => this.$Message.error(err.message)
        )
      }
    }
  }
</script>

<style lang="less">
  @import '../assets/markdown/github-markdown';
  @import '../assets/markdown/markdown-normal-style';
</style>

<style lang="less" scoped>
  @picture-width: 600px;
  @picture-height: 300px;

  .task-info-body {
    padding: 20px;
  }

  .publisher-name {
    color: grey;
    margin-bottom: 10px;
  }

  .task-picture {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    position: relative;
    height: @picture-height;
    width: @picture-width;
  }

  .task-excerption, .task-tags {
    margin: 10px 0;
    font-size: 16px;
  }
</style>
