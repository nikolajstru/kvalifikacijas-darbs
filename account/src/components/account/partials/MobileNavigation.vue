<template>
    <div>
        <div class="d-block d-md-none p-0">
            <nav class="main-account-nav navbar flex-row text-center p-0 bg-porcelain">
                <router-link
                        tag="a"
                        :to="{name:'basicInfo'}"
                        class="nav-link text-mine-shaft cursor-pointer
                        text-uppercase py-3 col mx-md-5 text-size-3"
                        :class="{'router-link-exact-active': profileSubNavSelected}">
                    <i class="icon-profile text-size-19"></i>
                </router-link>
                <router-link
                        tag="a"
                        :to="{name:'notifications'}"
                        class="nav-link text-mine-shaft cursor-pointer
                        text-uppercase py-3 col mx-md-5 text-size-3">
                    <i class="icon-bell text-size-19"></i>
                    <div v-if="unreadCount > 0">
                        <span class="user-notifications-count">{{unreadCount}}</span>
                    </div>
                </router-link>
            </nav>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  data() {
    return {
      errors: [],
      homeSubNavSelected: false,
      profileSubNavSelected: false,
      subscriptionSubNavSelected: false,
    };
  },
  props: {
    unreadCount: Number,
  },
  watch: {
    $route() {
      this.checkParentRoute();
    },
  },
  created() {
    this.checkParentRoute();
  },
  methods: {
    checkParentRoute() {
      this.homeSubNavSelected = (
        this.$route.name === 'faq'
        || this.$route.name === 'contacts'
      );
      this.profileSubNavSelected = (
        this.$route.name === 'contactInfo'
        || this.$route.name === 'basicInfo'
        || this.$route.name === 'basicInfoEdit'
        || this.$route.name === 'contactInfo'
        || this.$route.name === 'contactInfoEdit'
        || this.$route.name === 'passwordChange'
      );
      this.subscriptionSubNavSelected = (
        this.$route.name === 'mvpSubscription'
        || this.$route.name === 'delfiPlusSubscription'
      );
    },
  },
};
</script>

<style lang="scss">
    @media (min-width: 768px){
        .main-account-nav{
            a{
                border-left: 2px solid transparent;
                border-bottom: none!important;


                &.router-link-exact-active{
                    border-left-color:#0372dd;
                    border-bottom: none!important;
                }
                &:hover{
                    font-weight: 500;
                }
            }
        }
    }
    .main-account-nav{
        a{
            border-bottom: none;

            &.router-link-exact-active{
                border-bottom: 2px solid #0372dd;
            }
            &:hover{
                font-weight: 500;
            }
        }
    }
    .breadcrumb-item {
        font-weight: lighter;

        &.router-link-exact-active{
            font-weight: bold;
        }
        &.router-link-exact-active:before{
            font-weight: lighter;
        }
    }
</style>
