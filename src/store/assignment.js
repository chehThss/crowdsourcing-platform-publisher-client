import {axios, throwOnError, objectToFormData, objectToQueryString} from './transport';
import Vue from 'vue';
import qs from 'qs';

const state = {
  assignments: {}
};

const mutations = {
  updateAssignment(state, assignment) {
    Vue.set(state.assignments, assignment._id, Object.assign(state.assignments[assignment._id] || {}, assignment));
  },
  deleteAssignment(state, id) {
    Vue.delete(state.assignments, id);
  }
};

const actions = {
  async get({commit}, id) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().get('/api/assignment/' + id, {headers}));
    commit('updateAssignment', response);
    return response;
  },
  async find({commit}, query) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().get('/api/assignment', {
      params: query,
      paramsSerializer: qs.stringify,
      headers
    }));
    for(let assignment of response.data)
      commit('updateAssignment', assignment);
    return response;
  },
  async patch({commit}, data) {
    const config = {
      params: {populate: true},
      headers: {}
    };
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      config.headers.Authorization = 'Bearer ' + jwt;
    const id = data.id;
    delete data.id;
    const response = await throwOnError(axios().patch('/api/assignment/' + id, data, config));
    commit('updateAssignment', response);
    return response;
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
