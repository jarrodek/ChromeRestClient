function openToast(selector) {
      console.log('opening ' + selector);
      document.querySelector(selector).open();
    }
    function closeToast(selector) {
      console.log('closing ' + selector);
      document.querySelector(selector).close();
    };