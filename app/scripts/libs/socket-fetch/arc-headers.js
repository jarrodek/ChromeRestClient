/**
 * Normalizes name of a header.
 * @param {String} name
 * @return {String} Normalized name
 */
function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }
  return name.toLowerCase();
}
/**
 * Normalizes value of a header.
 * @param {String} value
 * @return {String} Normalized name
 */
function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }
  return value;
}
/**
 * A generator for list of headers from a string.
 *
 * ```javascript
 * for (let [name, value] of headersStringToList('a:b')) {
 *  ...
 * }
 * ```
 * @param {[type]} string [description]
 * @return {Generator} [description]
 */
function* headersStringToList(string) {
  if (!string || string.trim() === '') {
    return [];
  }
  const headers = string.split(/\n(?=[^ \t]+)/gim);
  for (let i = 0, len = headers.length; i < len; i++) {
    const line = headers[i].trim();
    if (line === '') {
      continue;
    }
    const sepPosition = line.indexOf(':');
    if (sepPosition === -1) {
      yield [line, ''];
    } else {
      const name = line.substr(0, sepPosition);
      const value = line.substr(sepPosition + 1).trim();
      yield [name, value];
    }
  }
}
/**
 * ARC version of headers interface.
 * It supports ARC API.
 */
export class ArcHeaders {
  constructor(headers) {
    this.map = {};
    if (headers instanceof ArcHeaders || (typeof Headers !== 'undefined' && headers instanceof Headers)) {
      headers.forEach((value, name) => this.append(name, value));
    } else if (Array.isArray(headers)) {
      headers.forEach((header) => this.append(header[0], header[1]));
    } else if (typeof headers === 'string') {
      const iterator = headersStringToList(headers);
      let result = iterator.next();
      while (!result.done) {
        this.append(result.value[0], result.value[1]);
        result = iterator.next();
      }
    } else if (headers) {
      Object.keys(headers).forEach((name) => this.append(name, headers[name]));
    }
  }
  /**
   * Adds value to existing header or creates new header
   * @param {String} name
   * @param {String} value
   */
  append(name, value) {
    const normalizedName = normalizeName(name);
    value = normalizeValue(value);
    let item = this.map[normalizedName];
    if (item) {
      const oldValue = item.value;
      item.value = oldValue ? oldValue + ',' + value : value;
    } else {
      item = {
        name: name,
        value
      };
    }
    this.map[normalizedName] = item;
  }
  /**
   * Removes a header from the list of headers.
   * @param {String} name Header name
   */
  delete(name) {
    delete this.map[normalizeName(name)];
  }
  /**
   * Returns current value of the header
   * @param {String} name Header name
   * @return {String|undefined}
   */
  get(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name].value : undefined;
  }
  /**
   * Checks if header exists.
   * @param {String} name
   * @return {Boolean}
   */
  has(name) {
    return this.map.hasOwnProperty(normalizeName(name));
  }
  /**
   * Creates new header. If header existed it replaces it's value.
   * @param {String} name
   * @param {String} value
   */
  set(name, value) {
    const normalizedName = normalizeName(name);
    this.map[normalizedName] = {
      value: normalizeValue(value),
      name: name
    };
  }

  forEach(callback, thisArg) {
    for (let name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name].value, this.map[name].name, this);
      }
    }
  }

  toString() {
    const result = [];
    this.forEach((value, name) => {
      let tmp = name + ': ';
      if (value) {
        tmp += value;
      }
      result.push(tmp);
    });
    return result.join('\n');
  }

  * keys() {
    for (let name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        yield this.map[name].name;
      }
    }
  }

  * values() {
    for (let name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        yield this.map[name].value;
      }
    }
  }

  * entries() {
    for (let name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        yield [this.map[name].name, this.map[name].value];
      }
    }
  }

  * [Symbol.iterator]() {
    for (let name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        yield [this.map[name].name, this.map[name].value];
      }
    }
  }
}
