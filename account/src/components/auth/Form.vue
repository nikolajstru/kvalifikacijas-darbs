<template>
    <div class="login-form">
        <div v-if="component === 'Login'">
            <div class="text-center mt-2 mb-4">
                <h1 class="h2">{{ $t('loginTitle') }}</h1>
                <span>
                    {{ $t('loginSubtitle') }}
                    <button class="btn btn-link border-0 p-0 link align-baseline"
                            @click="next('Register')">
                        {{$t('loginSubtitleLink')}}
                    </button>
                </span>
                <div class="py-2">
                    <div class="pt-2 text-center text-pale-sky">
                        {{$t('loginBeforeSubscribe')}}
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="component === 'Register'">
            <div class="text-center mt-sm-2 mb-3">
                <h1 class="h2">{{ $t('registerTitle') }}</h1>
                <span>
                    {{ $t('registerSubtitle') }}
                    <button class="btn btn-link border-0 p-0 link align-baseline"
                            @click="next('Login')">
                        {{$t('registerSubtitleLink')}}
                    </button>
                </span>
                <div class="py-2">
                    <div class="pt-2 text-center text-pale-sky">
                        {{$t('registerBeforeSubscribe')}}
                    </div>
                </div>
            </div>
        </div>
        <component :is="component"
                   @next="next"
                   class=" mb-5"
                   @error="showError"
                   @clearError="clearError"
                   :afterSignIn="afterSignIn"
                   :afterSignUp="afterSignUp"
                   :afterPasswordReset="afterPasswordReset"
                   :passwordResetCode="passwordResetCode"
                   buttonClass="btn-primary text-uppercase font-weight-bol"
                   fieldClass="border-light bg-porcelain"
        ></component>
        <social-auth
                :socialAccounts="socialAccounts"
                :loginWithCallback="loginWithCallback"
                :info="$t('socialLogin')"/>
    </div>
</template>

<script>
import Login from './Login.vue';
import Register from './Register.vue';
import RecoverPassword from './RecoverPassword.vue';
import ResetPassword from './ResetPassword.vue';
import Errors from '../partials/Errors.vue';
import SocialAuth from './SocialAuth.vue';

export default {
  props: {
    startView: String,
    afterSignIn: Function,
    afterSignUp: Function,
    afterPasswordReset: Function,
    passwordResetCode: String,
  },
  data() {
    return {
      component: '',
      socialAccounts: ['facebook', 'google', 'draugiem', 'twitter'],
    };
  },
  components: {
    Login,
    Register,
    RecoverPassword,
    ResetPassword,
    Errors,
    SocialAuth,
  },
  created() {
    if (!this.startView) {
      this.component = 'Login';
    } else {
      this.component = this.startView;
    }
  },
  methods: {
    next(component) {
      this.clearError();
      this.component = component;
    },
    loginWithCallback(data, signupCallback) {
      if (data.accountExists) {
        this.signUpUser();
      } else {
        signupCallback((signUpResult) => {
          if (signUpResult.data.status) {
            this.signUpUser();
          }
        });
      }
    },
    signUpUser() {
      window.LoginAPI.getUserProfile((profileData) => {
        this.loading = false;
        localStorage.setItem('USER', JSON.stringify(profileData.data));
      });
    },
    showError(errors) {
      this.errors.push(errors);
    },
    clearError() {
      this.errors = [];
    },
  },
};
</script>
