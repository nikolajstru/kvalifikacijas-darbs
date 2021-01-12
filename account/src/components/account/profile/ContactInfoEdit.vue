<template>
    <div>
        <h4 class="pb-3">
            {{$t('myContacts')}}
        </h4>
        <form @submit.prevent="editProfile">
            <div class="row">
                <div class="col-12 pr-1">
                    <email-input v-model="email"
                                 :data="{
                                    id: 'userEmail',
                                    label: `*${$t('userEmail')}`,
                                    inputMode: 'email',
                                    customClass: 'border-light bg-porcelain',
                                }"
                    />
                </div>
                <div class="col-sm-4 col-5 pr-1">
                    <country-code-select v-model="countryCode"
                                         customClass="border-light bg-porcelain"
                    />
                </div>
                <div class="col">
                    <phone-number-input v-model="phoneNumber"
                                        id="userPhone"
                                        :label="$t('userPhone')"
                                        customClass="border-light bg-porcelain"
                    />
                </div>
            </div>
            <Errors :errors="errors" />
            <button class="btn btn-primary btn-sm btn-pill font-weight-light text-size-14 px-3 mt-2"
                    type="submit"
                    :disabled="sending">
                <span v-if="sending" class="spinner-border spinner-border-sm"
                      role="status" aria-hidden="true"></span>
                {{$t('btnSave')}}
            </button>
        </form>
    </div>
</template>

<script>
import Errors from '../../partials/Errors.vue';
import EmailInput from '../../partials/float-inputs/Email.vue';
import CountryCodeSelect from '../../partials/float-inputs/CountryCodeSelect.vue';
import PhoneNumberInput from '../../partials/float-inputs/PhoneNumber.vue';

export default {
  data() {
    return {
      errors: {},
      sending: false,
      reg: /^\d+$/,
      email: null,
      countryCode: null,
      phoneNumber: null,
    };
  },
  mounted() {
    this.email = this.user.profile.email;
    this.countryCode = this.user.profile.countryCode;
    this.phoneNumber = this.user.profile.phoneNumber;
  },
  components: {
    Errors,
    EmailInput,
    CountryCodeSelect,
    PhoneNumberInput,
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    editProfile() {
      this.errors = [];
      if (!this.reg.test(this.phoneNumber)) {
        this.errors.push(this.$t('errors.onlyNumbersAllowInPhone'));
      } else if (
        this.countryCode
        && this.countryCode.toString().length > 0
        && this.phoneNumber.indexOf(this.countryCode.toString()) === 0
      ) {
        this.errors.push(this.$t('errors.countryCodeAlreadyProvided'));
      } else {
        this.sending = true;
        window.LoginAPI.updateProfile(
          {
            email: this.email,
            phone: JSON.stringify({
              code: `${this.countryCode}`,
              number: `${this.phoneNumber}`,
            }),
          },
          (response) => {
            this.sending = false;
            if (response.data && response.data.status && response.data.status === true) {
              this.$store.dispatch('resetUserProfile');
              this.$router.push({ name: 'contactInfo' });
            } else if (response.errors) {
              (response.errors).forEach((error) => {
                if (error.error && (error.error.message || error.error.type)) {
                  const message = (error.error.message) ? error.error.message : error.error.type;
                  if (message === 'InvalidPasswordError') {
                    this.loading = false;
                    this.errors.push(this.$t('errorPasswordTooShort'));
                  } else if (message === 'Email not available') {
                    this.loading = false;
                    this.errors.push(`${this.$t('emailAlreadyExists')}. ${this.$t('pleaseProvideAnother')}.`);
                  } else if (message === 'InvalidEmailError') {
                    this.loading = false;
                    this.errors.push(this.$t('errorInvalidEmail'));
                  } else {
                    this.loading = false;
                    console.log('updateProfile error', message);
                    this.errors.push(this.$t('errorUnknown'));
                  }
                }
              });
            }
          },
        );
      }
    },
  },
};
</script>
