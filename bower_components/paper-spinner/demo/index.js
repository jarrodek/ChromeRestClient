function toggle(event) {
        var spinners = event.target.parentElement.querySelectorAll('paper-spinner, paper-spinner-lite');
        Array.prototype.forEach.call(spinners, function(spinner) {
          spinner.active = !spinner.active;
        });
      };