import {axios, throwOnError, socket} from './transport';
import jwtDecode from 'jwt-decode';

const state = {
  token: null
};

const AllowedUserRoles = ['PUBLISHER', 'TASK_ADMIN', 'USER_ADMIN', 'SITE_ADMIN'];

const mutations = {
  updateToken(state, token) {
    if (token) {
      window.localStorage.setItem('jwt', token);
      state.token = jwtDecode(token);
    } else {
      window.localStorage.removeItem('jwt');
      state.token = null;
    }
  }
};

const actions = {
  async auth({commit}, data) {
    const response = await throwOnError(axios().post('/api/auth/', data));
    commit('updateToken', response);
    return response;
  },
  async authAndGetUser({dispatch, state}, data) {
    return dispatch('auth', data).then(() =>
      dispatch('user/get', state.token.uid, {root: true})
    ).then((user) => {
      if(user.roles.filter(item => AllowedUserRoles.includes(item)).length === 0){
        let err = new Error('Permission denied');
        this.commit('auth/updateToken');
        throw err;
      }
      return user;
    })
  }
};

const getters = {
  user(state, getters, rootState) {
    if (state.token)
      return rootState.user.users[state.token.uid];
    return null;
  },
  avatarThumbnail(state, getters) {
    if (getters.user)
      return getters.user.avatarThumbnail64;
    return null;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
