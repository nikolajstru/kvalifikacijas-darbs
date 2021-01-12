<template>
    <div class="container pb-5 pt-3">
        <div class="row">
            <div class="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                <div class="card p-4">
                    <LoginForm :afterSignIn="afterConnect"
                               :afterSignUp="afterConnect"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LoginForm from '../auth/Form.vue';

export default {
  data() {
    return {
      errors: [],
    };
  },
  components: {
    LoginForm,
  },
  methods: {
    afterConnect() {
      if (this.$route.query['payment-block']) {
        this.$router.push({ name: 'subscription', query: this.$route.query });
      } else {
        window.location.reload();
      }
    },
  },
};
</script>
