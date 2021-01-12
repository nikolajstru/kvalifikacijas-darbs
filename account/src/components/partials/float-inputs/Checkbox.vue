<template>
    <label :id="id"
           class="custom-checkbox-container"
           :class="customClass"
    >
        <input v-model="checked"
               @change="change"
               class="form-check-input"
               :class="margin"
               autocomplete="off"
               type="checkbox">
        <span class="checkmark"></span>
        {{label}}
        <slot></slot>
    </label>
</template>

<script>
export default {
  props: {
    value: Boolean,
    type: String,
    placeholder: String,
    name: String,
    label: String,
    id: String,
    inputMode: String,
    pattern: String,
    customClass: String,
    options: Array,
  },
  data() {
    return {
      checked: false,
    };
  },
  created() {
    if (this.value) {
      this.checked = this.value;
    }
  },
  methods: {
    change() {
      this.$emit('input', this.checked);
    },
  },
  computed: {
    margin() {
      let margin = 'my-auto';
      if (this.type === 'top') {
        margin = 'mb-auto';
      } else if (this.type === 'bottom') {
        margin = 'mt-auto';
      }
      return margin;
    },
  },
};
</script>
