<template>
    <button class="btn btn-pill"
            :class="customClass"
            type="submit"
            @click="$emit('click')"
            :disabled="loading"
    >
        <span  v-if="loading">
            <span class="spinner-border spinner-border-sm"
                  role="status" aria-hidden="true"></span>
            {{$t('buttonLoading')}}...
        </span>
        <span v-else>
            {{ text }}
        </span>
    </button>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    text: String,
    customClass: String,
  },
};
</script>
