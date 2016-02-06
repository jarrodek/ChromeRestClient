document.querySelector('template').initializeDefaultValue = function(ev) {
      console.log("initializeTemplate");
      this.value = {
        name: "Mickey",
        hasEars: true
      }
    };