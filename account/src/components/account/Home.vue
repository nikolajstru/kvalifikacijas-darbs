<template>
    <div>
      <loading v-if="subscriptionLoading"/>
      <div v-else>
        <nav class="container py-3 d-block d-md-none">
          <router-link tag="span"
                       class="breadcrumb-item text-size-12"
                       :to="{name: 'home'}"
          >
            {{$t('accountNavigation.home')}}
          </router-link>
          <router-link tag="span"
                       class="breadcrumb-item text-size-12"
                       :to="{name: 'faq'}"
          >
            {{$t('accountNavigation.faq')}}
          </router-link>
          <router-link tag="span"
                       class="breadcrumb-item text-size-12"
                       :to="{name: 'contacts'}"
          >
            {{$t('accountNavigation.contacts')}}
          </router-link>
        </nav>
        <div class="container">
          <h4>
            {{$t('yourSubscriptions')}}
          </h4>
        </div>
        <div>
          <subscription-duration-button/>
        </div>
        <subscription-cards @subscriptionRefresh="$emit('subscriptionRefresh')"/>
        <div class="border my-2">
          <iframe
            :src="thanksIframe"
            frameborder="0"
            class="w-100"></iframe>
        </div>
        <SmallBlock/>
        <InterestingHeadlines product="DELFIPLUS"/>
      </div>

    </div>
</template>

<script>
/* eslint-disable no-console */
import Loading from '@/components/account/partials/Loading.vue';
import InterestingHeadlines from './partials/InterestingHeadlines.vue';
import SmallBlock from './bookmarks/SmallBlock.vue';
import SubscriptionDurationButton from '../partials/SubscriptionDurationButton.vue';
import SubscriptionCards from './partials/SubscriptionCards.vue';

export default {
  components: {
    InterestingHeadlines,
    SmallBlock,
    SubscriptionDurationButton,
    SubscriptionCards,
    Loading,
  },
  computed: {
    thanksIframe() {
      return window.innerWidth > 742
        ? this.$t('contentBannerLink.desktop')
        : this.$t('contentBannerLink.mobile');
    },
    subscriptionLoading() {
      return this.$store.getters.subscriptionLoading;
    },
  },
};
</script>
