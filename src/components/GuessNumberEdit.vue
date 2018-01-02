<template>
  <div v-if="!loading">
    <h1 class="task-title">{{task.name}}</h1>
    <Form ref="form"
          :model="guessNumber"
          :rules="ruleGuessNumber"
          :label-width="120">
      <FormItem prop="min" label="最小值：" required>
        <input-interger v-model="guessNumber.min" :min="0" :max="99"></input-interger>
      </FormItem>
      <FormItem prop="max" label="最大值：" required>
        <input-interger v-model="guessNumber.max" :min="1" :max="100"></input-interger>
      </FormItem>
      <FormItem label="任务总数：" required>
        <input-interger :disabled="guessNumber.total === Infinity"
                        :value="guessNumber.total === Infinity ? 1: guessNumber.total"
                        :min="1"
                        @input="setTotal"></input-interger>
        <Checkbox :value="guessNumber.total === Infinity" @input="setTotalInfinity">无穷</Checkbox>
      </FormItem>
      <FormItem label="最大猜测次数：" required>
        <input-interger :disabled="guessNumber.maxGuessTimes === Infinity"
                        :value="guessNumber.maxGuessTimes === Infinity ? 1: guessNumber.maxGuessTimes"
                        :min="1"
                        @input="setMaxGuessTimes"></input-interger>
        <Checkbox :value="guessNumber.maxGuessTimes === Infinity" @input="setMaxGuessTimesInfinity">无穷</Checkbox>
      </FormItem>
      <FormItem label="允许多次参与：" required>
        <RadioGroup :value="guessNumber.submitMultipleTimes ? 'true': 'false'" @input="setSubmitMultipleTimes">
          <Radio label="true">是</Radio>
          <Radio label="false">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="需要报名：" required>
        <RadioGroup :value="guessNumber.noSignup ? 'false': 'true'" @input="setNoSignup">
          <Radio label="true">是</Radio>
          <Radio label="false">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="!guessNumber.noSignup" prop="signupMultipleTimes" label="允许多次报名：" required>
        <RadioGroup :value="guessNumber.signupMultipleTimes ? 'true': 'false'" @input="setSignupMultipleTimes">
          <Radio label="true">是</Radio>
          <Radio label="false">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="自动审批任务：" required>
        <RadioGroup :value="guessNumber.submitAutoPass ? 'true': 'false'" @input="setSubmitAutoPass">
          <Radio label="true">是</Radio>
          <Radio label="false">否</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div class="button-box">
      <Button type="ghost" @click="handleSave">保存</Button>
      <Tooltip placement="top">
        <Button type="primary" @click="confirmSubmit">提交</Button>
        <div slot="content">
          <p>提交后将进入审核阶段，</p>
          <p>审核过后即可发布任务</p>
        </div>
      </Tooltip>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        loading: true,
        guessNumber: {
          min: 0,
          max: 1,
          total: Infinity,
          maxGuessTimes: Infinity,
          submitMultipleTimes: false,
          signupMultipleTimes: false,
          noSignup: false,
          submitAutoPass: false
        },
        ruleGuessNumber: {
          min: [
            {
              validator: (rule, value, callback) => {
                if(this.guessNumber.min >= this.guessNumber.max)
                  callback(new Error('最小值应小于最大值'));
                else {
                  // this.$refs.form.validate();
                  callback();
                }
              },
              trigger: 'change'
            },
          ],
          max: [
            {
              validator: (rule, value, callback) => {
                if(this.guessNumber.min >= this.guessNumber.max)
                  callback(new Error('最大值应大于最小值'));
                else {
                  // this.$refs.form.validate();
                  callback();
                }
              },
              trigger: 'change'
            },
          ]
        }
      }
    },
    computed: {
      task() {
        return this.$store.state.task.tasks[this.$route.params.id];
      },
    },
    methods: {
      setTotal(value) {
        this.guessNumber.total = value;
      },
      setTotalInfinity(value) {
        this.guessNumber.total = value ? Infinity: 1;
      },
      setMaxGuessTimes(value) {
        this.guessNumber.maxGuessTimes = value;
      },
      setMaxGuessTimesInfinity(value) {
        this.guessNumber.maxGuessTimes = value ? Infinity: 1;
      },
      setSubmitMultipleTimes(value) {
        this.guessNumber.submitMultipleTimes = value === 'true';
      },
      setNoSignup(value) {
        this.guessNumber.noSignup = value === 'false';
      },
      setSignupMultipleTimes(value) {
        this.guessNumber.signupMultipleTimes = value === 'true';
      },
      setSubmitAutoPass(value) {
        this.guessNumber.submitAutoPass = value === 'true';
      },
      getPostData() {
        let data = Object.assign({}, this.guessNumber);
        data.id = this.$route.params.id;
        if(data.maxGuessTimes === Infinity)
          delete data.maxGuessTimes;
        if(data.total === Infinity)
          delete data.total;
        if(data.noSignup)
          delete data.signupMultipleTimes;
        return data;
      },
      handleSave() {
        this.$refs.form.validate( valid => {
          if(valid) {
            const data = this.getPostData();
            this.$store.dispatch('task/dataPost', data).then(() => {
              this.$Message.success('保存成功');
            }).catch(err => this.$Message.error(err.message));
          }
        })
      },
      confirmSubmit() {
        this.$refs.form.validate( valid => {
          if(valid) {
            this.$Modal.confirm({
              title: '提交任务',
              content: '<p>确认提交任务？</p>',
              onOk: () => {
                this.handleSubmit();
              }
            })
          }
        })
      },
      handleSubmit() {
        const data = this.getPostData();
        this.$store.dispatch('task/dataPost', data).then(() => {
          this.$store.dispatch('task/patch', {
            id: this.$route.params.id,
            status: 'SUBMITTED'
          }).then(() => {
            this.$Message.success('提交成功');
            this.$router.push({name: 'myTasksManage'});
          }).catch(err => this.$Message.error(err.message));
        }).catch(err => this.$Message.error(err.message));
      }
    },
    mounted() {
      this.loading = true;
      this.$store.dispatch('task/dataGet', this.$route.params.id).then(data => {
        this.guessNumber.min = this.task.min || 0;
        this.guessNumber.max = this.task.max || 1;
        this.guessNumber.total = this.task.total || Infinity;
        this.guessNumber.maxGuessTimes = this.task.maxGuessTimes || Infinity;
        this.guessNumber.submitMultipleTimes = this.task.submitMultipleTimes || false;
        this.guessNumber.noSignup = this.task.noSignup || false;
        this.guessNumber.signupMultipleTimes = this.task.signupMultipleTimes || false;
        this.guessNumber.submitAutoPass = this.task.submitAutoPass || false;
        this.loading = false;
      }).catch( err => this.$Message.error(err.message));

    }
  }
</script>

<style lang="less">
  .task-title {
    margin: 20px;
  }
</style>
