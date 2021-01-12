<template>
    <div class="d-flex">
        <div class="btn-group btn-pill bg-porcelain px-0
         ml-auto subscription-duration-switch-button">
            <button v-for="option in options"
                   :key="option.value"
                   class="btn btn-sm btn-pill font-weight-bold"
                   :class="{'btn-primary': selected === option.value}"
                    @click="choose(option.value)"
            >
                {{option.label}}
            </button>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    value: [String, Number],
  },
  data() {
    return {
      options: [
        {
          label: this.$t('subscriptionDuration.1y'),
          value: '1y',
        },
        {
          label: this.$t('subscriptionDuration.28d'),
          value: '28d',
        },
      ],
    };
  },
  methods: {
    choose(value) {
      this.$store.dispatch('changeSubscriptionDuration', { value });
    },
  },
  computed: {
    selected() {
      return this.$store.getters.subscriptionDuration;
    },
  },
};
</script>

<style lang="scss" scoped>
    .subscription-duration-switch-button  button{
        outline: none!important;
        box-shadow: none!important;
    }
</style>
