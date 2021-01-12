<template>
    <div id="login-api">
        <div class="d-flex">
            <router-link to="/login"  class="btn btn-link ml-auto">
                Login
            </router-link>
        </div>
        <div class="text-center mt-2 mb-5">
            <h1 class="h2">Register</h1>
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
      this.password = formData.password.value;

      window.LoginAPI.signUp({
        email: this.username,
        password: this.password,
      }, (response) => {
        if (response.errors) {
          (response.errors).forEach((error) => {
            if (error.error && (error.error.message || error.error.type)) {
              const message = (error.error.message) ? error.error.message : error.error.type;
              this.errors.push(message);
            }
          });
        } else if (response.data && response.data.status) {
          window.LoginAPI.loginWithUsernamePassword(
            this.user.email,
            this.user.password,
            (loginResponse) => {
              if (!loginResponse.data.status) {
                this.errors.push(this.$t('errorUnknown'));
              }
            },
          );
        }
      });
    },
  },
  mounted() {
  },

};
</script>
