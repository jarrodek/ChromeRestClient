var app = document.querySelector('#app');

    app.url = function (videoId) {
      return 'https://www.youtube.com/watch?v=' + videoId;
    };