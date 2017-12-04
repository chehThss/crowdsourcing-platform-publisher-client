<template>
  <div class="publish">
    <Steps :current="0" class="publish-progress">
      <Step title="待提交"></Step>
      <Step title="待审核"></Step>
      <Step title="待发布"></Step>
      <Step title="已发布"></Step>
    </Steps>
    <Form ref="submitForm"
          :model="formSubmit"
          :rules="ruleSubmit"
          :label-width="100">
      <FormItem prop="taskTitle" label="任务标题：">
        <Input type="text" v-model="formSubmit.title" placeholder="标题" autofocus></Input>
      </FormItem>
      <FormItem label="题图：">
        <Upload
          class="picture-upload-container"
          v-show="!showPicturePreview"
          action=""
          type="drag"
          :before-upload="handleUpload"
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
        <div v-show="showPicturePreview" class="picture-preview-container">
          <div :style="{backgroundImage: backgroundImageURL}" class="picture-preview">
            <div class="image-preview-cover">
              <icon type="ios-trash-outline" @click.native="handleRemove"></icon>
            </div>
          </div>
        </div>
      </FormItem>
      <FormItem label="发布者：">
        <p style="text-align: left">{{publisherName}}</p>
      </FormItem>
      <FormItem label="标签：">
        <Tag
          v-for="item in formSubmit.tags"
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
      <FormItem label="任务截止日期">
          <DatePicker type="date" placeholder="选择日期" v-model="formSubmit.deadline"></DatePicker>
        </Row>
      </FormItem>
      <FormItem label="任务描述：">
        <div class="description-editor">
          <Input
            class="description-input"
            v-model="formSubmit.description"
            type="textarea"
            placeholder="请输入任务简介">
          </Input>
          <div class="description-preview" v-html="compiledDescription"></div>
        </div>
      </FormItem>
    </Form>
    <div class="submit-buttons">
      <Button type="ghost" @click="handleSave">保存</Button>
      <Button type="primary" @click="handleSubmitButtonClicked">提交</Button>
    </div>
    <Modal
      title="提交"
      v-model="showSubmitConfirmModal"
      @on-ok="handleSubmit"
      class="vertical-center-modal">
      <p>确认要提交您的任务吗？</p>
    </Modal>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce.js'
  import marked from 'marked'

  export default {
    data() {
      const validateTitle = (rule, value, callback) => {
        if (!this.formSubmit.title) {
          callback(new Error('请输入标题'));
        } else {
          callback()
        }
      };
      return {
        formSubmit: {
          title: '',
          titlePicture: null,
          publisher: '',
          tags: [],
          description: '',
          deadline: null,
        },
        ruleSubmit: {
          taskTitle: [
            { validator: validateTitle, trigger: 'blur'}
          ]
        },
        imagePreviewURL: '',
        showPicturePreview: false,
        tagInput: '',
        tagsAutoComplete: [],
        taskDescription: '',
        showSubmitConfirmModal: false
      }
    },
    computed: {
      backgroundImageURL(){
        return 'url("' + this.imagePreviewURL + '")';
      },
      publisherName(){
        // TODO: get username
        return 'chehang';
      },
      compiledDescription() {
        return marked(this.taskDescription)
      }
    },
    watch: {
      'formSubmit.description': function () {
        this.updateDescription();
      },
    },
    methods: {
      handleUpload(file) {
        this.formSubmit.titlePicture= file;
        this.imagePreviewURL = URL.createObjectURL(file);
        this.showPicturePreview = true;
        return false;
      },
      handleRemove() {
        this.file = null;
        this.showPicturePreview = false;
      },
      handleRemoveTag(event, name) {
        const index = this.formSubmit.tags.indexOf(name);
        this.formSubmit.tags.splice(index, 1);
      },
      handelTagInputKeyDown(event) {
        if(this.tagInput) {
          if(this.formSubmit.tags.indexOf(this.tagInput) === -1) {
            this.formSubmit.tags.push(this.tagInput);
            this.tagInput = '';
          } else {
            this.$Notice.warning({
              title: '已经包含该标签',
              duration: 1.5,
              top: 150
            })
          }
        }
      },
      updateDescription: debounce(function () {
        this.taskDescription = this.formSubmit.description;
      }, 500),
      handleSave() {
        // TODO: save current content
      },
      handleSubmitButtonClicked() {
        this.$refs.submitForm.validate((valid) => {
          if(valid) {
            this.$refs.submitForm.resetFields();
            this.showSubmitConfirmModal = true;
          }
        });
      },
      handleSubmit() {
        // TODO: submit task
        console.log("TODO: submit task")
      }
    },
  }
</script>

<style lang="less">
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
    padding: 0 5px;
  }

  .submit-buttons {
    text-align: right;
  }
</style>
