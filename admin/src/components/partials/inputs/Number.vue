<template>
    <InputDefault v-bind="inputData"
                  inputType="number" />
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
