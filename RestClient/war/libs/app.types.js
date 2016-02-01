'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
/* global HAR */

/**
 * A base types definitions for the app.
 */

/**
 * A base object for all types with helper methods.
 */
class BaseObject {

  /**
   * Check if [passed] object contains all required properties declared in [required] array.
   * This method will throw an [Error] when required parameter is missing. 
   *
   * @param {Array<String>} required An array of required parameters.
   * @param {Object} passed An object on which test properties
   */
  assertRequiredKeys(required, passed) {
    const errors = [];
    required.forEach((name) => {
      if (!(name in passed)) {
        errors.push(name);
      }
    });
    if (errors.length > 0) {
      throw new Error('Missing parameters: ' + errors.join(', ') + '.');
    }
  }
}
/**
 * An object extending this class will contain additional property
 * to point that this object was available in old database structure
 * and can have old database ID.
 *
 * Object of this class are used only temporarily to sync changes 
 * between IndexedDB and WebSQL. In packaged apps WebSQL is not available 
 * so this object won't be necessary. 
 *
 * Note that datastore used to store this object should have index created
 * for `oldId`
 *
 * @example
 * // expose `oldId` as a reference to WebSQL id
 * if (obect.oldId) {
 *  //has old database id
 * }
 *
 * @extends BaseObject
 */
class LegacyObject extends BaseObject {

  constructor(opts) {
    super();
    /**
     * An old database ID reference.
     * It is temporary field to sync changes between IDB and WebSQL
     *
     * @type {?Number}
     */
    this.oldId = opts.oldId || undefined;
  }
}
/**
 * OrderedList object represents an object that can be ordered in a list. This
 * objects have additional properties and methods to manage their position on
 * the list.
 *
 * This object extends LegacyObject only temporarily. It should extends BaseObject.
 *
 * @example <caption>Reordering elements on list</caption>  
 * // Initial list
 * let list = [OrderedList1, OrderedList2, OrderedList3, OrderedList4, OrderedList5, OrderedList6, 
 * OrderedList7];
 * // Last element must be moved from 7-th position to 3-rd (zero-based)
 * list.forEach((item) => { 
 *  item.changeOrder('up', 2, list[6], list[6].order); 
 * }); 
 * // [OrderedList1, OrderedList2, OrderedList7, OrderedList3, OrderedList4, OrderedList5, 
 * OrderedList6] 
 * @extends LegacyObject
 */
class OrderedList extends LegacyObject {

  constructor(opts) {
    super(opts);
    /**
     * Object order on a list
     *
     * @type {Number}
     * @default 0
     */
    this.order = opts.order || 0;
  }
  /**
   * Change the order of the element. This method will change the order of the
   * element depending on arguments. Note that this method don't care on which
   * list item is. Program should perform this operation only on elements that
   * are already on the list. Object that is changing position can also be
   * changed using this method so it's safe to use it on all list elements.
   * 
   * 
   * 
   * @example <caption>Reordering elements on list</caption>  
   * //For example if you want to move element from position 7 to position 2. 
   * //The function should look as follows: 
   * 
   * // Initial list
   * let list = [OrderedList1, OrderedList2, OrderedList3, OrderedList4, OrderedList5, 
   * OrderedList6, OrderedList7];
   * // Last element must be moved from 7-th position to 3-rd (zero-based)
   * list.forEach((item) => { 
   *  item.changeOrder('up', 2, list[6], list[6].order); 
   * }); 
   * // [OrderedList1, OrderedList2, OrderedList7, OrderedList3, OrderedList4, OrderedList5, 
   * OrderedList6]
   * Note: positions (order) are zero-based.
   *
   * @param {String} dir  The direction of the change. Set to `up` if the
   * element should go up on the list or `down` (default) otherwise.
   * @param {Number} change  A target position of the moved element. If the
   * element should finally be at position 2 this value should be 2.
   * @param {OrderedList} moved  A moved OrderedList object as a reference to
   * compare if current object is moved object.
   * @param {Number} movedOrder  A base position of the moved element. If
   * moved element previously was at position 7 this value should be 7.
   */
  changeOrder(dir, change, moved, movedOrder) {
    if (dir === 'up') {
      if (this.order === 0) {
        throw new Error('Can\'t move list element below 0 in this direction.');
      }
      this.moveUp(change, moved, movedOrder);
    } else {
      this.moveDown(change, moved, movedOrder);
    }
  }
  /**
   * Decrement order value so the element will go up on the list.
   * This method is used internally by {@link OrderedList#changeOrder} method.
   *
   * @example
   * Object.moveUp(2, OtherObject, 4);
   *
   * @param {Number} change  A target position of the moved element. If the
   * element should finally be at position 2 this value should be 2.
   * @param {OrderedList} moved  A moved OrderedList object as a reference to
   * compare if current object is moved object.
   * @param {Number} movedOrder  A base position of the moved element. If
   * moved element previously was at position 7 this value should be 7.
   */
  moveUp(change, moved, movedOrder) {
    if (this.order < change) {
      return;
    }
    if (this.order > movedOrder) {
      return;
    }
    if (this === moved) {
      this.order = change;
      return;
    }
    --this.order;
  }
  /**
   * Increment order value so the element will go down on the list.
   * This method is used internally by {@link OrderedList#changeOrder} method.
   *
   * @example
   * Object.moveUp(2, OtherObject, 4);
   *
   * @param {Number} change  A target position of the moved element. If the
   * element should finally be at position 2 this value should be 2.
   * @param {OrderedList} moved  A moved OrderedList object as a reference to
   * compare if current object is moved object.
   * @param {Number} movedOrder  A base position of the moved element. If
   * moved element previously was at position 7 this value should be 7.
   */
  moveDown(change, moved, movedOrder) {
    if (this.order > change) {
      return;
    }
    if (this.order < movedOrder) {
      return;
    }
    if (this === moved) {
      this.order = change;
      return;
    }
    ++this.order;
  }
}
/** 
 * A base class for request object.
 * This object will be stored in the database.
 *
 * @extends OrderedList
 * @throws {Error} If `url`, `method` or `type` is not available to the constructor.
 */
class RequestObject extends OrderedList {

  constructor(opts) {
    super(opts);
    super.assertRequiredKeys(['url', 'method', 'type'], opts);
    
    /**
     * A HAR object containing request info.
     * To initialize this object use helper class HAR:
     * `new HAR.Log({ ... })` or just pass a JSON object according to HAR specification.
     *
     * @type {HAR}
     */
    this._har = null;
    /**
     * Request URL. It's an index and part of keyPath in the database. Therefore it's required.
     *
     * @type {!String}
     */
    this.url = opts.url;
    /**
     * Request HTTP method. 
     * It's an index and part of keyPath in the database. Therefore it's required.
     *
     * @type {!String}
     */
    this.method = opts.method;
    /**
     * A type of the object. Sub classes can set it by default.
     * Used to distinguish what kind of request is this (saved, history)
     *
     * @type {!String}
     * @default null
     */
    this.type = opts.type ? opts.type : null;
    // set a har object
    this.har = opts.har ? opts.har : null;
  }

  set har(har) {
    if (har instanceof HAR.Log) {
      this._har = har;
    } else {
      this._har = new HAR.Log(har);
    }
  }

  get har() {
    return this._har;
  }
}
/** 
 * A class of saved requests objects.
 * It's just a shorthand class.
 * 
 * @example <caption>Creating this class id the same as</caption>
 * let ro = new RequestObject(...);
 * ro.type = 'saved';
 * 
 * @extends RequestObject
 */
// jshint unused:false
class SavedRequestObject extends RequestObject {
  constructor(opts) {
    opts.type = 'saved';
    super(opts);
  }
}
/** 
 * A class of history requests objects.
 * It's just a shorthand class, enlivenment for:
 * 
 * @example <caption>Creating this class id the same as</caption>
 * let ro = new RequestObject(...);
 * ro.type = 'history';
 *
 * @extends RequestObject
 */
// jshint unused:false
class HistoryRequestObject extends RequestObject {
  constructor(opts) {
    opts.type = 'history';
    super(opts);
  }
}
/**
 * A class representing an entity in the data store with information about 
 * Google Drive referenced items.
 *
 * @extends BaseObject
 * @throws {Error} If `driveId` or `requestId` is not available to the constructor.
 */
// jshint unused:false
class DriveObject extends BaseObject {

  constructor(opts) {
    super();

    super.assertRequiredKeys(['driveId', 'requestId'], opts);
    /**
     * A Google Drive item id.
     *
     * @type {String}
     */
    this.driveId = opts.driveId;
    /**
     * RequestObject data store id.
     *
     * @type {Number}
     */
    this.requestId = opts.requestId;
  }
}
/**
 * A class representing an entity in the data store with information 
 * about export to app server.
 *
 * @extends BaseObject
 * @throws {Error} If `serverId` or `requestId` is not available to the constructor.
 */
// jshint unused:false
class ServerExportedObject extends LegacyObject {

  constructor(opts) {
    super(opts);

    super.assertRequiredKeys(['serverId', 'requestId'], opts);
    /**
     * An id of the item on the server.
     *
     * @type {String}
     */
    this.serverId = opts.serverId;
    /**
     * RequestObject data store id.
     *
     * @type {String}
     */
    this.requestId = opts.requestId;
  }
}
/**
 * A class representing an URL.
 *
 * @extends BaseObject
 * @throws {Error} If `url` is not available to the constructor.
 */
class UrlObject extends BaseObject {

  constructor(opts) {
    super();
    super.assertRequiredKeys(['url'], opts);
    /**
     * An URL to store. It's a database key path so it must be unique.
     *
     * @type {!String}
     */
    this.url = opts.url;
    /**
     * Last used time as a number of milliseconds
     *
     * @type {Number}
     */
    this.time = opts.time;
  }
}
/**
 * A class representing an entity in the URL history data store.
 *
 * @extends UrlObject
 */
// jshint unused:false
class HistoryUrlObject extends UrlObject {
  constructor(opts) {
    super(opts);
  }
}
/**
 * A class representing an entity in the socket urls history data store.
 * 
 * @extends UrlObject
 */
// jshint unused:false
class HistorySocketObject extends UrlObject {
  constructor(opts) {
    super(opts);
  }
}
/**
 * A class representing and entity in the Projects data store.
 *
 * @extends OrderedList
 * @throws {Error} If `requestIds` is not undefined but is not an Array.
 */
// jshint unused:false
class ProjectObject extends OrderedList {

  constructor(opts) {
    super(opts);

    if (!opts.requestIds) {
      opts.requestIds = [];
    }
    if (typeof opts.requestIds.length === 'undefined') {
      throw new Error('`requestIds` property must be an array of ids of request objects');
    }
    /**
     * A list of all endpoints (RequestObjects) referenced to this project.
     *
     * @type {Array}
     */
    this.requestIds = opts.requestIds;
    /**
     * Project name
     *
     * @type {String}
     */
    this.name = opts.name;
    /**
     * Project creation time.
     *
     * @type {Date}
     */
    this.created = opts.time ? new Date(opts.time) : opts.created ? opts.created : undefined;
  }

  /**
   * Append request id to the list of ids.
   *
   * @param {Number} requestIds An ID of the request object.
   */
  addRequest(requestIds) {
    if (!requestIds) {
      throw new Error('Request ID must be set.');
    }
    this.requestIds.push(requestIds);
  }
}
/**
 * A HTTP status code representation in the storage.
 *
 * @extends BaseObject
 * @throws {Error} If `key` or `label` is not available to the constructor.
 */
// jshint unused:false
class HttpStatusObject extends BaseObject {
  constructor(opts) {
    super();

    super.assertRequiredKeys(['key', 'label'], opts);
    /**
     * A HTTP status code is represented as `key`
     *
     * @type {Number}
     */
    this.key = opts.key;
    /**
     * A status message associated with this code.
     *
     * @type {String}
     */
    this.label = opts.label;
    /**
     * An optional description for this code.
     *
     * @type {String}
     */
    this.desc = opts.desc ? opts.desc : undefined;
  }
}
/**
 * A HTTP header representation in the storage.
 *
 * @extends BaseObject
 * @throws {Error} If `key` or `type` is not available to the constructor.
 */
// jshint unused:false
class HttpHeaderObject extends BaseObject {
  constructor(opts) {
    super();

    super.assertRequiredKeys(['key', 'type'], opts);
    /**
     * Header name.
     *
     * @type {String}
     */
    this.key = opts.key;
    /**
     * Header type. One of `request` or `response`.
     *
     * @type {String}
     */
    this.type = opts.type;
    /**
     * An optional example for this header.
     *
     * @type {String}
     */
    this.example = opts.example ? opts.example : undefined;
    /**
     * An optional description for this header.
     *
     * @type {String}
     */
    this.desc = opts.desc ? opts.desc : undefined;
  }
}
