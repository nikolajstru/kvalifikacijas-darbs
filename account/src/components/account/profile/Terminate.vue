<template>
    <div class="d-inline">
        <button
            class="btn btn-outline-primary btn-sm btn-pill font-weight-light
             text-size-14 px-3 mx-3 mt-3"
            v-on:click="showTerminationPopup">
            {{ $t('terminateAccount')}}
        </button>
        <b-modal id="reask-termination"
                 hide-header
                 hide-footer
                 centered
                 body-class="p-md-0 position-relative">
            <div class="position-absolute w-100 z-index-1 p-2" style="left:0;top:0">
                <button type="button"
                        class="bs-modal-close"
                        @click="$bvModal.hide('reask-termination')">
                    <i class="icon-cross-thin"></i>
                </button>
            </div>
            <div class="px-3 py-5 pb-4">
                <div v-if="!terminationConfirmed">
                    <h4 class="text-center pt-4">
                        {{$t('doYouWantTerminate')}}
                    </h4>
                    <div class="d-flex justify-content-center mt-5">
                        <button
                                class="btn btn-outline-primary btn-sm
                             btn-pill font-weight-light text-size-14 px-3 mx-2"
                                v-on:click="doTerminateAccount">
                            <span v-if="waiting" class="spinner-border spinner-border-sm"
                                  role="status" aria-hidden="true"></span>
                            {{ $t('terminateAccount')}}
                        </button>
                        <button
                                class="btn btn-primary btn-sm btn-pill
                             font-weight-light text-size-14 px-3 mx-2"
                                v-on:click="$bvModal.hide('reask-termination')">
                            {{ $t('back')}}
                        </button>
                    </div>
                </div>
                <div v-else>
                    <h4 class="text-center pt-4">
                        {{responseText}}
                    </h4>
                    <div class="d-flex justify-content-center flex-row pt-3">
                        <button type="button"
                                class="btn btn-pill d-flex mx-2 btn-primary text-white"
                                data-dismiss="modal"
                                aria-label="Close"
                                v-on:click="$bvModal.hide('reask-termination')">
                            {{$t('btnOk')}}
                        </button>
                    </div>
                </div>
            </div>
        </b-modal>
        <b-modal id="unsubscribe-before-termination"
                 hide-header
                 hide-footer
                 centered
                 body-class="p-md-0 position-relative">
            <div class="position-absolute w-100 z-index-1 p-2" style="left:0;top:0">
                <button type="button"
                        class="bs-modal-close"
                        @click="$bvModal.hide('unsubscribe-before-termination')">
                    <i class="icon-cross-thin"></i>
                </button>
            </div>
            <div class="px-3 pt-5 pb-4">
                <h4 class="text-center pt-4">
                    {{$t('unsubscribeBeforeDelete.text')}}
                </h4>
            </div>

            <div class="d-flex justify-content-center flex-row pb-5">
                <router-link
                        tag="button"
                        :to="{name: 'subscription'}"
                        class="btn btn-pill d-flex btn-primary text-white"
                >
                    {{$t('unsubscribeBeforeDelete.btn')}}
                </router-link>
            </div>
        </b-modal>
        <b-modal id="provideEmail"
                 hide-header
                 hide-footer
                 centered
                 body-class="p-md-0 position-relative">
            <div class="position-absolute w-100 z-index-1 p-2" style="left:0;top:0">
                <button type="button"
                        class="bs-modal-close"
                        @click="$bvModal.hide('provideEmail')">
                    <i class="icon-cross-thin"></i>
                </button>
            </div>
            <div class="px-3 pt-5 pb-4">
                <h4 class="text-center pt-4">
                    {{$t('provideEmailBeforeTerminate')}}
                </h4>
            </div>

            <div class="d-flex justify-content-center flex-row pb-5">
                <router-link
                        tag="button"
                        :to="{name: 'contactInfo'}"
                        class="btn btn-pill d-flex btn-primary text-white"
                >
                    {{$t('unsubscribeBeforeDelete.btn')}}
                </router-link>
            </div>
        </b-modal>
    </div>
</template>


<script>

export default {
  data() {
    return {
      responseText: '',
      showSpinners: false,
      terminationConfirmed: false,
      waiting: false,
    };
  },
  methods: {
    doTerminateAccount() {
      if (
        (
          this.user.subscription.DELFIPLUS.access === true
          && this.user.subscription.DELFIPLUS.recurring
        ) || (
          this.user.subscription.MVP.access === true
          && this.user.subscription.MVP.recurring
        )
      ) {
        this.$bvModal.hide('reask-termination');
        this.$bvModal.show('unsubscribe-before-termination');
      } else if (!this.hasEmail && !this.hasTempEmail) {
        this.$bvModal.hide('reask-termination');
        this.$bvModal.show('provideEmail');
      } else {
        this.waiting = true;
        window.LoginAPI.sendTerminateEmail(
          { language: 'lv' },
          (response) => {
            if (response.data === true) {
              this.terminationConfirmed = true;
              this.waiting = false;
              this.responseText = this.$t('terminateAccountInfo');
            }
          },
        );
      }
    },
    showTerminationPopup() {
      this.$bvModal.show('reask-termination');
    },
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    hasEmail() {
      return this.user.profile.email !== null && this.user.profile.email.length > 0;
    },
    hasTempEmail() {
      return this.user.profile.emailTmp !== null && this.user.profile.emailTmp.length > 0;
    },
  },
};
</script>
