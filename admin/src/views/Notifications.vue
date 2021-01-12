<template>
    <div>
        <b-breadcrumb :items="routeredItems"></b-breadcrumb>
        <router-view :user="user"/>
    </div>
</template>

<script>

  export default {
    props: {
      user: Object,
    },
    data() {
      return {
        items: [
          {
            text: 'Stats',
            to: { name: 'notificationStats' }
          },
          {
            text: 'New notification',
            to: { name: 'createNotification' }
          },
          {
            text: 'Templates',
            to: { name: 'notificationTemplates' }
          },
        ]
      };
    },
    computed: {
      routeredItems() {
        const items = [];
        this.items.forEach((item, key) => {
          items.push(item);
          if (this.$route.name === item.to.name) {
            items[key].active = true;
          } else {
            items[key].active = false;
          }
        });
        return items;
      }
    },
  };
</script>
