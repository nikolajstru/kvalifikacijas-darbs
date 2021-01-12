<template>
    <div>
        <email-input v-model="user.email"
                     :data="{
                        id: 'userEmail',
                        label: `*${$t('userEmail')}`,
                        inputMode: 'email',
                        customClass: `${fieldClass}`,
                    }"
        />
        <password-input v-model="user.password"
                        :data="{
                            id: 'userPassword',
                            label: `*${$t('userPassword')}`,
                            customClass: `${fieldClass}`,
                        }"
        />
        <div class="row">
            <div class="col-5 pr-2">
                <text-input v-model="user.name"
                             :data="{
                                id: 'userFirstName',
                                label: $t('userFirstName'),
                                customClass: `${fieldClass}`,
                             }"
                />
            </div>
            <div class="col pl-2">
                <text-input v-model="user.surname"
                            :data="{
                                id: 'userLastName',
                                label: $t('userLastName'),
                                customClass: `${fieldClass}`,
                             }"
                />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4 col-12 pr-sm-1">
                <select-input v-model="user.gender"
                              id="userGender"
                              :label="$t('userGender')"
                              :customClass="fieldClass"
                              :options="genders"
                />
            </div>
            <div class="col">
                <custom-date-picker v-model="user.birthday"
                                    :customClass="fieldClass"
                                    :label="$t('userBirthday')"
                />
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4 col-5 pr-1">
                <country-code-select v-model="user.countryCode"
                                     :customClass="fieldClass"
                />
            </div>
            <div class="col">
                <phone-number-input v-model="user.phoneNumber"
                                    id="userPhone"
                                    :label="$t('userPhone')"
                                    customClass="border-light bg-porcelain"
                />
            </div>
        </div>
        <checkbox v-model="user.consent"
                  customClass="top"
                  id="userRegistrationConsentContainer"
                  :label="$t('registerConsent')"
        />
        <Errors :errors="errors"/>
        <div class="text-center mt-4">
            <submit-button :loading="loading"
                           :customClass="`${buttonClass}`"
                           :text="$t('registerAction')"
                           @click="doRegister"
            />
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Errors from '../partials/Errors.vue';
import TextInput from '../partials/float-inputs/Text.vue';
import PhoneNumberInput from '../partials/float-inputs/PhoneNumber.vue';
import EmailInput from '../partials/float-inputs/Email.vue';
import PasswordInput from '../partials/float-inputs/Password.vue';
import SelectInput from '../partials/float-inputs/Select.vue';
import SubmitButton from '../partials/SubmitButton.vue';
import createUserDataObject from '../../graphql/user-data/createUserDataObject.graphql';
import CustomDatePicker from '../partials/float-inputs/CustomDatePicker.vue';
import Checkbox from '../partials/float-inputs/Checkbox.vue';
import CountryCodeSelect from '../partials/float-inputs/CountryCodeSelect.vue';

export default {
  data() {
    return {
      errors: [],
      user: {
        email: '',
        password: '',
        name: '',
        surname: '',
        gender: null,
        birthday: {
          year: null,
          month: null,
          day: null,
        },
        countryCode: null,
        phoneNumber: '',
        consent: false,
      },
      loading: null,
      genders: [
        {
          name: this.$t('userGenders.female'),
          value: 'female',
        },
        {
          name: this.$t('userGenders.male'),
          value: 'male',
        },
        {
          name: this.$t('userGenders.hidden'),
          value: 'hidden',
        },
      ],
    };
  },
  props: {
    afterSignUp: Function,
    buttonClass: String,
    fieldClass: String,
  },
  components: {
    EmailInput,
    PasswordInput,
    TextInput,
    SelectInput,
    PhoneNumberInput,
    SubmitButton,
    CustomDatePicker,
    Checkbox,
    CountryCodeSelect,
    Errors,
  },
  methods: {
    async saveUserData() {
      const authToken = window.LoginAPI.getToken();
      const headers = {};
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
      await axios({
        headers,
        url: 'https://api.delfi.lv/user-data/v1/graphql',
        method: 'post',
        data: {
          query: createUserDataObject,
          variables: JSON.stringify({
            objectType: 'profile',
            objectValue: JSON.stringify({
              gender: this.user.gender,
              birthday: {
                year: (this.user.birthday.year) ? this.user.birthday.year : '',
                month: (this.user.birthday.month) ? this.user.birthday.month : '',
                day: (this.user.birthday.day) ? this.user.birthday.day : '',
              },
            }),
          }),
        },
      });
    },
    doRegister() {
      this.errors = [];
      console.log('user', this.user);
      if (this.user.consent === false) {
        window.shakeElement('userRegistrationConsentContainer');
      } else if (!this.user.email.length > 0 || !this.user.password.length > 0) {
        this.errors.push(this.$t('errorFillRequiredFields'));
      } else {
        this.loading = true;
        window.LoginAPI.signUp({
          email: this.user.email,
          displayName: '',
          password: this.user.password,
          phone: JSON.stringify({
            code: `${this.user.countryCode}`,
            number: `${this.user.phoneNumber}`,
          }),
          firstname: this.user.name,
          lastname: this.user.surname,
        }, (response) => {
          if (response.errors) {
            (response.errors).forEach((error) => {
              if (error.error && (error.error.message || error.error.type)) {
                const message = (error.error.message) ? error.error.message : error.error.type;
                if (message === 'InvalidPasswordError') {
                  this.loading = false;
                  this.errors.push(this.$t('errorPasswordTooShort'));
                } else if (message === 'Email not available') {
                  this.loading = false;
                  this.errors.push(`${this.$t('emailAlreadyExists')}. ${this.$t('useLogin')}.`);
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
            nikolajsnikolajsnikolajsnikolajsnikolajsnikolajsnikolajsnikolajsnikolajsnikolajsnikolajsnikolajsniko
          } else if (response.data && response.data.status) {
            // if (this.user.gender !== null || this.user.birthday !== null) {
            //   window.doNotReload = true;
            // }
            window.LoginAPI.loginWithUsernamePassword(
              this.user.email,
              this.user.password,
              (loginResponse) => {
                if (!loginResponse.data.status) {
                  this.loading = false;
                  this.errors.push(this.$t('errorUnknown'));
                } else if (loginResponse.data.status === true) {
                  if (
                    this.user.gender !== null
                    || this.user.birthday.year !== null
                    || this.user.birthday.month !== null
                    || this.user.birthday.day !== null
                  ) {
                    this.saveUserData().then(() => {
                      this.loading = false;
                      this.afterSignUp();
                    });
                  } else {
                    this.loading = false;
                    this.afterSignUp();
                  }
                }
              },
            );
          }
        });
      }
    },
  },
};
</script>
