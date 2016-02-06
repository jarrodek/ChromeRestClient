Polymer({
      is: 'demo-snippet',

      properties: {
        _markdown: {
          type: String,
          value: ''
        }
      },

      attached: function() {
        var template = Polymer.dom(this).queryDistributedElements('template')[0];

        var snippet = Polymer.domInnerHTML.getInnerHTML(template);
        this._markdown = '```\n' + snippet + '\n' + '```';

        // Stamp the template.
        Polymer.dom(this).appendChild(document.importNode(template.content, true));
      }
    });