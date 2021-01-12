<template>
    <div>
        <h4 class="pb-3">
            {{$t('myProfile')}}
        </h4>
        <div>
            <div class="">
                <div class="mb-3">
                    <span class="small d-block mb-1 text-secondary">
                        {{$t('user.firstname')}}
                    </span>
                    <span class="d-block font-weight-bold"
                          style="min-height: 21px;">
                        {{user.profile.firstname}}
                    </span>
                </div>
                <div class="mb-3">
                    <span class="small d-block mb-1 text-secondary">
                        {{$t('user.lastname')}}
                    </span>
                    <span class="d-block font-weight-bold"
                          style="min-height: 21px;">
                        {{user.profile.lastname}}
                    </span>
                </div>
                <div class="mb-3">
                    <span class="small d-block mb-1 text-secondary">
                        {{$t('user.displayName')}}
                    </span>
                    <span class="d-block font-weight-bold"
                          style="min-height: 21px;">
                        {{user.profile.displayName}}
                    </span>
                </div>
                <div class="mb-3">
                    <span class="small d-block mb-1 text-secondary">
                        {{$t('user.id')}}
                    </span>
                    <span class="d-block font-weight-bold" style="min-height: 21px;">
                        {{user.profile.id}}
                    </span>
                </div>
            </div>
        </div>
        <div class="">
            <button @click="$router.push({ name: 'basicInfoEdit' })"
                    class="btn btn-primary btn-sm btn-pill font-weight-light
                    text-size-14 px-3 mt-3">
                {{$t('edit')}}
            </button>
            <TerminateAccount :user="user"/>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-console */

import TerminateAccount from './Terminate.vue';


export default {
  data() {
    return {
      fields: [
        'firstname',
        'lastname',
        'displayName',
        'id',
      ],
    };
  },
  components: {
    TerminateAccount,
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>
