HTMLImports.whenReady(function() {
      function observePhysicalCount(list) {
        var div = document.createElement('div');
        var stats = document.createElement('div');
        var values = [];
        var timer;
        div.classList.add('count');
        stats.classList.add('stats');

        Object.observe(list, function(changes) {
          var physicalCount = list._physicalCount;
          changes.forEach(function(change) {

            if (change.name === '_physicalCount') {
              values.pop();
              values.push(change.oldValue);
              values.push(list._physicalCount);
              div.innerText = values.join(' -> ');
            } else if (change.name === '_lastPage') {
              if (list._lastPage === 0) {
                timer = Date.now();
              } else if (list._lastPage === 1) {
                stats.innerText = 'First paint: ' + (Date.now() - timer) + 'ms';
              } else if (list._lastPage === list._maxPages) {
                stats.innerText = stats.innerText  + ' total: ' + (Date.now() - timer) + 'ms';
              }
            }
          });
        });

        values.push(list._physicalCount);
        div.innerText = list._physicalCount;
        stats.innerText = 'Waiting for stats...';

        Polymer.dom(list.parentNode).appendChild(div);
        Polymer.dom(list.parentNode).appendChild(stats);
      }

      function arrayFill(size, value) {
        return (new Array(size)).fill(value, 0, size);
      }

      function randomArrayFill(size, min, max) {
        var a = [];
        while (a.length < size) {
          a.push(parseInt(Math.random() * (max-min+1)) + min);
        }
        return a;
      }

      function asyncJob(fn) {
        if (fn()) {
          setTimeout(asyncJob.bind(null, fn), 1);
        }
      }

      document.querySelector('template[is=dom-bind]')._getStyle = function(item) {
        return 'height:' + item + 'px; ';
      };

      setTimeout(function() {
        var list1 = document.querySelector('#list1');
        var list2 = document.querySelector('#list2');
        var list3 = document.querySelector('#list3');
        var list4 = document.querySelector('#list4');
        var list5 = document.querySelector('#list5');
        var list6 = document.querySelector('#list6');
        var list7 = document.querySelector('#list7');
        var list8 = document.querySelector('#list8');
        var items = randomArrayFill(100, 1, 200);

        list1.items = arrayFill(100, 50);
        observePhysicalCount(list1);

        // list2.items = arrayFill(100, 300);
        // list3.items = arrayFill(1000, 2);
        // list4.items = arrayFill(2, 2).concat(arrayFill(100, 300));
        // list5.items = arrayFill(100, 600);
        // list6.items = [2];

        // setTimeout(function() {
        //   list6.push.apply(list6,
        //     ['items'].concat([512, 256, 128, 64, 16, 16, 16, 16, 16, 16, 8, 4])
        //   );
        // }, 100);

        // list7.items = randomArrayFill(100, 1, 200);
        // list8.items = [];

        // asyncJob(function() {
        //   list8.push('items', items.pop());
        //   return items.length > 0;
        // });

        // observePhysicalCount(list2);
        // observePhysicalCount(list3);
        // observePhysicalCount(list4);
        // observePhysicalCount(list5);
        // observePhysicalCount(list6);
        // observePhysicalCount(list7);
        // observePhysicalCount(list8);

      }, 0);

    });