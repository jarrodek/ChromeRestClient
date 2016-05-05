(function() {
  'use strict';
  /**
  @license
  Copyright 2016 Pawel Psztyc, The ARC team

  Licensed under the Apache License, Version 2.0 (the "License"); you may not
  use this file except in compliance with the License. You may obtain a copy of
  the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
  License for the specific language governing permissions and limitations under
  the License.
  */
  window.ArcBehaviors = window.ArcBehaviors || {};
  /**
   * A behavior that is responsible for text search in a selected node.
   * All marked occurance of a search word / text will be wrapped with a
   * `<mark class="arc-search-mark">` element.
   *
   * Inspired by http://www.the-art-of-web.com/javascript/search-highlight/
   *
   * @polymerBehavior ArcBehaviors.TextSearchBehavior
   */
  window.ArcBehaviors.TextSearchBehavior = {
    properties: {
      /**
       * Number of occurance for text search.
       * Parent node (controller) can use it to instruct search bar about number of occurance found
       * in text.
       */
      markedCount: {
        type: Number,
        value: 0,
        readOnly: true,
        notify: true
      },

      /**
       * An element which should be searched for text.
       * Element that implements this behaviour should implement it to point a node that contain
       * a search text / nodes to search.
       */
      _textSearch: {
        type: HTMLElement,
        value: function() {
          return document.body;
        }
      },
      // compiled RegExp.
      matchRegex: {
        type: String,
        value: '',
        readOnly: true
      },
      // True when should match whole word from left
      openLeft: {
        type: Boolean,
        value: false,
        readOnly: true
      },
      // True when should match whole word from right
      openRight: {
        type: Boolean,
        value: false,
        readOnly: true
      },
      /**
       * The type of text matching:
       * `open` match every occurance of search word.
       * `left` matches whole word from the left.
       * `right` matches whole word from the right.
       * `both` matches whole word occurance.
       */
      matchType: {
        type: String,
        value: 'open'
      }
    },

    observers: [
      '_setMatchType(matchType)'
    ],

    _setMatchType: function(matchType) {
      switch (matchType) {
        case 'left':
          this._setOpenLeft(false);
          this._setOpenRight(true);
          break;
        case 'right':
          this._setOpenLeft(true);
          this._setOpenRight(false);
          break;
        case 'open':
          this._setOpenLeft(true);
          this._setOpenRight(true);
          break;
        default:
          this._setOpenLeft(false);
          this._setOpenRight(false);
      }
    },
    // Adds language support to match accent letters.
    addAccents: function(input) {
      var retval = input;
      retval = retval.replace(/([ao])e/ig, '$1');
      retval = retval.replace(/\\u00E[024]/ig, 'a');
      retval = retval.replace(/\\u00E7/ig, 'c');
      retval = retval.replace(/\\u00E[89AB]/ig, 'e');
      retval = retval.replace(/\\u00E[EF]/ig, 'i');
      retval = retval.replace(/\\u00F[46]/ig, 'o');
      retval = retval.replace(/\\u00F[9BC]/ig, 'u');
      retval = retval.replace(/\\u00FF/ig, 'y');
      retval = retval.replace(/\\u00DF/ig, 's');
      retval = retval.replace(/a/ig, '([aàâä]|ae)');
      retval = retval.replace(/c/ig, '[cç]');
      retval = retval.replace(/e/ig, '[eèéêë]');
      retval = retval.replace(/i/ig, '[iîï]');
      retval = retval.replace(/o/ig, '([oôö]|oe)');
      retval = retval.replace(/u/ig, '[uùûü]');
      retval = retval.replace(/y/ig, '[yÿ]');
      retval = retval.replace(/s/ig, '(ss|[sß])');
      return retval;
    },
    /**
     * Compiles the regexp for given input.
     *
     * @param {String} input A search string.
     */
    _compile: function(input) {
      input = input.replace(/\\([^u]|$)/g, '$1');
      input = input.replace(/([\.\+\?\{\}\[\]\|=:\$\^])+/g, '\\$1').replace(/\s+/g, '|');
      // input = input.replace(/[^\w\\\s']+/g, '').replace(/\s+/g, '|');
      input = input.replace(/^\||\|$/g, '');
      input = this.addAccents(input);
      if (input) {
        var re = '(' + input + ')';
        if (!this.openLeft) {
          re = '(?:^|[\\b\\s])' + re;
        }
        if (!this.openRight) {
          re = re + '(?:[\\b\\s]|$)';
        }
        this._setMatchRegex(new RegExp(re, 'i'));
        return true;
      }
      return false;
    },
    /**
     * Searches words inside `this._textSearch` element.
     *
     * @return {Number} A number of marked occurances.
     */
    searchWords: function() {
      if (!this.matchRegex) {
        return;
      }
      console.time('Search in response');
      var walker = document.createTreeWalker(
        this._textSearch,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      var count = 0;
      while (walker.nextNode()) {
        let node = walker.currentNode;
        if (node.parentNode.nodeName === 'MARK') {
          continue;
        }
        let nv = node.nodeValue;
        var regs = this.matchRegex.exec(nv);
        if (nv && regs) {
          var match = document.createElement('MARK');
          match.classList.add('arc-search-mark');
          match.appendChild(document.createTextNode(regs[1]));
          var after;
          if (regs[0].match(/^\s/)) { // in case of leading whitespace
            after = node.splitText(regs.index + 1);
          } else {
            after = node.splitText(regs.index);
          }
          after.nodeValue = after.nodeValue.substring(regs[1].length);
          node.parentNode.insertBefore(match, after);
          count++;
        }
      }
      console.timeEnd('Search in response');
      return count;
    },
    // added by Yanosh Kunsh to include utf-8 string comparison
    dec2hex4: function(textString) {
      var hexequiv = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
        'C', 'D', 'E', 'F');
      return hexequiv[(textString >> 12) & 0xF] +
        hexequiv[(textString >> 8) & 0xF] +
        hexequiv[(textString >> 4) & 0xF] +
        hexequiv[textString & 0xF];
    },

    convertCharStr2jEsc: function(str, cstyle) {
      // Converts a string of characters to JavaScript escapes
      // str: sequence of Unicode characters
      var highsurrogate = 0;
      var suppCP;
      var pad;
      // var n = 0;
      var outputString = '';
      for (let i = 0; i < str.length; i++) {
        let cc = str.charCodeAt(i);
        if (cc < 0 || cc > 0xFFFF) {
          outputString += '!Error in convertCharStr2UTF16: unexpected charCodeAt result, cc=' +
            cc + '!';
        }
        if (highsurrogate !== 0) { // this is a supp char, and cc contains the low surrogate
          if (0xDC00 <= cc && cc <= 0xDFFF) {
            suppCP = 0x10000 + ((highsurrogate - 0xD800) << 10) + (cc - 0xDC00);
            if (cstyle) {
              pad = suppCP.toString(16);
              while (pad.length < 8) {
                pad = '0' + pad;
              }
              outputString += '\\U' + pad;
            } else {
              suppCP -= 0x10000;
              outputString += '\\u' + this.dec2hex4(0xD800 | (suppCP >> 10)) + '\\u' +
                this.dec2hex4(0xDC00 | (suppCP & 0x3FF));
            }
            highsurrogate = 0;
            continue;
          } else {
            outputString += 'Error in convertCharStr2UTF16: low surrogate expected, cc=' + cc + '!';
            highsurrogate = 0;
          }
        }
        if (0xD800 <= cc && cc <= 0xDBFF) { // start of supplementary character
          highsurrogate = cc;
        } else { // this is a BMP character
          switch (cc) {
            case 0:
              outputString += '\\0';
              break;
            case 8:
              outputString += '\\b';
              break;
            case 9:
              outputString += '\\t';
              break;
            case 10:
              outputString += '\\n';
              break;
            case 13:
              outputString += '\\r';
              break;
            case 11:
              outputString += '\\v';
              break;
            case 12:
              outputString += '\\f';
              break;
            case 34:
              outputString += '\\\"';
              break;
            case 39:
              outputString += '\\\'';
              break;
            case 92:
              outputString += '\\\\';
              break;
            default:
              if (cc > 0x1f && cc < 0x7F) {
                outputString += String.fromCharCode(cc);
              } else {
                pad = cc.toString(16).toUpperCase();
                while (pad.length < 4) {
                  pad = '0' + pad;
                }
                outputString += '\\u' + pad;
              }
          }
        }
      }
      return outputString;
    },
    /**
     * Mark all occurance of given `word`.
     *
     * @param {String} input A word to search.
     */
    mark: function(input) {
      console.time('Mark text in response');
      this.cleanMarked();
      var count = 0;

      if (!input || !(input = input.replace(/(^\s+|\s+$)/g, ''))) {
        return;
      } else {
        input = this.convertCharStr2jEsc(input);
        if (this._compile(input)) {
          count = this.searchWords(this._textSearch);
        }
      }
      console.time('Sending marked cout signal');
      this._setMarkedCount(count);
      console.timeEnd('Sending marked cout signal');
      console.timeEnd('Mark text in response');
    },
    /**
     * Clean markers and restore original view.
     */
    cleanMarked: function() {
      console.time('Clear marked text in response');
      var arr = this._textSearch.getElementsByTagName('MARK');
      var el;
      while (arr.length && (el = arr[0])) {
        var parent = el.parentNode;
        if (!el.firstChild) {
          continue;
        }
        parent.replaceChild(el.firstChild, el);
        parent.normalize();
      }
      console.timeEnd('Clear marked text in response');
    },
    /**
     * Highlights marked word and scolls the view to the position of the word if not visible
     * on screen.
     *
     * @param {Number} posiotion A position of the word in the found array.
     */
    setMarked: function(position) {
      var marked = this._textSearch.querySelectorAll('mark.arc-search-mark');
      if (marked.length === 0 || marked.length < position) {
        return;
      }
      marked[position].classList.add('selected');
      marked[position].scrollIntoViewIfNeeded();
    },
    /**
     * Clears highlight for marked word.
     */
    clearMarked: function() {
      var marked = this._textSearch.querySelector('mark.arc-search-mark.selected');
      if (!marked) {
        return;
      }
      marked.classList.remove('selected');
    }
  };

})();
