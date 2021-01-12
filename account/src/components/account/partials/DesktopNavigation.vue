<template>
    <div class="mb-4 position-relative d-none d-md-block h-100">
        <div id="nav" class="d-block w-100"
             :class="{'fixed-top':navFixed}">
            <nav class="main-account-nav">
                <div v-for="(item, index) in navigation" :key=index>
                    <router-link
                            tag="a"
                            :to="{name: `${item.route}`}"
                            class="d-block nav-item text-mine-shaft py-2 pl-3"
                            :class="{'router-link-exact-active':
                             $route.matched[1].name === `${index}`}">
                        {{$t(`accountNavigation.${index}`)}}
                    </router-link>
                    <div v-if="index === 'notifications' && unreadCount > 0">
                        <span class="user-notifications-count">{{unreadCount}}</span>
                    </div>
                    <div v-if="$route.matched[1].name === `${index}`
                    && Object.keys(item.sub).length > 0"
                         class="ml-md-3 main-account-nav-sub">
                        <div v-if="item.subType === 'link'">
                            <router-link
                                    v-for="(ite, ind) in item.sub" :key="ind"
                                    tag="a"
                                    :to="{name: `${ite.route}`}"
                                    class="d-block text-mine-shaft text-size-3 my-2 pl-md-2"
                            >
                                {{$t(`accountNavigation.${ind}`)}}
                            </router-link>
                        </div>
                        <div v-else>
                            <span v-for="(ite, ind) in item.sub"
                               :key="ind"
                               :href="`#${ind}`"
                               @click="scrollTo(ind)"
                               class="d-block text-mine-shaft text-size-3 my-2 pl-md-2">
                                {{$t(`accountNavigation.${ind}`)}}
                            </span>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  data() {
    return {
      navFixed: false,
      navigation: {
        profile: {
          route: 'basicInfo',
          subType: 'link',
          sub: {
            basicInfo: {
              route: 'basicInfo',
            },
            contactInfo: {
              route: 'contactInfo',
            },
            passwordChange: {
              route: 'passwordChange',
            },
          },
        },
        notifications: {
          route: 'notifications',
          subType: 'link',
          sub: {},
        },
      },
    };
  },
  props: {
    unreadCount: Number,
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  mounted() {
    window.document.onscroll = () => {
      const offset = 70;
      const nav = document.getElementById('nav');
      const navContainer = nav.parentElement;
      if (navContainer.getBoundingClientRect().top <= offset) {
        this.navFixed = true;
        nav.style.left = `${navContainer.getBoundingClientRect().left}px`;
        nav.style.maxWidth = `${navContainer.offsetWidth}px`;
        nav.style.top = '70px';
      } else {
        this.navFixed = false;
        nav.style.left = '0';
        nav.style.top = '0';
      }
    };
  },
  methods: {
    scrollTo(item) {
      const offset = 100;
      const el = document.getElementById(item);
      const rect = el.getBoundingClientRect();
      const win = el.ownerDocument.defaultView;
      window.scrollTo(0, (rect.top + win.pageYOffset) - offset);
    },
  },
};
</script>

<style lang="scss" scoped>
    @media (min-width: 768px){
        .main-account-nav{
            a, span{
                border-left: 2px solid transparent;
                border-bottom: none!important;


                &.router-link-exact-active{
                    border-left-color:#0372dd;
                    border-bottom: none!important;
                }
                &:hover{
                    font-weight: 500;
                    cursor: pointer;
                }
            }
        }
        .main-account-nav-sub{
            a, span{
                border-left: none!important;
                border-bottom: none!important;
                &.router-link-exact-active{
                    border-left: none!important;
                    border-bottom: none!important;
                    font-weight: bold;
                }
                &:hover{
                    font-weight: 500;
                }
            }
        }
    }
    .main-account-nav{
        a, span{
            border-bottom: 2px solid #dee2e6;

            &.router-link-exact-active{
                border-bottom: 2px solid #0372dd;
            }
            &:hover{
                cursor: pointer;
                font-weight: 500;
            }
        }
    }
</style>
