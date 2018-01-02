<template>
  <div>
    <h1 style="margin: 20px">任务创建</h1>
    <Form ref="form"
          :model="task"
          :rules="ruleSubmit"
          :label-width="100">
      <FormItem prop="title" label="任务标题：">
        <Input type="text" v-model="task.title" placeholder="标题"></Input>
      </FormItem>
      <FormItem label="题图：">
        <Upload
          class="picture-upload-container"
          v-show="!backgroundImageURL"
          action=""
          type="drag"
          :before-upload="handleUploadPicture"
          :show-upload-list="false"
          accept="image/*"
          :format="['jpg', 'jpeg', 'png']"
          :max-size="5120"
        >
          <div class="picture-upload">
              <Icon type="camera" size="40"></Icon>
              <p>点击或拖拽上传题图</p>
          </div>
        </Upload>
        <div v-show="backgroundImageURL" class="picture-preview-container">
          <div :style="{backgroundImage: backgroundImageURL}" class="picture-preview">
            <div class="image-preview-cover">
              <icon type="ios-trash-outline" @click.native="handleRemove"></icon>
            </div>
          </div>
        </div>
      </FormItem>
      <FormItem label="发布者：">
        <p style="text-align: left">{{user.username}}</p>
      </FormItem>
      <FormItem label="任务类型：">
        <Select style="width: 25%" :clearable="true" :filterable="true" @on-change="setTaskType">
          <Option v-for="item in taskTypes"
                  :value="item._id"
                  :key="item._id">{{item.name}}</Option>
        </Select>
        <span style="color: grey; margin-left: 10px">
          若无您满意的类型，可<a @click="$router.push({name: 'aboutSite'})">联系我们</a>定制任务类型
        </span>
        <p v-if="task.type" style="margin-left: 5px; margin-top: 5px;">{{task.type.description}}</p>
      </FormItem>
      <FormItem prop="tags" label="标签：">
        <Tag
          v-for="item in task.tags"
          :key="item"
          :name="item"
          closable
          @on-close="handleRemoveTag">
          {{ item }}
        </Tag>
        <Input
          v-model="tagInput"
          @on-enter="handelTagInputKeyDown"
          placeholder="按回车完成输入"
          size="small"
          style="width: 150px">
        </Input>
      </FormItem>
      <FormItem label="截止日期：">
          <DatePicker type="date" placeholder="选择日期" :options="datePickerOption" v-model="task.deadline"></DatePicker>
        </Row>
      </FormItem>
      <FormItem prop="excerption" label="任务简介：">
        <Input
          v-model="task.excerption"
          type="textarea"
          placeholder="请输入任务简介，不超过140字"></Input>
      </FormItem>
      <FormItem prop="description" label="任务描述：">
        <div class="description-editor">
          <Input
            class="description-input"
            v-model="task.description"
            type="textarea"
            placeholder="请输入任务简介">
          </Input>
          <div class="description-preview github-markdown markdown-body" v-html="compiledDescription"></div>
        </div>
      </FormItem>
    </Form>
    <div class="submit-buttons">
      <Button type="primary" @click="handleCreate">创建</Button>
    </div>
  </div>
</template>

<script>
  import User from '../../components/User.vue'
  import TaskTypes from '../../components/taskTypes.vue'
  import debounce from 'lodash/debounce.js'
  import marked from 'marked'

  export default {
    mixins: [User, TaskTypes],
    data() {
      return {
        task: {
          title: '',
          titlePicture: null,
          type: '',
          tags: [],
          excerption: '',
          description: '',
          deadline: null,
        },
        ruleSubmit: {
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' },
          ],
          tags: [
            {
              validator: (rule, value, callback) => {
                if (this.task.tags.length > 5) {
                  callback(new Error('标签数量不能超过5个'));
                } else {
                  callback();
                }
              },
              trigger: 'change'
            }
          ],
          excerption: [
            { required: true, message: '简介不能为空', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (this.task.excerption.length > 140) {
                  callback(new Error('不能超过140字'));
                } else {
                  callback();
                }
              },
              trigger: 'change'
            }
          ],
          description: [
            { required: true, message: '任务描述不能为空', trigger: 'blur' },
          ]
        },
        imagePreviewURL: '',
        tagInput: '',
//        tagsAutoComplete: [],
        taskDescription: '',
        datePickerOption: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now();
          }
        }
      }
    },
    computed: {
      backgroundImageURL(){
        if(this.imagePreviewURL)
          return 'url("' + this.imagePreviewURL + '")';
        return '';
      },
      compiledDescription() {
        return marked(this.taskDescription)
      },
      taskTypes() {
        return this.$store.state.taskType.taskTypes;
      }
    },
    watch: {
      'task.description': function () {
        this.updateDescription();
      },
    },
    methods: {
      handleUploadPicture(file) {
        if (['image/gif', 'image/jpeg', 'image/png'].indexOf(file.type) === -1) {
          this.$Message.error('未知的图片格式!');
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.$Message.error('图片大小必须小于5M!');
          return false;
        }
        this.task.titlePicture= file;
        this.imagePreviewURL = URL.createObjectURL(file);
        return false;
      },
      handleRemove() {
        this.task.titlePicture = null;
        this.imagePreviewURL = '';
      },
      handleRemoveTag(event, name) {
        const index = this.task.tags.indexOf(name);
        this.task.tags.splice(index, 1);
        this.$refs.form.validateField('tags');
      },
      handelTagInputKeyDown(event) {
        if(this.tagInput) {
          if(this.task.tags.indexOf(this.tagInput) === -1) {
            this.task.tags.push(this.tagInput);
            this.tagInput = '';
          } else {
            this.$Message.warning({
              content: '已经包含该标签',
              duration: 1.5,
            })
          }
        }
      },
      updateDescription: debounce(function () {
        this.taskDescription = this.task.description;
      }, 500),
      handleCreate() {
        this.$refs.form.validate((valid) => {
          if(valid) {
            this.$Modal.confirm({
              title: '确认',
              content: !this.task.type ?
                `<p>确认要创建您的任务吗？</p>
                 <p style="color:red">您尚未选定任务类型，可在创建完成之后补充。</p>` :
                `<p>确认要创建您的任务吗？</p>
                 <p style="color:red">您已选定任务类型
                    <b>${this.task.type.name}</b>，创建任务后将无法更改，确认选择该类型吗
                 </p>`,
              onOk: () => {
                let data = {};
                data.name = this.task.title;
                data.description = this.task.description;
                data.excerption = this.task.excerption;
                if(this.task.tags.length)
                  data.tags = this.task.tags;
                if(this.task.type)
                  data.type = this.task.type._id;
                if(this.task.deadline)
                  data.deadline = this.task.deadline;
                if(this.task.titlePicture)
                  data.picture = this.task.titlePicture;
                return this.$store.dispatch('task/create', data).then(response => {
                  this.$Message.success({
                    content: '创建成功',
                    duration: 5
                  });
                  if(this.task.type)
                    this.$router.push({name: 'taskContentEdit', params: {id: response._id}});
                  else
                    this.$router.push({name: 'myTasksManage'});
                }).catch(err => {
                  this.$Message.error(err.message);
                  console.error(err);
                })
              }
            })
          }
        });
      },
      setTaskType(value) {
        this.task.type = this.taskTypeById(value);
      },
    },
  }
</script>

<style lang="less">
  @import '../../assets/markdown/github-markdown';
  @import '../../assets/markdown/markdown-normal-style';
  @picture-uploaded-width: 480px;
  @picture-uploaded-height: 240px;

  .publish-progress {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .picture-upload-container {
    max-width: @picture-uploaded-width;
  }

  .picture-upload {
    height: @picture-uploaded-height;
  }

  .picture-preview-container {
    border: 1px dashed #dddee1;
    width: min-content;
  }

  .picture-preview {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-color: #666666;
    position: relative;
    height: @picture-uploaded-height;
    width: @picture-uploaded-width;
  }

  .picture-preview:hover .image-preview-cover, .picture-upload{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .image-preview-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }

  .image-preview-cover i{
    color: #ffffff;
    font-size: 50px;
    cursor: pointer;
  }

  @description-editor-height: 300px;
  .description-editor {
    display: flex;
  }

  .description-input, .description-preview{
    width: 49%;
    height: @description-editor-height;
    vertical-align: top;
  }

  .description-input textarea {
    height: 100%;
  }

  .description-preview {
    border: solid 1px #dddee1;
    border-radius: 4px;
    overflow-y: auto;
    margin-left: 10px;
    padding: 5px 5px;
    background-color: #0000000a;
  }

  .submit-buttons {
    text-align: right;
  }
</style>
