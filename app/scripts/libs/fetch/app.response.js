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
/* global Response */
/**
 * The {@link ArcResponse} class behaves the same way as JavaScript's Response class 
 * but it have additional methods.
 * 
 */
class ArcResponse extends Response {
  /**
   * The ArcResponse() constructor creates a new {@link ArcResponse} object.
   * 
   * @constructor
   * @param {Blob|BufferSource|FormData|URLSearchParams|USVString} body A response body. 
   * @param {Object} init (Optional) The same init options as Response object.
   * See https://developer.mozilla.org/en-US/docs/Web/API/Response/Response for more information.
   */
  constructor(body, init) {
    super(body, init);
    this.redirects = new Set();
    
    this.setRedirects = (redirects) => {
      if (!(redirects instanceof Set)) {
        redirects = new Set(redirects);
      }
      this.redirects = redirects;
    };
    /**
     * this.headers will not contain headers like Cookie.
     * Full list of received headers will be available
     * in this.originalHeaders object.
     */
    this.setOriginalHeaders = (headers) => {
      this.originalHeaders = headers;
    };
  }
}
