<template>
    <div class="form-group mb-4">
        <input :name="name"
               :ref="name"
               :class="styleClass + ' form-control border-light bg-porcelain'"
               :placeholder="(required ? '*' : '') + placeholder"
               :id="id"
               :type="inputType || 'text'"
               :required="!!required"
        >
    </div>
</template>

<script>
export default {

  props: {
    id: {
      validator(value) {
        return !!value;
      },
    },
    styleClass: String,
    inputType: String,
    name: String,
    placeholder: String,
    required: [Boolean, String, Number],
  },
};
</script>
