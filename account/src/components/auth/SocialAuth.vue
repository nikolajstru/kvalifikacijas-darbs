<template>
    <div v-if="socialAccounts && socialAccounts.length" class="row align-items-center">
        <div class="col-12 text-center text-pale-sky">
            {{info}}
            <div class="d-block py-2">
                <button v-for="(account, key) in socialAccounts"
                        v-bind:key="key"
                        v-on:click="loginWith(account)"
                        class="btn rounded-circle text-center mx-2 p-0"
                        :class="'btn-'+account"
                        style="width: 30px; height: 30px;">
                    <i class="p-1"
                       :class="'icon-social-'+account"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-console, no-alert, no-restricted-globals */

export default {
  props: {
    info: String,
    socialAccounts: Array,
    loginWithCallback: Function,
  },
  methods: {
    loginWith(account) {
      switch (account) {
        case 'facebook':
          window.LoginAPI.loginWithFacebook((data, signupCallback) => {
            this.loginWithCallback(data, signupCallback);
          });
          break;
        case 'google':
          window.LoginAPI.loginWithGoogle((data, signupCallback) => {
            this.loginWithCallback(data, signupCallback);
          });
          break;
        case 'draugiem':
          window.LoginAPI.loginWithDraugiem((data, signupCallback) => {
            this.loginWithCallback(data, signupCallback);
          });
          break;
        case 'twitter':
          window.LoginAPI.loginWithTwitter((data, signupCallback) => {
            this.loginWithCallback(data, signupCallback);
          });
          break;
        default:
      }
    },
  },
};
</script>
