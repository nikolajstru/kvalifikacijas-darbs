<template>
    <div>
        <div v-if="userLoaded" id="login-api-account">
            <div :class="{'d-none d-md-block':hideProfileImageSm}">
                <ProfileImage @profileRefresh="profileRefresh" :user="user"/>
            </div>
            <MobileNavigation :unreadCount="unreadCount"/>
            <div class="container pb-md-5 pt-md-3">
                <div class="row my-md-5">
                    <div class="col-md-3">
                        <DesktopNavigation :unreadCount="unreadCount"/>
                    </div>
                    <div class="col-12 col-md-9">
                        <router-view :user="user"
                                     :products="products"
                                     @profileRefresh="profileRefresh"
                                     @updateNotificationCount="updateNotificationCount"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
          <Loading/>
        </div>
        <b-modal id="went-wrong-popup"
                 hide-header
                 hide-footer
                 no-close-on-backdrop
                 no-close-on-esc
                 centered
                 body-class="position-relative p-md-4">
            <div class="row">
                <div class="col-6 mx-auto col-md-3 pb-3 pb-md-0">
                    <img src="https://g.delfi.lv/mvp/svg/broken_delfi.svg"
                         alt="DELFI broken"
                         class="w-100">
                </div>
                <div class="col-12 col-md-9 text-center text-md-left">
                    <h3 class="text-size-21">
                        Atvainojiet!
                        <br>
                        Radusies tehniska kļūme.
                    </h3>
                    <p>
                        Lūdzu, ielādējiet lapu no jauna vai mēģiniet
                        pieslēgties savam DELFI kontam nedaudz vēlāk.
                    </p>
                    <p v-if="userId">
                      Lietotāja ID numurs: {{userId}}
                    </p>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
/* eslint-disable no-console */
import axios from 'axios';
import ProfileImage from './partials/ProfileImage.vue';
import MobileNavigation from './partials/MobileNavigation.vue';
import DesktopNavigation from './partials/DesktopNavigation.vue';
// import checkSubscription from '../../graphql/checkSubscription.graphql';
// import getPrice from '../../graphql/getPrice.graphql';
import getWebNotifications from '../../graphql/getWebNotifications.graphql';
import Loading from './partials/Loading.vue';

export default {
  mounted() {
    this.loadAccountInfo();
    window.profileRefresh = this.profileRefresh;
  },
  props: {
    loginApiToken: String,
    products: Object,
  },
  data() {
    return {
      errors: [],
      hideProfileImageSm: true,
      user: {},
      userLoaded: false,
      unreadCount: 0,
    };
  },
  components: {
    ProfileImage,
    MobileNavigation,
    DesktopNavigation,
    Loading,
  },
  computed: {
    userId() {
      const user = localStorage.getItem('USER') ? JSON.parse(localStorage.getItem('USER')) : '';
      return user ? user.id : null;
    },
  },
  watch: {
    $route() {
      this.checkProfileImageVisability();
    },
  },
  methods: {
    async loadAccountInfo() {
      this.userLoaded = false;
      this.$store.dispatch('setProfile');
      this.user = this.$store.getters.user;
      this.userLoaded = true;
      this.checkProfileImageVisability();
      await this.getNotificationsCount();
    },
    updateNotificationCount() {
      this.unreadCount = this.unreadCount - 1;
      window.updateNotificationCount();
    },
    checkProfileImageVisability() {
      this.hideProfileImageSm = this.$route.name !== 'home';
    },
    async profileRefresh() {
      this.userLoaded = false;
      await this.$store.dispatch('resetUserProfile');
      this.userLoaded = true;
      // window.LoginAPI.getUserProfile((data) => {
      //   if (data && data.data) {
      //     localStorage.setItem('USER', JSON.stringify(data.data));
      //     // eslint-disable-next-line
      //     const phone = data.data.phone;
      //     let phoneNumber = phone;
      //     let countryCode = null;
      //     if (phone && JSON.parse(phone).toString() !== phone) {
      //       phoneNumber = JSON.parse(phone).number;
      //       countryCode = JSON.parse(phone).code;
      //     }
      //     this.user.profile = data.data;
      //     this.user.profile.phoneNumber = phoneNumber;
      //     this.user.profile.countryCode = countryCode;
      //
      //     // window.user.profile = this.user.profile;
      //
      //     this.userLoaded = false;
      //     this.$nextTick(() => {
      //       this.userLoaded = true;
      //     });
      //     window.loadUserInfo();
      //   }
      // });
    },
    async subscriptionRefresh() {
      await this.$store.dispatch('setSubscriptionLoading', true);
      await this.$store.dispatch('setSubscription');
      await this.$store.dispatch('getUserBundleData');
      this.user = this.$store.getters.user;
      await this.$store.dispatch('setSubscriptionLoading', false);
    },
    async getNotificationsCount() {
      const headers = {};
      if (this.user.loginApiToken) {
        headers.Authorization = `Bearer ${this.user.loginApiToken}`;
      }
      await axios({
        headers,
        url: 'https://api.delfi.lv/notifications/v1/graphql',
        method: 'post',
        data: {
          query: getWebNotifications,
          variables: JSON.stringify({
            status: 'not_seen',
          }),
        },
      })
        .then(
          (response) => {
            this.unreadCount = response.data.data.getWebNotifications.pager.count;
          },
          (error) => {
            console.log('getNotificationsCount error', error);
          },
        );
    },
  },
};
</script>
