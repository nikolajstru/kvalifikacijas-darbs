<template>
    <div>
        <h4 class="pb-3">
            {{$t('myContacts')}}
        </h4>
        <VerifyEmail :user="user"/>
        <div>
            <div class="mb-3">
                <span class="small d-block mb-1 text-secondary">
                    {{$t(`user.email`)}}
                </span>
                <span class="d-block font-weight-bold"
                      style="min-height: 21px;">
                        {{user.profile.email}}
                </span>
            </div>
            <div class="mb-3">
                <span class="small d-block mb-1 text-secondary">
                    {{$t(`user.phoneNumber`)}}
                </span>
                <div class="font-weight-bold">
                    <span v-if="
                        user.profile.countryCode
                        && user.profile.countryCode.toString().length > 0
                    ">
                        +{{user.profile.countryCode}}
                    </span>
                    <span class="d-inline-block" style="min-height: 21px;">
                        {{user.profile.phoneNumber}}
                    </span>
                </div>
            </div>
        </div>
        <button @click="$router.push({ name: 'contactInfoEdit' })"
                class="btn btn-primary btn-sm btn-pill font-weight-light text-size-14 px-3 mr-3">
            {{$t('edit')}}
        </button>
    </div>
</template>

<script>
import VerifyEmail from './VerifyEmail.vue';

export default {
  data() {
    return {
      fields: [
        'email',
        'phoneNumber',
      ],
    };
  },
  components: {
    VerifyEmail,
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>
