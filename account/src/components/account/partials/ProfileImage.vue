<template>
    <div>
        <section class="font-weight-bold text-size-17 text-center py-4 bg-white bg-md-porcelain">
            <div class="container bg-white bg-md-porcelain">
                <div class="row">
                    <div class="col-12 col-md-3 offset-md-2">
                        <div style="width: 150px; height: 150px;" class="mx-auto float-md-right">
                            <Avatar @profileRefresh="$emit('profileRefresh')"
                                    :user="user"></Avatar>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 text-center text-md-left mt-3 mt-md-4">
                        {{dayTime}},
                        <span>
                            {{(fullName.length > 1)? `${fullName}!` : `${$t('reader')}!`}}
                        </span>
                        <div class="mt-3">
                            <Logout :options="{
    customClass: 'btn btn-outline-primary btn-sm btn-pill font-weight-light text-size-14'
                            }"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
/* eslint-disable no-console */

import Logout from '../profile/Logout.vue';
import Avatar from '../profile/Avatar.vue';

export default {
  data() {
    return {
      errors: [],
    };
  },
  components: {
    Logout,
    Avatar,
  },
  computed: {
    dayTime() {
      const hoursNow = (new Date()).getHours();
      let dayTime;
      if (hoursNow >= 12 && hoursNow <= 18) {
        dayTime = 'Day';
      } else if (hoursNow >= 18 && hoursNow <= 0) {
        dayTime = 'Evening';
      } else {
        dayTime = 'Morning';
      }
      return this.$t(`hello${dayTime}`);
    },
    fullName() {
      return `${this.user.profile.firstname} ${this.user.profile.lastname}`;
    },
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>
