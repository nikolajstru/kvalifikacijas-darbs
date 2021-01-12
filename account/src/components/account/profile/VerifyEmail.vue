<template>
    <div v-if="(hasEmail && !emailVerified) || hasTempEmail">
        <div class="alert alert-primary border-0 rounded-0 row">
            <div class="col-12 col-md-8 my-2">
                <div class="mb-1 text-black text-center
                    login-api-user-email-verified text-size-14">
                    <strong>{{ $t('confirmEmail')}}</strong>
                    <br/>
                    {{ $t('linkSentTo')}}
                    <strong>
                        <i>
                            {{emailToConfirm}}
                        </i>
                    </strong>
                </div>
            </div>
            <div class="col-12 col-md-4 my-2 d-flex mx-auto">
                <button
                        @click="verifyEmail"
                        class="btn btn-primary btn-pill
                        text-uppercase font-weight-bold
                        mx-auto text-size-10"
                        :disabled="loading"
                        type="submit">
                    {{ $t('resendVerification')}}
                </button>
            </div>
        </div>
        <div
            v-show="loading"
            class="row text-center justify-content-center my-2">
                <div class="spinner-grow " role="status">
                    <span class="sr-only"></span>
                </div>
                <div class="spinner-grow mx-2" role="status">
                    <span class="sr-only"></span>
                </div>
                <div class="spinner-grow " role="status">
                    <span class="sr-only"></span>
                </div>
        </div>
        <div class="text-center my-2">
            {{responseText}}
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      responseText: '',
      loading: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    hasEmail() {
      return this.user.profile.email !== null && this.user.profile.email.length > 0;
    },
    hasTempEmail() {
      return this.user.profile.emailTmp !== null && this.user.profile.emailTmp.length > 0;
    },
    emailVerified() {
      return this.user.profile.emailVerified;
    },
    emailToConfirm() {
      return (!this.user.profile.emailTmp)
        ? this.user.profile.email
        : this.user.profile.emailTmp;
    },
  },
  methods: {
    verifyEmail() {
      this.loading = true;
      const { user } = this;
      let responseText = '';
      this.responseText = '';
      if (!user.profile.emailTmp) {
        window.LoginAPI.resendSignUpEmail(
          { email: this.emailToConfirm, language: 'lv' },
          (response) => {
            if (response.data === true) {
              responseText = this.$t('emailVerificationSent');
            } else if (response.data === false && this.emailToConfirm.length > 1) {
              responseText = this.$t('emailVerificationSentCheckAgain');
            }
            setTimeout(() => {
              this.loading = false;
              this.responseText = responseText;
            }, 1000);
          },
        );
      } else {
        window.LoginAPI.resendEmailChangeEmail(
          { language: 'lv' },
          (response) => {
            if (response.data === true) {
              responseText = this.$t('emailVerificationSent');
            } else if (response.data === false && this.emailToConfirm.length > 1) {
              responseText = this.$t('emailVerificationSentCheckAgain');
            }
            setTimeout(() => {
              this.loading = false;
              this.responseText = responseText;
            }, 1000);
          },
        );
      }
    },
  },
};
</script>
