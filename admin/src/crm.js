import Vue from 'vue';
import VueQuill from 'vue-quill';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import VueExcelXlsx from 'vue-excel-xlsx';
import App from './App.vue';
import router from './router';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import registerLoginApiListeners from './registerLoginApiListeners';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import { mainMixin } from './main';

import './styles/global.scss';

Vue.use(VueQuill);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueExcelXlsx);
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
Vue.config.productionTip = false;

Vue.mixin(mainMixin);


if (window.LoginAPI.isModuleInited()) {
  window.LoginAPI.getUserProfile(() => {
    const vm = new Vue({
      router, render: h => h(App),
    }).$mount('#app');
    registerLoginApiListeners(vm);
  });
} else {
  window.addEventListener('login_api_init', () => {
    const vm = new Vue({
      router, render: h => h(App),
    }).$mount('#app');
    registerLoginApiListeners(vm);
  });
}

window.handleRedirect = (options = {}) => {
  if (options.action && options.action !== '') {
    options.action();
  } else if (options.link && options.link !== '') {
    window.location.replace(options.link);
  }
};
