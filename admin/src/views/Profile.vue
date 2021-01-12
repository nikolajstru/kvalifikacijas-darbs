<template>
    <div id="profile">
        <h1>
            Profile
        </h1>
        <h2>
            Welcome, {{this.user.displayName}}
        </h2>
        <h3>
            User ID: {{this.user.id}}
        </h3>
    </div>
</template>

<script>
export default {
  name: 'Profile',
  props: {
    user: Object,
  },
  data() {
    return {
      username: null,
      errors: null,
      logoutOptions: {
        link: '',
        action: this.doLogout,
        name: 'logout',
      },
    };
  },
  mounted() {
    console.log(this.user);
  },
};
</script>

<style scoped>

</style>
