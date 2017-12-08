class State {
  newVersionAvailable = false;
  loginDialog = false;
}

const state = new State();

const mutations = {
  newVersionAvailable(state) {
    state.newVersionAvailable = true;
  },
  loginDialogSet(state, visible) {
    state.loginDialog = visible;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
