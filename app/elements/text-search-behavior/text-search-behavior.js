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
 * Additionally each line with the `<mark class="arc-search-mark">` will be wrapped with
 * `<span class="marked">` element which may be helpful with styling.
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
    }
  },
  /**
   * Mark all occurance of given `word`.
   *
   * @param {String} word A word to search.
   */
  mark: function(word) {
    if (!word) {
      return;
    }
    var walker = document.createTreeWalker(
      this._textSearch,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var count = 0;
    var regStr = `(${word})`;
    var re = new RegExp(regStr, 'gim');
    var replacement = `<mark class="arc-search-mark">${word}</mark>`;
    var nodes = [];
    while (walker.nextNode()) {
      re.lastIndex = 0;
      let node = walker.currentNode;
      let value = node.nodeValue;
      value = PayloadParser.htmlEscape(value);
      if (!re.test(value)) {
        continue;
      }
      nodes.push({
        node: node,
        value: value
      });
    }
    nodes.forEach((nodeData) => {
      let markedContainer = document.createElement('span');
      markedContainer.classList.add('marked');
      count += nodeData.value.match(re).length;
      let replaced = nodeData.value.replace(re, replacement);
      markedContainer.innerHTML = replaced;
      nodeData.node.parentNode.replaceChild(markedContainer, nodeData.node);
    });
    this._setMarkedCount(count);
  },
  /**
   * Clean markers and restore original view.
   */
  cleanMarked: function() {
    var marked = this._textSearch.querySelectorAll('span.marked');
    if (marked.length === 0) {
      return;
    }
    Array.from(marked).forEach((node) => {
      let txt = '';
      for (let i = 0, len = node.childNodes.length; i < len; i++) {
        let child = node.childNodes[i];
        if (child.nodeType === 3) {
          txt += child.nodeValue;
        } else {
          txt += child.innerText;
        }
      }
      let replacement = document.createTextNode(txt);
      node.parentNode.replaceChild(replacement, node);
    });
  },

  setMarked: function(position) {
    var marked = this._textSearch.querySelectorAll('mark.arc-search-mark');
    if (marked.length === 0 || marked.length < position) {
      return;
    }
    marked[position].classList.add('selected');
    marked[position].scrollIntoViewIfNeeded();
  },

  clearMarked: function() {
    var marked = this._textSearch.querySelector('mark.arc-search-mark.selected');
    if (!marked) {
      return;
    }
    marked.classList.remove('selected');
  }
};

})();
