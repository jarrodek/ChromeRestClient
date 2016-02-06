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

        // If there's no template, render empty code.
        if (!template) {
          this._markdown = '```\n```';
          return;
        }

        // TODO(noms): When marked-element/issues/23 lands, this will become
        // a public method and will need to be updated.
        var snippet = this.$.marked._unindent(template.innerHTML);

        // Boolean properties are displayed as checked="", so remove the ="" bit.
        snippet = snippet.replace(/=""/g, '');

        this._markdown = '```\n' + snippet + '\n' + '```';

        // Stamp the template.
        Polymer.dom(this).appendChild(document.importNode(template.content, true));
      }
    });