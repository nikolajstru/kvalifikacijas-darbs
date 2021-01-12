<template>
    <div>
        <h4 class="pb-3">
            {{$t('myProfile')}}
        </h4>
        <form @submit.prevent="editProfile">
            <div class="row">
                <div class="col-12">
                    <password-input v-model="password"
                                 :data="{
                                    id: 'password',
                                    label: `*${$t('userPassword')}`,
                                    customClass: 'border-light bg-porcelain',
                                }"
                    />
                </div>
                <div class="col-12">
                    <password-input v-model="passwordNew"
                                 :data="{
                                    id: 'passwordNew',
                                    label: `*${$t('userPasswordNew')}`,
                                    customClass: 'border-light bg-porcelain',
                                }"
                    />
                </div>
            </div>
            <Errors :errors="errors" />
            <div>
                <button class="btn btn-primary btn-sm btn-pill
                 font-weight-light text-size-14 px-3"
                        type="submit"
                        :disabled="sending">
                <span v-if="sending" class="spinner-border spinner-border-sm"
                      role="status" aria-hidden="true"></span>
                    {{$t('btnSave')}}
                </button>
            </div>
            <div v-if="success">
                Success!
            </div>
        </form>
    </div>
</template>

<script>
import Errors from '../../partials/Errors.vue';
import PasswordInput from '../../partials/float-inputs/Password.vue';

export default {
  data() {
    return {
      errors: {},
      sending: false,
      password: '',
      passwordNew: '',
      success: false,
    };
  },
  components: {
    Errors,
    PasswordInput,
  },
  methods: {
    editProfile() {
      this.errors = [];
      if (this.password.length > 0 && this.passwordNew.length > 0) {
        this.success = false;
        this.sending = true;
        window.LoginAPI.updateProfile(
          {
            passwordOld: this.password,
            passwordNew: this.passwordNew,
          },
          (response) => {
            this.sending = false;
            if (response.data && response.data.status && response.data.status === true) {
              this.$emit('profileRefresh');
              this.success = true;
            } else if (response.errors) {
              (response.errors).forEach((error) => {
                const message = (error.error.message) ? error.error.message : error.error.type;

                if (message === 'InvalidPasswordError') (this.errors).push(this.$t('errorInvalidPassword'));
                else {
                  this.errors.push(this.$t('errorUnknown'));
                }
              });
            }
          },
        );
      } else {
        this.errors.push(this.$t('errorAllFieldRequired'));
      }
    },
  },
};
</script>
