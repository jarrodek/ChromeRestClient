Polymer({

      is: 'meta-test',

      ready: function() {
        this.textContent = new Polymer.IronMetaQuery({key: 'info'}).value;
      }

    });