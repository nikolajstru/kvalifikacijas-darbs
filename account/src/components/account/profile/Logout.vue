<template>
    <button
        :class="customClass"
        class="logout"
        type="button"
        v-on:click="doLogout">
        {{ $t('logout')}}
    </button>
</template>


<script>
/* eslint-disable no-console */
/* global handleRedirect */
export default {
  data() {
    const { options = {} } = this;
    return {
      customClass: options.customClass || 'text-pale-sky border'
      + ' btn-pill py-1 px-4 font-weight-normal',
      formAction: options.logoutAction,
    };
  },
  props: {
    options: Object,
  },
  methods: {
    doLogout() {
      console.log('init logout from api');
      window.LoginAPI.logout(() => {
        console.log('done logout from api - please wait for logout event now');
        // do not use for redirects, action only
        handleRedirect({ action: this.formAction });
      });
    },
  },
};
</script>
