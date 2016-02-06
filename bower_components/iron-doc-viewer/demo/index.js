var descriptor = {
        "properties": [
          {
            "name": "marshal",
            "type": "Function",
            "desc": "Renders this element into static HTML for offline use.\n\nThis is mostly useful for debugging and one-off documentation generation.\nIf you want to integrate doc generation into your build process, you\nprobably want to be calling `hydrolysis.Analyzer.analyze()` directly.\n",
            "params": [],
            "function": true,
            "return": {
              "type": "string",
              "desc": "HTML for this element with all state baked in.\n     "
            }
          },
          {
            "name": "src",
            "type": "string",
            "desc": "The URL to an import that declares (or transitively imports) the\nelements that you wish to see documented.\n\nIf the URL is relative, it will be resolved relative to the master\ndocument.\n\nIf you change this value after the `&lt;iron-doc-viewer&gt;` has been\ninstantiated, you must call `load()`.\n      ",
            "published": true
          },
          {
            "name": "transitive",
            "type": "boolean",
            "desc": "Whether _all_ dependencies should be loaded and documented.\n\nTurning this on will probably slow down the load process dramatically.\n      ",
            "published": true
          },
          {
            "name": "_activeElement",
            "type": "!hydrolysis.ElementDescriptor",
            "desc": "The currently displayed element.\n",
            "published": true,
            "private": true
          },
          {
            "name": "_analyzer",
            "type": "!hydrolysis.Analyzer",
            "desc": "The hydrolysis analyzer.\n",
            "published": true,
            "private": true
          },
          {
            "name": "_analyzerChanged",
            "type": "Function",
            "params": [],
            "private": true,
            "function": true
          },
          {
            "name": "_loading",
            "type": "Object",
            "desc": "Whether the analyzer is loading source. ",
            "published": true,
            "private": true
          },
          {
            "name": "_loadingChanged",
            "type": "Function",
            "params": [],
            "private": true,
            "function": true
          },
          {
            "name": "_onTapNavItem",
            "type": "Function",
            "desc": "Activates the element that the user selected.\n",
            "params": [
              {
                "name": "event",
                "type": "!Event",
                "desc": null
              }
            ],
            "private": true,
            "function": true
          },
          {
            "name": "enableCustomStyleProperties",
            "type": "boolean",
            "private": true,
            "configuration": true
          }
        ],
        "is": "doc-demo",
        "desc": "This is an example of how `iron-doc-viewer` will render various types of\ninformation. You can use it as a style guide to see how various data will be\nrepresented. Markdown is used to format descriptive text throughout.\n\n# Level 1 Heading\n\nThis is a level one heading. **Bold text** and *italic text* are represented\nappropriately. [Links](#) have black underlines.\n\n## Level 2 Heading\n\nThis is a level two heading. `inline code` can be represented.\n\n    <html>\n      <p>This is a code block. Its syntax is highlighted automatically.</p>\n    </html>\n\n### Level 3 Heading\n\nLists can also be used as you'd expect:\n\n* Unordered Lists\n  * With Nesting\n* Or without nesting\n\nYou can also use ordered lists:\n\n1. First item\n2. Second item\n\n#### Level 4 Heading\n\nHeadings can be used all the way down to level 5.\n\n##### Level 5 Heading\n\nThis concludes our quick rundown of the various styles that you can commonly use."
      }

      document.querySelector('iron-doc-viewer').descriptor = descriptor;