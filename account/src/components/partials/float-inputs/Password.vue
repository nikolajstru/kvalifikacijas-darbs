<template>
    <InputDefault v-bind="data"
                  :value="value"
                  @input="setValue"
                  type="password"/>
</template>

<script>
import InputDefault from './Default.vue';

export default {
  components: {
    InputDefault,
  },
  props: {
    data: Object,
    value: [String, Number],
  },
  methods: {
    setValue(value) {
      this.$emit('input', value);
    },
  },
};
</script>
