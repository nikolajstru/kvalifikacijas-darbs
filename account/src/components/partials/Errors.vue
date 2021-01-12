<template>
    <ul v-if="errors.length" class="border-danger border-top mb-4 pt-2">
        <li class="small text-danger" v-for="(error, key) in errors" v-bind:key="key">
            {{ error }}
        </li>
    </ul>
</template>

<script>
export default {
  props: {
    errors: {},
  },
};
</script>
