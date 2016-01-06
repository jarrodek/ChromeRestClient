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
 * The IDBKeyRange interface of the IndexedDB API represents a continuous
 * interval over some data type that is used for keys. Records can be retrieved
 * from IDBObjectStore and IDBIndex objects using keys or a range of keys. You
 * can limit the range using lower and upper bounds. For example, you can
 * iterate over all values of a key in the value range A–Z.
 * 
 * A key range can be a single value or a range with upper and lower bounds or
 * endpoints. If the key range has both upper and lower bounds, then it is
 * bounded; if it has no bounds, it is unbounded. A bounded key range can either
 * be open (the endpoints are excluded) or closed (the endpoints are included).
 * To retrieve all keys within a certain range, you can use the following code
 * constructs:
 * 
 * <table>
 * <tr>
 * <th>Range</th>
 * <th>Code</th>
 * </tr>
 * <tr>
 * <td>All keys ≤ x</td>
 * <td>IDBKeyRange.upperBound(x) {@link #upperBound(Object)}</td>
 * </tr>
 * <tr>
 * <td>All keys &lt; x</td>
 * <td>IDBKeyRange.upperBound(x, true) {@link #upperBound(Object, boolean)}</td>
 * </tr>
 * <tr>
 * <td>All keys ≥ y</td>
 * <td>IDBKeyRange.lowerBound(y) {@link #lowerBound(Object)}</td>
 * </tr>
 * <tr>
 * <td>All keys &gt; y</td>
 * <td>IDBKeyRange.lowerBound(y, true) {@link #lowerBound(Object, boolean)}</td>
 * </tr>
 * <tr>
 * <td>All keys ≥ x && ≤ y</td>
 * <td>IDBKeyRange.bound(x, y) {@link #bound(Object, Object)}</td>
 * </tr>
 * <tr>
 * <td>All keys &gt; x && &lt; y</td>
 * <td>IDBKeyRange.bound(x, y, true, true)
 * {@link #bound(Object, Object, boolean, boolean)}</td>
 * </tr>
 * <tr>
 * <td>All keys &gt; x && ≤ y</td>
 * <td>IDBKeyRange.bound(x, y, true, false)
 * {@link #bound(Object, Object, boolean, boolean)}</td>
 * </tr>
 * <tr>
 * <td>All keys ≥ x && &lt; y</td>
 * <td>IDBKeyRange.bound(x, y, false, true)
 * {@link #bound(Object, Object, boolean, boolean)}</td>
 * </tr>
 * <tr>
 * <td>The key = z</td>
 * <td>IDBKeyRange.only(z) {@link #only(Object)}</td>
 * </tr>
 * </table>
 * 
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

	/**
	 * <p>
	 * The bound() method of the IDBKeyRange interface creates a new key range
	 * with upper and lower bounds.
	 * </p>
	 * <p>
	 * The bounds can be open (that is, the bounds exclude the endpoint values)
	 * or closed (that is, the bounds include the endpoint values). By default,
	 * the bounds are closed.
	 * </p>
	 * 
	 * @param lower
	 *            The lower bound of the key range.
	 * @param upper
	 *            The upper bound of the key range.
	 * @param lowerOpen
	 *            Optional. If false (default value), the range includes the
	 *            lower bound value of the key range.
	 * @param upperOpen
	 *            Optional. If false (default value), the range includes the
	 *            upper bound value of the key range.
	 * @return IDBKeyRange: The newly created key range.
	 * @throws IDBDatabaseException
	 *             DataError
	 */
	public static IDBKeyRange bound(Object lower, Object upper, boolean lowerOpen, boolean upperOpen)
			throws IDBDatabaseException {
		try {
			return boundImpl(lower, upper, lowerOpen, upperOpen);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	public static IDBKeyRange bound(Object lower, Object upper) throws IDBDatabaseException {
		try {
			return boundImpl(lower, upper, null, null);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private static final native IDBKeyRange boundImpl(Object lower, Object upper, Boolean lowerOpen, Boolean upperOpen)
			throws JavaScriptException /*-{
		return $wnd.IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);
	}-*/;

	/**
	 * The only() method of the IDBKeyRange interface creates a new key range containing a single value.
	 * 
	 * @param key
	 *            The single value in the key range.
	 * @return IDBKeyRange: The newly created key range.
	 * @throws IDBDatabaseException
	 */
	public static IDBKeyRange only(Object key) throws IDBDatabaseException {
		try {
			return onlyImpl(key);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private static final native IDBKeyRange onlyImpl(Object key) throws JavaScriptException /*-{
		return $wnd.IDBKeyRange.only(key);
	}-*/;

	/**
	 * <p>
	 * The lowerBound() method of the IDBKeyRange interface creates a new key
	 * range with only a lower bound.
	 * </p>
	 * 
	 * <p>
	 * By default, it includes the lower endpoint value and is closed.
	 * </p>
	 * 
	 * @param bound
	 *            The value of the lower bound.
	 * @param open
	 *            Optional. If false (default value), the range includes the
	 *            lower-bound value.
	 * @return IDBKeyRange: The newly created key range.
	 * @throws IDBDatabaseException
	 */
	public static IDBKeyRange lowerBound(Object bound, boolean open) throws IDBDatabaseException {
		try {
			return lowerBoundImpl(bound, open);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	/**
	 * <p>
	 * The lowerBound() method of the IDBKeyRange interface creates a new key
	 * range with only a lower bound.
	 * </p>
	 * 
	 * <p>
	 * By default, it includes the lower endpoint value and is closed.
	 * </p>
	 * 
	 * <p>
	 * The range includes the lower-bound value.
	 * </p>
	 * 
	 * @param bound
	 *            The value of the lower bound.
	 * 
	 * @return IDBKeyRange: The newly created key range.
	 * @throws IDBDatabaseException
	 */
	public static IDBKeyRange lowerBound(Object bound) throws IDBDatabaseException {
		try {
			return lowerBoundImpl(bound, null);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private static final native IDBKeyRange lowerBoundImpl(Object bound, Boolean open) throws JavaScriptException /*-{
		if (open === null) {
			return $wnd.IDBKeyRange.lowerBound(bound);
		}
		return $wnd.IDBKeyRange.lowerBound(bound, open);
	}-*/;

	/**
	 * <p>
	 * The upperBound() method of the IDBKeyRange interface creates a new
	 * upper-bound key range.
	 * </p>
	 * 
	 * <p>
	 * By default, it includes the upper endpoint value and is closed.
	 * </p>
	 * 
	 * @param bound
	 *            The value of the upper bound of the range.
	 * @param open
	 *            Optional. If false (default value), the range includes the
	 *            lower-bound value.
	 * @return IDBKeyRange: The newly created key range.
	 * @throws IDBDatabaseException
	 *             DataError
	 */
	public static IDBKeyRange upperBound(Object bound, boolean open) throws IDBDatabaseException {
		try {
			return upperBoundImpl(bound, open);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	/**
	 * <p>
	 * The upperBound() method of the IDBKeyRange interface creates a new
	 * upper-bound key range.
	 * </p>
	 * 
	 * <p>
	 * By default, it includes the upper endpoint value and is closed.
	 * </p>
	 * 
	 * <p>
	 * The range includes the lower-bound value.
	 * </p>
	 * 
	 * @param bound
	 *            The value of the upper bound of the range.
	 * 
	 * @return IDBKeyRange: The newly created key range.
	 * @throws IDBDatabaseException
	 *             DataError
	 */
	public static IDBKeyRange upperBound(Object bound) throws IDBDatabaseException {
		try {
			return upperBoundImpl(bound, null);
		} catch (JavaScriptException e) {
			throw new IDBDatabaseException(e);
		}
	}

	private static final native IDBKeyRange upperBoundImpl(Object bound, Boolean open) throws JavaScriptException /*-{
		if (open === null) {
			return $wnd.IDBKeyRange.upperBound(bound);
		}
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
	 * @return Returns false if the lower-bound value is included in the key
	 *         range.
	 */
	public final native Boolean getLowerOpen() /*-{
		return this.lowerOpen;
	}-*/;

	/**
	 * 
	 * @return Returns false if the upper-bound value is included in the key
	 *         range.
	 */
	public final native Boolean getUpperOpen() /*-{
		return this.upperOpen;
	}-*/;
}
