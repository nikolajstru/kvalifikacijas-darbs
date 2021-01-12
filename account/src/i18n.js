import Vue from 'vue';
import VueI18n from 'vue-i18n';

import lvLV from '../locales/lv_LV.yml';
import ruLV from '../locales/ru_LV.yml';

// Use i18n
Vue.use(VueI18n);

export default new VueI18n({
  locale: process.env.VUE_APP_LOCALE,
  messages: {
    lv_LV: lvLV,
    ru_LV: ruLV,
  },
});
