import Vue from 'vue';
import router from '@/account-router';
import i18n from '@/i18n';
import '@/main';
import store from '@/store/account';
import BootstrapVue from 'bootstrap-vue';
import Index from '@/components/account/Index.vue';
import LoginForm from '@/components/auth/Form.vue';

import '@/styles/account/styles.scss';
import '@/styles/account/quill.scss';
import '@/styles/global.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);

/* eslint-disable no-console */
Vue.config.productionTip = false;

window.placeAccount = (placeholderId, callback) => {
  new Vue({
    router,
    i18n,
    store,
    render: h => h(Index, {
      props: {
        callback,
      },
    }),
  }).$mount(`#${placeholderId}`);
};

window.placeAccountPage = (
  placeholderId = 'accountPage',
  callback,
) => {
  if (window.LoginAPI.isModuleInited()) {
    window.LoginAPI.getUserProfile((data) => {
      if (data && data.data && data.data.loginStatus !== false) {
        localStorage.setItem('USER', JSON.stringify(data.data));
      } else {
        localStorage.removeItem('USER');
      }
      window.placeAccount(placeholderId, callback);
    });
  } else {
    window.addEventListener('login_api_init', ({ detail }) => {
      if (detail && detail.id) {
        localStorage.setItem('USER', JSON.stringify(detail));
      } else {
        localStorage.removeItem('USER');
      }
      window.placeAccount(placeholderId, callback);
    });
  }
};

window.placeLoginBlock = (
  placeholderId = 'loginBlock',
  afterSignIn,
  afterSignUp,
) => {
  new Vue({
    i18n,
    render: h => h(LoginForm, {
      props: {
        placeholderId,
        afterSignIn,
        afterSignUp,
      },
    }),
  }).$mount(`#${placeholderId}`);
};
