<template>
    <div id="login-api">
        <div class="text-center mt-2 mb-5">
            <h1 class="h2">Register</h1>
        </div>
        <form ref="login" @submit.prevent="doRegister">
            <input-text :inputData="{
                    name: 'username',
                    placeholder: 'E-pasts' ,
                  }"/>
            <input-password :inputData="{
                    name: 'password',
                    placeholder: 'Parole',
                    required: 'true',
                  }" />

            <Errors :errors="errors" />
            <button-submit :text="`Pieslēgties`" />
        </form>
        <social-auth
                :socialAccounts="socialAccounts"
                :formAction="socialAction"
                :formLink="socialLink"/>
    </div>
</template>

<script>
/* eslint-disable no-console */
/* global handleRedirect */
import InputPassword from '../components/partials/inputs/Password.vue';
import ButtonSubmit from '../components/partials/buttons/Submit.vue';
import Errors from '../components/partials/Errors.vue';
import InputText from '../components/partials/inputs/Text.vue';
import SocialAuth from '../components/SocialAuth.vue';

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
    SocialAuth,
  },
  methods: {
    doRegister(submitEvent) {
      this.errors = [];
      const formData = submitEvent.target.elements;

      window.LoginAPI.signUp({
        email: formData.username.value,
        displayName: '',
        password: formData.password.value,
        phone: '',
        firstname: '',
        lastname: '',
      }, (response) => {
        console.log(response);
        if (response.errors) {
          console.log(response.errors);
        } else if (response.data && response.data.status && this.errors.length === 0) {
          window.LoginAPI.loginWithUsernamePassword(
            formData.username.value,
            formData.password.value,
            (loginResponse) => {
              if (!loginResponse.data.status) {
                this.errors.push(this.$t('errorUnknown'));
              } else if (loginResponse.data.status === true) {
                this.notSubmitted = false;
                handleRedirect({ link: this.formLink, action: this.formAction });
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
