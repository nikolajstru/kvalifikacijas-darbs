<template>
    <div>
        <email-input v-model="user.email"
                     :data="{
                        id: 'userEmail',
                        label: $t('userEmail'),
                        inputMode: 'email',
                        customClass: `${fieldClass}`,
                    }"
        />
        <password-input v-model="user.password"
                        :data="{
                            id: 'userPassword',
                            label: $t('userPassword'),
                            customClass: `${fieldClass}`,
                        }"
        />
        <div v-if="!disableRecover" class="text-right">
            <button type="button"
                    @click="$emit('next', 'RecoverPassword')"
                    class="btn btn-link border-0 p-0 link align-baseline text-pale-sky">
                {{ $t('resetPassword') }}
            </button>
        </div>
        <Errors :errors="errors"/>
        <div class="text-center mt-4">
            <submit-button :loading="loading"
                           :customClass="`${buttonClass}`"
                           :text="$t('loginAction')"
                           @click="doLogin"
            />
        </div>
    </div>
</template>

<script>
import Errors from '../partials/Errors.vue';
import EmailInput from '../partials/float-inputs/Email.vue';
import PasswordInput from '../partials/float-inputs/Password.vue';
import SubmitButton from '../partials/SubmitButton.vue';

export default {
  data() {
    return {
      errors: [],
      user: {
        email: '',
        password: '',
      },
      loading: null,
    };
  },
  props: {
    afterSignIn: Function,
    buttonClass: String,
    fieldClass: String,
    disableRecover: Boolean,
  },
  components: {
    EmailInput,
    PasswordInput,
    SubmitButton,
    Errors,
  },
  methods: {
    doLogin() {
      this.loading = true;
      this.errors = [];
      window.LoginAPI.loginWithUsernamePassword(
        this.user.email,
        this.user.password,
        (response) => {
          if (!response.data.status) {
            this.loading = false;
            this.errors.push(this.$t('errorWrongEmailOrPassword'));
          } else {
            this.loading = false;
            this.afterSignIn();
          }
        },
      );
    },
  },
};
</script>
