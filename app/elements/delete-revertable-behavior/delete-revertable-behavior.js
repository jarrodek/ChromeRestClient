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
 * Purpose of this behavior is to add delete and revert functionality to the ARC.
 * Each element that implements this behavior will have access to a method `_deleteRevertable()`
 * which accepts PouchDB documents list as a parameter and handles the whole flow for the
 * element.
 * When the documents are restored it will call a `_onDocumentsRestored()` function where the
 * parameter is a list of restored documents. The only difference between initial list
 * and this list is that the `rev` property will change.
 *
 * ### Example
 * ```
 * _delteItems: function() {
 *  var items = this.items; // some array of documents with _id, _rev and all.
 *  this._deleteRevertable('db-name', items);
 * },
 *
 * _onDocumentsRestored: function(docs) {
 *  docs.forEach((i) => this.push('items', i));
 * }
 * ```
 *
 * @polymerBehavior ArcBehaviors.DeleteRevertableBehavior
 */
window.ArcBehaviors.DeleteRevertableBehavior = {
  __revertableGetDb: function() {
    if (!this.__revertableDbName) {
      throw new Error('Database name unknown.');
    }
    return new PouchDB(this.__revertableDbName);
  },
  /**
   * Deletes the data from the `dbName` datastore and triggest toast with a revert action.
   *
   * @param {String} dbName Name of the database to use.
   * @param {Array} items List of PouchDB documents to delete.
   * @return {Promise}
   */
  _deleteRevertable: function(dbName, items) {
    this.__revertableDbName = dbName;
    var db = this.__revertableGetDb();
    items.forEach((i) => i._deleted = true);
    return db.bulkDocs(items)
    .then((res) => {
      this._handleDeletedItems(res);
      return db.close()
      .then(() => res);
    });
  },

  /**
   * [_handleDeletedItems description]
   * @param {[type]} deleteResult [description]
   * @return {[type]}
   */
  _handleDeletedItems: function(deleteResult) {
    var msg = '';
    var size = deleteResult.length;

    if (size === 1) {
      msg = 'Selected item has been removed.';
    } else {
      msg = size + ' items has been removed.';
    }

    StatusNotification.notify({
      message: msg,
      timeout: StatusNotification.TIME_MEDIUM,
      actionName: 'Revert'
    }, () => {
      this._revertDeleted(deleteResult);
    });
  },

  _revertDeleted: function(deleteResult) {
    var db = this.__revertableGetDb();
    var p = deleteResult.map((i) => db.get(i.id, {rev: i.rev}));

    return Promise.all(p)
    .then((list) => {
      list.forEach((i) => i._deleted = false);
      return db.bulkDocs(list);
    })
    .catch((e) => {
      StatusNotification.notify({
        message: 'Error reverting changes. ' + e.message
      });
      this.fire('app-log', {
        message: ['Error reverting changes', e],
        level: e
      });
      console.error(e);
    })
    .then((r) => {
      if (!r) {
        // There was an error.
        return;
      }
      return this._handleReverted(db, r)
      .then(() => db.close());
    });
  },

  _handleReverted: function(db, revertResult) {
    return db.allDocs({
      keys: revertResult.map((i) => i.id),
      // jscs:disable
      include_docs: true
      // jscs:enable
    })
    .then((res) => this._onDocumentsRestored(res));
  },

  _onDocumentsRestored: function() {}
};
})();
