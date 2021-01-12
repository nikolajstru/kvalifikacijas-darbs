<template>
    <div>
        <h4 class="pb-3">
            {{$t('myProfile')}}
        </h4>
        <form @submit.prevent="editProfile">
            <div class="row">
                <div class="col-12 col-lg-5">
                    <div>
                        <text-input v-model="firstname"
                                    :data="{
                                    id: 'userFirstname',
                                    label: `*${$t('user.firstname')}`,
                                    inputMode: 'email',
                                    customClass: 'border-light bg-porcelain',
                                }"
                        />
                    </div>
                    <div>
                        <text-input v-model="lastname"
                                    :data="{
                                    id: 'userLastname',
                                    label: `*${$t('user.lastname')}`,
                                    inputMode: 'email',
                                    customClass: 'border-light bg-porcelain',
                                }"
                        />
                    </div>
                    <div>
                        <text-input v-model="displayName"
                                    :data="{
                                    id: 'userDisplayName',
                                    label: `*${$t('user.displayName')}`,
                                    inputMode: 'email',
                                    customClass: 'border-light bg-porcelain',
                                }"
                        />
                    </div>
                </div>
            </div>
            <Errors :errors="errors" />
            <button @click="$router.push({ name: 'basicInfoEdit' })"
                    class="btn btn-primary btn-sm btn-pill font-weight-light text-size-14 px-3 mt-2"
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
import TextInput from '../../partials/float-inputs/Text.vue';
import SelectInput from '../../partials/float-inputs/Select.vue';
import CustomDatePicker from '../../partials/float-inputs/CustomDatePicker.vue';

export default {
  data() {
    return {
      errors: {},
      sending: false,
      status: '',
      userData: null,
      firstname: null,
      lastname: null,
      displayName: null,
    };
  },
  components: {
    Errors,
    TextInput,
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  mounted() {
    this.firstname = this.user.profile.firstname;
    this.lastname = this.user.profile.lastname;
    this.displayName = this.user.profile.displayName;
  },
  methods: {
    editProfile() {
      this.errors = [];
      this.sending = true;
      window.LoginAPI.updateProfile(
        {
          displayName: this.displayName,
          firstname: this.firstname,
          lastname: this.lastname,
        },
        (response) => {
          this.sending = false;
          if (response.data && response.data.status && response.data.status === true) {
            this.$store.dispatch('resetUserProfile');
            this.$router.push({ name: 'basicInfo' });
          } else if (response.errors) {
            (response.errors).forEach((error) => {
              const message = (error.error.message) ? error.error.message : error.error.type;
              (this.errors).push(message);
            });
          }
        },
      );
    },
  },
};
</script>
