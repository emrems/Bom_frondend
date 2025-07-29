import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('authToken') || null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('authToken', token)
    },
    CLEAR_TOKEN(state) {
      state.token = null
      localStorage.removeItem('authToken')
    }
  },
  actions: {
    login({ commit }, token) {
      commit('SET_TOKEN', token)
    },
    logout({ commit }) {
      commit('CLEAR_TOKEN')
    }
  },
  getters: {
    isAuthenticated: state => !!state.token
  }
})