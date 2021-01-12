<template :id="id">
  <transition name="modal-fade">
    <div v-if="!hidden" class="dmodal" @click.self="backdropClick">
      <div class="dmodal-dialog dmodal-dialog-centered"
           :class="[modalClass, modalSize]">
        <div class="dmodal-content">
          <button @click="hide()" class="bs-modal-close">
            <i class="icon-cross-thin"></i>
          </button>
          <div class="dmodal-body">
            <slot name="body"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    id: String,
    modalClass: String,
    size: String,
    noCloseOnBackdrop: Boolean,
  },
  data() {
    return {
      hidden: true,
    };
  },
  created() {
    this.$root.$on('d::modal::hide', (id) => {
      if (id === this.id) {
        this.hidden = true;
        document.querySelector('body').classList.remove('modal-open');
      }
    });
    this.$root.$on('d::modal::show', (id) => {
      if (id === this.id) {
        this.hidden = false;
        document.querySelector('body').classList.add('modal-open');
      }
    });
  },
  computed: {
    modalSize() {
      return this.size === 'lg' || this.size === 'xl' ? `dmodal-${this.size}` : '';
    },
  },
  methods: {
    backdropClick() {
      if (!this.noCloseOnBackdrop) {
        this.$root.$emit('d::modal::hide', this.id);
      }
    },
    hide() {
      this.$root.$emit('d::modal::hide', this.id);
    },
  },
};
</script>

<style scoped lang="scss">
  .dmodal {
    position: fixed;
    z-index: 100001;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);

    display: block;
    align-items: center;
    min-height: calc(100% - 1rem);

    &-dialog {
      transform: none;
      max-width: 500px;
      margin: .5rem;
      position: relative;
      width: auto;
      pointer-events: none;
    }
    &-dialog-centered {
      display: flex;
      align-items: center;
      min-height: calc(100% - 1rem);
    }
    &-content {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      pointer-events: auto;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid rgba(0,0,0,.2);
      border-radius: .3rem;
      outline: 0;
      padding-top: 1rem;
    }
    &-body {
      position: relative;
      flex: 1 1 auto;
      padding: 1rem;
    }
    &-close {
      top: 0;
      right: 0;
      z-index: 1;
      outline: none !important;
      cursor: pointer;
      font-size: 16px !important;
      line-height: 18px !important;
      position: absolute;
      padding: 1rem;
      display: inline-block;
      font-weight: 400;
      color: #212529;
      text-align: center;
      vertical-align: middle;
      user-select: none;
      background-color: transparent;
      border: 1px solid transparent;
    }
  }
  .modal-fade-enter-active, .modal-fade-leave-active {
    transition: opacity .1s;
  }
  .modal-fade-enter, .modal-fade-leave-to {
    opacity: 0;
  }
  .modal-open {
    overflow: hidden;
    .dmodal {
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  @media(min-width: 576px) {
    .dmodal {
      &-dialog {
        max-width:500px;
        margin: 1.75rem auto;
      }
      &-dialog-centered {
        min-height: calc(100% - 3.5rem);
      }
      &-dialog-centered:before {
        height: calc(100vh - 3.5rem)
      }
      &-sm {
        max-width: 300px
      }
    }
  }
  @media(min-width: 992px) {
    .dmodal-lg,.dmodal-xl {
      max-width:800px
    }
  }

  @media(min-width: 1200px) {
    .dmodal-xl {
      max-width:1140px
    }
  }

</style>
