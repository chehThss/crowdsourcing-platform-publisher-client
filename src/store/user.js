import {axios, throwOnError, objectToFormData} from './transport';
import Vue from 'vue';

const state = {
  users: {}
};

const AllowedUserRoles = ['PUBLISHER', 'TASK_ADMIN', 'USER_ADMIN', 'SITE_ADMIN'];

const mutations = {
  updateUser(state, user) {
    if (typeof user.createdAt === 'string')
      user.createdAt = new Date(user.createdAt);
    if (typeof user.updatedAt === 'string')
      user.updatedAt = new Date(user.updatedAt);
    const old = state.users[user._id];
    if (old && old.updatedAt.getTime() >= user.updatedAt.getTime())
      return;
    Vue.set(state.users, user._id, user);
  },
  deleteUser(state, id) {
    Vue.delete(state.users, id)
  }
};

const actions = {
  async get({commit}, id) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().get('/api/user/' + id, {headers}));
    if(response.roles.filter(item => AllowedUserRoles.includes(item)).length === 0){
      let err = new Error('Permission denied');
      throw err;
    }
    commit('updateUser', response);
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
    const response = await throwOnError(axios().patch('/api/user/' + id, data, config));
    commit('updateUser', response);
    return response;
  },
  async sendMail(_, data) {
    let a = await throwOnError(axios().post('/api/email/', data));
    return a;
  },
  async confirmMail(_, data) {
    const id = data.id;
    delete data.id;
    return await throwOnError(axios().post('/api/email/' + id, data));
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
