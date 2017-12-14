import {axios, throwOnError, objectToFormData, objectToQueryString} from './transport';
import Vue from 'vue';
import qs from 'qs';

const state = {
  tasks: {}
};

const mutations = {
  updateTask(state, task) {
    if (typeof task.updatedAt === 'string')
      task.updatedAt = new Date(task.updatedAt);
    const old = state.tasks[task._id];
    if (old && old.updatedAt.getTime() >= task.updatedAt.getTime())
      return;
    Vue.set(state.tasks, task._id, task);
  },
  deleteTask(state, id) {
    Vue.delete(state.tasks, id)
  }
};

const actions = {
  async get({commit}, id) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().get('/api/task/' + id, {headers}));
    commit('updateTask', response);
    return response;
  },
  async find({commit}, query) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().get('/api/task', {
      params: query,
      paramsSerializer: qs.stringify,
      headers
    }));
    for(let task of response.data)
      commit('updateTask', task);
    return response;
  },
  async patch({commit}, data) {
    const config = {
      params: {populate: true},
      headers: {}
    };
    const jwt = window.localStorage.getItem('jwt');
    const id = data.id, onUploadProgress = data.onUploadProgress;
    delete data.id;
    delete data.onUploadProgress;
    if (jwt)
      config.headers.Authorization = 'Bearer ' + jwt;
    if (data.avatar) {
      config.headers['Content-Type'] = 'multipart/form-data';
      data = objectToFormData(data);
    }
    if (onUploadProgress)
      config.onUploadProgress = onUploadProgress;
    const response = await throwOnError(axios().patch('/api/task/' + id, data, config));
    commit('updateTask', response);
    return response;
  },
  async delete({commit}, id) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().delete('/api/task/' + id, {headers}));
    commit('deleteTask', id);
    return response;
  },
  async create({commit}, data) {
    const config = {
      params: {populate: true},
      headers: {}
    };
    const jwt = window.localStorage.getItem('jwt');
    const id = data.id, onUploadProgress = data.onUploadProgress;
    delete data.id;
    delete data.onUploadProgress;
    if (jwt)
      config.headers.Authorization = 'Bearer ' + jwt;
    if (data.picture) {
      config.headers['Content-Type'] = 'multipart/form-data';
      data = objectToFormData(data);
    }
    if (onUploadProgress)
      config.onUploadProgress = onUploadProgress;
    const response = await throwOnError(axios().post('/api/task/', data, config));
    commit('updateTask', response);
    return response;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
