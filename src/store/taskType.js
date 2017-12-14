import {axios, throwOnError, objectToFormData, objectToQueryString} from './transport';
import Vue from 'vue';
import qs from 'qs';

const state = {
  taskTypes: [
    {
      _id: 'guess-number',
      name: '猜数字',
      description: '猜数字游戏'
    }
  ]
};

const mutations = {
  updateTaskTypes(state, taskType) {
    let newTaskTypes = state.taskTypes.slice();
    const index = newTaskTypes.findIndex(item => item._id === taskType._id);
    if(index === -1)
      newTaskTypes.push(taskType);
    else
      newTaskTypes[index] = taskType;
    Vue.set(state, 'taskTypes', newTaskTypes);
  },
};

const actions = {
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
