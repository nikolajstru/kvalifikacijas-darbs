<template>
    <div class="form-label-group">
        <input :id="id"
               class="form-control"
               :class="customClass"
               :placeholder="label"
               :type="type"
               :inputmode="inputMode"
               :pattern="pattern"
               :value="value"
               @input="$emit('input', $event.target.value)"
        >
        <label :for="id">
            {{label}}
        </label>
    </div>
</template>

<script>
export default {
  props: {
    value: [String, Number],
    type: String,
    placeholder: String,
    name: String,
    label: String,
    id: String,
    inputMode: String,
    pattern: String,
    customClass: String,
  },
};
</script>
