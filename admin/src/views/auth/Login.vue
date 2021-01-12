<template>
    <div id="login-api">
        <div class="d-flex">
            <router-link to="/register"  class="btn btn-link ml-auto">
                Register
            </router-link>
        </div>
        <div class="text-center mt-2 mb-5">
            <h1 class="h2">Login</h1>
        </div>
        <form ref="login" @submit.prevent="doLogin">
            <input-text :inputData="{
                    name: 'username',
                    placeholder: 'E-pasts' ,
                  }"/>
            <input-password :inputData="{
                    name: 'password',
                    placeholder: 'Parole',
                  }" />

            <Errors :errors="errors" />
            <button-submit :text="`Pieslēgties`" />
        </form>
    </div>
</template>

<script>
/* eslint-disable no-console */
/* global handleRedirect */
import InputPassword from '../../components/partials/inputs/Password.vue';
import ButtonSubmit from '../../components/partials/buttons/Submit.vue';
import Errors from '../../components/partials/Errors.vue';
import InputText from '../../components/partials/inputs/Text.vue';

export default {
  data() {
    return {
      errors: [],
      socialAccounts: ['facebook', 'google', 'draugiem', 'twitter'],
      socialLink: null,
    };
  },
  props: {
    options: Object,
  },
  components: {
    InputPassword,
    ButtonSubmit,
    Errors,
    InputText,
  },
  methods: {
    doLogin(submitEvent) {
      this.errors = [];
      const formData = submitEvent.target.elements;
      this.username = formData.username.value;

      window.LoginAPI.loginWithUsernamePassword(
        this.username, formData.password.value, (response) => {
          if (!response.data.status) {
            this.errors.push('errorWrongEmailOrPassword');
          } else {
            // do not use for redirects, action only
            handleRedirect({ action: this.formAction });
          }
        },
      );
    },
  },
};
</script>
