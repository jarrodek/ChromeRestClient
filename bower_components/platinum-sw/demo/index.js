var t = document.querySelector('#page-template');

      t.books = [{
        title: 'Don Quixote',
        url: 'https://cdn.rawgit.com/GITenberg/Don-Quixote_996/master/996.txt'
      }, {
        title: 'Dubliners',
        url: 'https://cdn.rawgit.com/GITenberg/Dubliners_2814/master/2814.txt'
      }, {
        title: 'Pride & Prejudice',
        url: 'https://cdn.rawgit.com/GITenberg/Pride-and-Prejudice_1342/master/1342.txt'
      }];

      t.precacheList = t.books.map(function(book) {
        return book.url;
      });

      t.selectBook = function(e) {
        var books = document.querySelector('#books');
        var selectedBook = books.itemForElement(e.target.selectedOptions[0]);
        window.fetch(selectedBook.url).then(function(response) {
          return response.text();
        }).then(function(text) {
          t.text = text;
        });
      };

      window.addEventListener('WebComponentsReady', function() {
        // Explicitly call the register() method. We need to wait until the template's variables are
        // all set first, since the configuration depends on bound variables.
        document.querySelector('platinum-sw-register').register();
      });