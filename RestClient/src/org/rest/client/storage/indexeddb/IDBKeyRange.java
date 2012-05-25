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
package org.rest.client.storage.indexeddb;

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;

/**
 * The {@link IDBKeyRange} interface of the IndexedDB API represents a
 * continuous interval over some data type that is used for keys. Records can be
 * retrieved from object stores and indexes using keys or a range of keys. You
 * can limit the range using lower and upper bounds. For example, you can
 * iterate over all values of a key between x and y.
 * 
 * See <a href="https://developer.mozilla.org/en/IndexedDB/IDBKeyRange">https://
 * developer.mozilla.org/en/IndexedDB/IDBKeyRange</a>
 * 
 * @author jarrod
 * 
 */
public class IDBKeyRange extends JavaScriptObject {
	protected IDBKeyRange() {
	}
	
	static {
		setVariables();
	}
	
	private static final native void setVariables() /*-{
		$wnd.IDBKeyRange = $wnd.IDBKeyRange || $wnd.webkitIDBKeyRange;
	}-*/;
	
	/**
	 * Creates a key range with upper and lower bounds. The bounds can be open
	 * (that is, the bounds excludes the endpoint values) or closed (that is,
	 * the bounds includes the endpoint values). By default, the bounds include
	 * the endpoints and are closed.
	 * 
	 * @param lower The lower bound of the key range.
	 * @param upper The upper bound of the key range.
	 * @param lowerOpen Optional. If false (default value), the range includes the lower bound value of the key range.
	 * @param upperOpen Optional. If false (default value), the range includes the upper bound value of the key range.
	 * @return The newly created key range.
	 * @throws IDBDatabaseException
	 */
	public static IDBKeyRange bound(Object lower, Object upper, boolean lowerOpen, boolean upperOpen) throws IDBDatabaseException {
		try {
			return boundImpl(lower, upper, lowerOpen, upperOpen);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}
	
	private static final native IDBKeyRange boundImpl(Object lower,
			Object upper, boolean lowerOpen, boolean upperOpen)
			throws JavaScriptException /*-{
		return $wnd.IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);
	}-*/;
	
	/**
	 * Creates a new key range containing a single value.
	 * @param key The single value in the key range.
	 * @return The newly created key range.
	 * @throws IDBDatabaseException
	 */
	public static IDBKeyRange only(Object key) throws IDBDatabaseException {
		try {
			return onlyImpl(key);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private static final native IDBKeyRange onlyImpl(Object key)
			throws JavaScriptException /*-{
		return $wnd.IDBKeyRange.only(key);
	}-*/;
	/**
	 * Creates a key range with only a lower bound. By default, it includes the lower endpoint value and is closed.
	 * @param bound The value of the lower bound.
	 * @param open Optional. If false (default value), the range includes the lower-bound value.
	 * @return The newly created key range.
	 * @throws IDBDatabaseException
	 */
	public static IDBKeyRange lowerBound(Object bound, boolean open) throws IDBDatabaseException {
		try {
			return lowerBoundImpl(bound, open);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}
	private static final native IDBKeyRange lowerBoundImpl(Object bound, boolean open) throws JavaScriptException /*-{
		return $wnd.IDBKeyRange.lowerBound(bound, open);
	}-*/;
	/**
	 * Creates a new upper-bound key range. By default, it includes the upper endpoint value and is closed.
	 * @param bound The value of the upper bound of the range.
	 * @param open Optional. If false (default value), the range includes the lower-bound value.
	 * @return The newly created key range.
	 * @throws IDBDatabaseException
	 */
	public static IDBKeyRange upperBound(Object bound, boolean open) throws IDBDatabaseException {
		try {
			return upperBoundImpl(bound, open);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}
	private static final native IDBKeyRange upperBoundImpl(Object bound, boolean open) throws JavaScriptException /*-{
		return $wnd.IDBKeyRange.upperBound(bound, open);
	}-*/;
	/**
	 * 
	 * @return Lower bound of the key range.
	 */
	public final native Object getLower() /*-{
		return this.lower;
	}-*/;
	/**
	 * 
	 * @return Upper bound of the key range.
	 */
	public final native Object getUpper() /*-{
		return this.upper;
	}-*/;
	
	/**
	 * 
	 * @return Returns false if the lower-bound value is included in the key range.
	 */
	public final native Boolean getLowerOpen() /*-{
		return this.lowerOpen;
	}-*/;
	/**
	 * 
	 * @return Returns false if the upper-bound value is included in the key range.
	 */
	public final native Boolean getUpperOpen() /*-{
		return this.upperOpen;
	}-*/;
}
