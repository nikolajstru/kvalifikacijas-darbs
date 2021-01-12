<template>
    <InputDefault v-bind="inputData"
                  inputType="email" />
</template>

<script>
import InputDefault from './Default.vue';

export default {
  components: {
    InputDefault,
  },
  props: {
    inputData: Object,
  },
};
</script>
