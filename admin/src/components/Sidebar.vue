<template>
  <nav id="sidebar" :class="{opened: sidebarIsOpened}" @click="closeSidebar">
    <div id="sidebar-scroll">
      <div class="sidebar-content">
        <div class="side-header side-content bg-white-op">
          <a class="h5 text-white" href="/">
            <svg viewBox="0 0 500 137" class="icon icon-logo-d">
              <use xlink:href="#logo-d"></use>
            </svg>
            <svg viewBox="0 0 500 137" class="icon icon-logo sidebar-mini-hide">
              <use xlink:href="#logo"></use>
            </svg>
          </a>
        </div>
        <div class="side-content">
          <ul class="nav-main">
            <li v-for="item in sidebarElements" :key="item.name">
              <router-link tag="a"
                           :to="{name: item.name}">
                <i :class="`icon-${item.icon}`"></i>
                <span class="sidebar-mini-hide">{{item.text}}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
    export default {
        name: 'Sidebar',
        props: {
            sidebarIsOpened: Boolean,
        },
        methods: {
            closeSidebar() {
                this.$emit('toogleSidebar', false);
            },
        },
        data() {
            return {
                sidebarElements: [
                    {
                        name: 'notificationStats',
                        icon: 'ui-home',
                        text: 'Dashboard',
                    },
                    {
                        name: 'createNotification',
                        icon: 'ui-pencil',
                        text: 'New notification'
                    },
                    {
                        name: 'notificationTemplates',
                        icon: 'original-content',
                        text: 'Templates'
                    }
                ],
            };
        },
    };
</script>


<style scoped>
  .side-header > span, .side-header > a {
    display: inline-block;
    line-height: 34px;
  }
  #sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1031;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    -webkit-transition: all 0.28s ease-out;
    transition: all 0.28s ease-out;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    text-align: left;
  }

  .side-header.side-content {
    overflow: visible;
  }
  .side-content {
    margin: 0 auto;
    padding: 13px 20px 1px;
    max-width: 100%;
    overflow-x: hidden;
  }
  .side-header {
    margin: 0 auto;
    min-height: 60px;
  }
  .side-header > span, .side-header > a {
    display: inline-block;
    line-height: 34px;
  }
  .side-header .icon-logo-d {
    position: absolute;
  }
  svg:not(:root) {
    overflow: hidden;
  }
  .side-header > span, .side-header > a {
    display: inline-block;
    line-height: 34px;
  }
  .icon-logo-d {
    width: 72px;
    height: 35px;
    fill: #fff;
  }

  nav {
    display: block;
  }
  .side-header:before, .side-header:after {
    content: " ";
    display: table;
  }
  *:before, *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .side-content {
    margin: 0 auto;
    padding: 13px 20px 1px;
    max-width: 100%;
    overflow-x: hidden;
  }
  .bg-white-op {
    background-color: rgba(255, 255, 255, 0.075);
  }
  .icon-logo-d, .icon-logo {
    width: 72px;
    height: 35px;
    fill: #fff;
  }
  .side-header .icon-logo-d {
    position: absolute;
  }
  svg:not(:root) {
    overflow: hidden;
  }
  @media screen and (min-width: 992px) {
    #sidebar {
      -webkit-transform: translateX(-170px) translateY(0) translateZ(0);
      -ms-transform: translateX(-170px) translateY(0);
      transform: translateX(-170px) translateY(0) translateZ(0);
    }
    #sidebar {
      overflow-x: hidden;
      -webkit-transition: all 0.28s ease-out;
      transition: all 0.28s ease-out;
    }
    .side-scroll #sidebar, .side-scroll #side-overlay {
      overflow-y: hidden;
    }

    #sidebar:hover, #sidebar:hover .sidebar-content {
      -webkit-transform: translateX(0) translateY(0) translateZ(0);
      -ms-transform: translateX(0) translateY(0);
      transform: translateX(0) translateY(0) translateZ(0);
    }


    #sidebar .sidebar-content {
      -webkit-transform: translateX(170px) translateY(0) translateZ(0);
      -ms-transform: translateX(170px) translateY(0);
      transform: translateX(170px) translateY(0) translateZ(0);

      width: 230px;
      -webkit-transition: all 0.28s ease-out;
      transition: all 0.28s ease-out;
    }
    #sidebar .sidebar-mini-hide {
      opacity: 0;
      -webkit-transition: opacity 0.28s ease-out;
      transition: opacity 0.28s ease-out;
    }
    #sidebar:hover .sidebar-mini-hide {
      opacity: 1;
    }
  }
  @media screen and (max-width: 991px) {
    #sidebar.opened {
      opacity: 1;
      -webkit-transform: translateX(0) translateY(0) translateZ(0);
      -ms-transform: translateX(0) translateY(0);
      transform: translateX(0) translateY(0) translateZ(0);
    }
    #sidebar {
      width: 100%;
      opacity: 0;
      left: 0;
      -webkit-transform: translateX(-100%) translateY(0) translateZ(0);
      -ms-transform: translateX(-100%) translateY(0);
      transform: translateX(-100%) translateY(0) translateZ(0);
    }
  }
  .side-header > span, .side-header > a {
    display: inline-block;
    line-height: 34px;
  }
  .nav-main {
    margin: 0 -20px;
    padding: 0;
    list-style: none;
  }
  ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
  }
  .nav-main {
    margin: 0 -20px;
    padding: 0;
    list-style: none;
  }
  .nav-main a.active, .nav-main a.active:hover, .nav-main a.router-link-active > i, .nav-main a.router-link-active {
    color: #fff;
  }
  .nav-main a {
    display: block;
    padding: 10px 35px 10px 20px;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
  }
  .nav-main .nav-main-heading {
    padding: 22px 35px 6px 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.3);
  }
  .nav-main a > i {
    margin-right: 15px;
    color: rgba(255, 255, 255, 0.2);
  }
  .nav-main a:hover > i, .nav-main a:focus > i {
    color: #fff;
  }

  #sidebar {
    width: 230px;
    background-color: #343a40;
  }

  @media screen and (max-width: 991px){
    #sidebar {
      width: 100%;
    }
  }
  .nav-main a:hover, .nav-main a:focus {
    color: rgba(255, 255, 255, 0.5);
    background-color: rgba(0, 0, 0, 0.2);
  }

  .nav-main .nav-main-heading {
    padding: 22px 35px 6px 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.3);
  }
  .nav-main {
    margin: 0 -20px;
    padding: 0;
    list-style: none;
    list-style-position: initial;
    list-style-image: initial;
    list-style-type: none;
  }
</style>
