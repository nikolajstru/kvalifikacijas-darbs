<template>
    <div id="login-api">
        <div class="text-center mt-2">
            <h1 class="h2">{{ $t('recoverPasswordTitle') }}</h1>
        </div>
        <div v-if="!recoverInfoSend">
            <span class="text-center mb-5 d-block">
                {{ $t('recoverPasswordSubtitle') }}
            </span>
            <email-input v-model="email"
                         :data="{
                        id: 'userEmail',
                        label: `*${$t('userEmail')}`,
                        inputMode: 'email',
                        customClass: 'border-light bg-porcelain',
                    }"
            />
            <div class="text-right">
                <button type="button"
                        @click="$emit('next', 'Login')"
                        class="btn btn-link border-0 p-0 link align-baseline text-pale-sky">
                    {{ $t('backToLogin') }}
                </button>
            </div>
            <Errors :errors="errors"/>
            <div class="text-center mt-4 mb-5">
                <submit-button :loading="loading"
                               :customClass="`${buttonClass}`"
                               :text="$t('recoverPasswordAction')"
                               @click="doRecoverPassword"
                />
            </div>
        </div>
        <div v-else>
            {{$t('resetInfoHasBeenSentToEmail')}}
        </div>
    </div>
</template>

<script>
import EmailInput from '../partials/float-inputs/Email.vue';
import SubmitButton from '../partials/SubmitButton.vue';
import Errors from '../partials/Errors.vue';

export default {
  data() {
    return {
      errors: [],
      email: null,
      loading: null,
      recoverInfoSend: null,
    };
  },
  props: {
    buttonClass: String,
  },
  components: {
    EmailInput,
    SubmitButton,
    Errors,
  },
  methods: {
    doRecoverPassword() {
      this.errors = [];
      this.loading = true;
      window.LoginAPI.recoverPassword(
        {
          email: this.email,
        },
        (response) => {
          this.loading = false;
          if (response.data === true) {
            this.recoverInfoSend = true;
          } else if (response.errors) {
            (response.errors).forEach((error) => {
              const message = (error.error.message) ? error.error.message : error.error.type;
              this.errors.push(message);
            });
          } else {
            window.LoginAPI.checkEmail(
              this.email,
              false,
              (checkEmailResponse) => {
                if (checkEmailResponse.data.available === true) {
                  this.errors.push(this.$t('cantFindInSystem'));
                } else {
                  this.errors.push(this.$t('errorUnknown'));
                }
              },
            );
          }
        },
      );
    },
  },

};
</script>
