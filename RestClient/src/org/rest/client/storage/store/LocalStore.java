/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.storage.store;

import org.rest.client.storage.LocalStorageAdapter;

/**
 * Store for latest request data
 * @author jarrod
 *
 */
public class LocalStore extends LocalStorageAdapter {
	
	public final static String LATEST_REQUEST_KEY = "latest_request_data";
	public final static String HEADERS_IMPORT_TIME_KEY = "headers_import_time";
	
	/**
	 * Key for debug enabled.
	 */
	public static final String DEBUG_KEY = "DEBUG_ENABLED";
	/**
	 * Key for history list enabled value
	 */
	public static final String HISTORY_KEY = "HISTORY_ENABLED";
	/**
	 * Key for amount of history list
	 */
	public static final String HISTORY_AMOUNT = "HISTORY_AMOUNT";
	
	public static final String JSON_HEADERS_KEY = "JSONHEADERS";
	public static final String SHORTCUTS_VALUES = "SHORTCUTS";
	
	public LocalStore() {}

}
