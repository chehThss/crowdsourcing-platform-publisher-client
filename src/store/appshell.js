class State {
  newVersionAvailable = false;
  menuName = 'home';
}

const state = new State();

const mutations = {
  newVersionAvailable(state) {
    state.newVersionAvailable = true;
  },
  menuNameSet(state, value) {
    state.menuName = value;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
