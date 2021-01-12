<template>
    <div class="form-label-group-select"
         :class="{'chosen': value !== '' && value != null}">
        <label :for="id">{{label}}</label>
        <select class="form-control"
                :class="customClass"
                :id="id"
                :value="value"
                @input="$emit('input', $event.target.value)">
            <option value=""></option>
            <option v-for="(option, index) in options"
                    :value="option.value"
                    :key="index"
            >
                {{option.name}}
            </option>
        </select>
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
    options: Array,
  },
};
</script>
