'use strict';

Polymer({
  is: 'user-image',

  properties: {
    /**
     * URL of the user profile image.
     * The image will be processes by Chrome App only when this property
     * will change for something different than null.
     */
    profileImage: {
      type: String,
      observer: '_observeProfileImage'
    },
    /**
     * A flag determining if the component has stored an image in the filesystem.
     */
    hasImage: {
      type: Boolean,
      value: false,
      computed: '_computeHasImage(_pictureObjectUrl)'
    },
    /**
     * A folder name where images will be stored in sandboxed filesystem.
     */
    _path: {
      type: String,
      value: 'userimage'
    },
    /**
     * Saved in sandboxed filesystem image URL.
     * Chrome Apps can only accept images within the app or stored in local filesystem.
     */
    _pictureObjectUrl: String,
    /**
     * A name of the file to be saved in sanboxed filesystem
     */
    _filename: String
  },
  _computeHasImage: function(_pictureObjectUrl) {
    return !!_pictureObjectUrl;
  },
  /**
   * Called when profileImage attribute change. Then it will process the image.
   */
  _observeProfileImage: function() {
    if (!this.profileImage || this._pictureObjectUrl) {
      return;
    }
    this._processLocalImage();
  },
  /**
   * Restore user image from local system. If file don't exists request new one.
   */
  _processLocalImage: function() {
    var ext = this.profileImage.substr(this.profileImage.lastIndexOf('.') + 1);
    var filename = this.profileImage.substr(this.profileImage.indexOf('/', 8) + 1);
    filename = filename.substr(0, filename.lastIndexOf('/'));
    filename = filename.replace(/\//g, '_') + '.' + ext;

    this._filename = filename;
    window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, function(fs) {
      var fsURL = fs.root.toURL() + this._path + '/' + this._filename;
      window.webkitResolveLocalFileSystemURL(fsURL, function(entry) {
        this._pictureObjectUrl = entry.toURL();
      }.bind(this), function() {
        this.$.fileRequest.generateRequest();
      }.bind(this));
    }.bind(this), function(reason) {
      //TODO: error handling
      console.error('webkitRequestFileSystem', reason);
    });
  },
  /**
   * Called when an error occurred requesting the image.
   *
   * @param {Error} e - error object
   */
  _userPictureError: function(e) {
    //TODO: error handling
    console.error('user-image::userPictureError:', e);
  },
  /**
   * Called after successful response of the image download.
   * It will contain user image data as Blob in e.detail.response.
   *
   * @param e - event form core-xhr
   */
  _userPictureResponse: function(e) {
    if (e.detail && e.detail.response) {
      //Save the file for further use
      var blob = e.detail.response;
      blob.name = this._filename;
      //this._writePicFile(blob);
      this._pictureObjectUrl = window.URL.createObjectURL(blob);
    } else {
      console.error('user-image::_userPictureResponse:', e);
    }
  },

  /**
   * Write a picture to sanboxed filesystem.
   *
   * @param {Blob} blob - image data
   * @return {Promise} a Promise object. Resolve with FileEntry on newly created file.
   */
  _writePicFile: function(blob) {
    return new Promise(function(resolve, reject) {
      var onError = function(e) {
        console.warn('Error write user\'s thumbnail in filesystem', e);
        reject(e);
      };
      window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024, function(fs) {
        fs.root.getDirectory(this.FOLDERNAME, {
          create: true
        }, function(dirEntry) {
          dirEntry.getFile(blob.name, {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            // Create a FileWriter object for our FileEntry, and write out blob.
            fileEntry.createWriter(function(fileWriter) {
              fileWriter.onerror = onError;
              fileWriter.onwriteend = function(e) {
                console.log('Write user\'s thumbnail completed.', e);
                resolve(fileEntry);
              };
              fileWriter.write(blob);
            }.bind(this), onError);
          }.bind(this), onError);
        }.bind(this), onError);
      }.bind(this), onError);
    }.bind(this));
  }
});
