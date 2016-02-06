document.addEventListener("WebComponentsReady", function() {
      document.querySelector('#my-app').fire('iron-signal', {name: "foo", data: "Foo!"});
    });

    document.querySelector("#my-app").fooSignal = function(e, detail, sender) {
      document.querySelector("#signal-message").detail = detail;
    };