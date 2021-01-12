import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
/* eslint-disable */
const store = new Vuex.Store({
  state() {
    return {
      user: {
        profile: {},
      },
    };
  },
  mutations: {
    setUserProfile(state) {
      const loginApiToken = window.LoginAPI.getToken();
      if (loginApiToken) {
        const user = JSON.parse(localStorage.getItem('USER'));
        const phone = user.phone;
        let phoneNumber = phone;
        let countryCode = null;
        if (phone && JSON.parse(phone).toString() !== phone) {
          phoneNumber = JSON.parse(phone).number;
          countryCode = JSON.parse(phone).code;
        }
        user.phoneNumber = phoneNumber;
        user.countryCode = countryCode;
        state.user.profile = user;
        state.user.loginApiToken = loginApiToken;
      } else {
        state.user.profile = {
          loginApiToken: null,
        }
      }
    },
  },
  actions: {
    setProfile(context) {
      context.commit('setUserProfile');
    },
    async resetUserProfile(context) {
      window.LoginAPI.getUserProfile((data) => {
        if (data && data.data) {
          localStorage.setItem('USER', JSON.stringify(data.data));
          context.commit('setUserProfile', data.data);
          window.loadUserInfo();
        } else {
          context.commit('setUserProfile', null);
        }
      });
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
});

export default store;
