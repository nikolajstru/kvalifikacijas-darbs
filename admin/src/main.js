export const mainMixin = {
  methods: {
    switchLiveUrlsToNeo(urlToSwitch) {
      let url = urlToSwitch;
      if (window.location.origin.search('neo') > -1 || window.location.origin.search('ekspresskonto') > -1) {
        url = urlToSwitch.replace('http://', '//');
        url = url.replace('https://', '//');
        url = url.replace('//g.delfi.lv', '//g.neo.delfi.lv');
        url = url.replace('//www.delfi.lv', '//neo.delfi.lv');
        url = url.replace('//rus.delfi.lv', '//rus.neo.delfi.lv');
      }
      return url;
    },
    shakeElement(id) {
      const el = document.getElementById(id);
      el.classList.add('shake-an-element');
      setTimeout(() => {
        el.classList.remove('shake-an-element');
      }, 500);
    },
    checkValidation() {
      let valid = true;
      document.querySelectorAll('.validate-input').forEach((item) => {
        if (!item.checkValidity()) {
          valid = false;
          item.reportValidity();
        }
      });
      return valid;
    }
  }
};
