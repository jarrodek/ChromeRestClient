function update() {
        var output = document.getElementById('output');
        var elements = document.getElementById('form').formElements;
        document.getElementById('output').innerHTML = '';
        for (var i = 0; i < elements.length; i++) {
          var li = document.createElement('li');
          var text = document.createTextNode(elements[i].value);
          li.appendChild(text);
          output.appendChild(li);
        }
      };