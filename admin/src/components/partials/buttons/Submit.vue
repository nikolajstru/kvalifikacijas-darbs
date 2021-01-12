<template>
    <div :class="'text-'+ ( align || 'center')">
        <button
            class="btn btn-primary btn-pill mt-4
                                       mb-5 text-uppercase font-weight-bold"
            type="submit">
        {{ text }}
    </button>
    </div>
</template>

<script>
export default {
  props: {
    text: String,
    align: String,
  },
};
</script>
