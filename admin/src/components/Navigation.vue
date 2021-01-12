<template>
    <div>
        <Sidebar
            :sidebarIsOpened="sidebarIsOpened"
            @toogleSidebar="sidebarIsOpened = $event"
        ></Sidebar>
        <Header
            :sidebarIsOpened="sidebarIsOpened"
            :user="user"
            @toogleSidebar="sidebarIsOpened = $event"
        ></Header>
    </div>
</template>

<script>
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';

export default {
  name: 'Navigation',
  props: {
    user: Object,
  },
  components: {
    Sidebar,
    Header,
  },
  data() {
    return {
      sidebarIsOpened: false,
    };
  },
};
</script>
