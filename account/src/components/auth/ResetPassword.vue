<template>
    <div id="login-api">
        <div class="text-center mt-2 mb-4">
            <h1 class="h2">{{ $t('resetPasswordTitle') }}</h1>
        </div>
        <password-input v-model="password"
                        :data="{
                            id: 'newPassword',
                            label: $t('userPasswordNew'),
                            customClass: 'border-light bg-porcelain',
                        }"
        />
        <password-input v-model="passwordConfirm"
                        :data="{
                            id: 'newPasswordConfirm',
                            label: $t('userPasswordConfirmation'),
                            customClass: 'border-light bg-porcelain',
                        }"
        />
        <Errors :errors="errors"/>
        <div class="text-center mt-4 mb-5">
            <submit-button :loading="loading"
                           :customClass="`${buttonClass}`"
                           :text="$t('resetPasswordAction')"
                           @click="doResetPassword"
            />
        </div>
    </div>
</template>

<script>
import PasswordInput from '../partials/float-inputs/Password.vue';
import SubmitButton from '../partials/SubmitButton.vue';
import Errors from '../partials/Errors.vue';

export default {
  data() {
    return {
      errors: [],
      password: '',
      passwordConfirm: '',
      loading: null,
    };
  },
  props: {
    afterPasswordReset: Function,
    passwordResetCode: String,
    buttonClass: String,
  },
  components: {
    PasswordInput,
    SubmitButton,
    Errors,
  },
  methods: {
    doResetPassword() {
      this.errors = [];
      if (this.password !== this.passwordConfirm) {
        this.errors.push(this.$t('errorPasswordsNotSimilar'));
      } else {
        this.loading = true;
        window.LoginAPI.resetPassword(
          {
            code: this.passwordResetCode,
            password: this.password,
          },
          (response) => {
            if (response.data === true) {
              this.afterPasswordReset();
            } else if (response.errors) {
              (response.errors).forEach((error) => {
                const message = (error.error.message) ? error.error.message : error.error.type;
                if (message === 'InvalidPasswordError') {
                  this.errors.push(this.$t('errorPasswordTooShort'));
                } else if (message === 'Email not available') {
                  this.errors.push(`${this.$t('emailAlreadyExists')}. ${this.$t('useLogin')}.`);
                } else {
                  this.errors.push(this.$t('errorUnknown'));
                }
                this.loading = false;
              });
            } else {
              this.errors.push(this.$t('errorUnknown'));
              this.loading = false;
            }
          },
        );
      }
    },
  },
};
</script>
