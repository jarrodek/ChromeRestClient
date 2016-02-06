Polymer({

    is: 'list-demo',

    properties: {

      fileData: {
        type: Array,
        value: function() {
          return [
            {fileName: 'IMG_4130.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4131.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4132.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4133.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4134.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4135.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4136.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4137.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4138.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4139.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4140.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4141.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4142.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4143.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4144.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4145.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4146.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4147.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4148.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4149.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4150.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4151.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4152.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4153.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4154.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4155.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4156.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4157.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4158.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4159.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4160.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4161.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4162.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4163.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4164.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4165.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4166.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4167.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4168.jpg', modifiedDate: 'May 12 2015'},
            {fileName: 'IMG_4169.jpg', modifiedDate: 'May 12 2015'}
          ]
        }
      }
    },

    _onItemClick: function() {
      this.$.pages.selected = 1;
    },

    _onClose: function() {
      this.$.pages.selected = 0;
    }

  });