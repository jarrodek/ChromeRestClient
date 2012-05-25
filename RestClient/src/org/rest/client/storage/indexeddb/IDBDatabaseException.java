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

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;

public class IDBDatabaseException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3788772717301208906L;
	public static final int NO_ERR = 0;
	/**
	 * The operation failed for reasons unrelated to the database itself, and it
	 * is not covered by any other error code; for example, a failure due to
	 * disk IO errors.
	 * 
	 * @value 1
	 */
	public static final int UNKNOWN_ERR = 1;
	/**
	 * An operation was not allowed on an object. Unless the cause of the error
	 * is corrected, retrying the same operation would result in failure.
	 * 
	 * @value 2
	 */
	public static final int NON_TRANSIENT_ERR = 2;
	/**
	 * The operation failed, because the requested database object could not be
	 * found; for example, an object store did not exist but was being opened.
	 * 
	 * @value 3
	 */
	public static final int NOT_FOUND_ERR = 3;
	/**
	 * A mutation operation in the transaction failed because a constraint was
	 * not satisfied. For example, an object, such as an object store or index,
	 * already exists and a request attempted to create a new one.
	 * 
	 * @value 4
	 */
	public static final int CONSTRAINT_ERR = 4;
	/**
	 * Data provided to an operation does not meet requirements.
	 * 
	 * @value 5
	 */
	public static final int DATA_ERR = 5;
	/**
	 * An operation was called on an object where it is not allowed or at a time
	 * when it is not allowed. It also occurs if a request is made on a source
	 * object that has been deleted or removed.
	 * 
	 * More specific variants of this error includes:
	 * {@link #TRANSACTION_INACTIVE_ERR} and {@link #READ_ONLY_ERR}.
	 * 
	 * @value 6
	 */
	public static final int NOT_ALLOWED_ERR = 6;
	/**
	 * A request was made against a transaction that is either not currently
	 * active or is already finished.
	 * 
	 * @value 7
	 */
	public static final int TRANSACTION_INACTIVE_ERR = 7;
	/**
	 * A request was aborted, for example, through a call to
	 * {@link IDBTransaction#abort()}.
	 * 
	 * @value 8
	 */
	public static final int ABORT_ERR = 8;
	/**
	 * A mutation operation was attempted in a {@link IDBTransaction#READ_ONLY}
	 * transaction.
	 * 
	 * @value 9
	 */
	public static final int READ_ONLY_ERR = 9;
	/**
	 * A lock for the transaction could not be obtained in a reasonable time.
	 * 
	 * @value 10
	 */
	public static final int TIMEOUT_ERR = 10;
	/**
	 * Either there's not enough remaining storage space or the storage quota
	 * was reached and the user declined to give more space to the database.
	 * 
	 * @value 11
	 */
	public static final int QUOTA_ERR = 11;
	/**
	 * A request to open a database with a version lower than the one it already
	 * has. This can only happen with {@link IDBOpenDBRequest}.
	 * 
	 * @value 12
	 */
	public static final int VER_ERR = 12;

	private final int code;

	public IDBDatabaseException(JavaScriptException exception) {
		super(exception.getDescription(), exception);
		Log.error("Error in ndexedDB", exception);
		JavaScriptObject jso = exception.getException();
		if (jso == null) {
			code = UNKNOWN_ERR;
		} else {
			code = getErrorCode(jso);
		}
	}

	private native int getErrorCode(JavaScriptObject obj) /*-{
		return obj.code;
	}-*/;

	public IDBDatabaseException(int code, String pMessage) {
		super(pMessage);
		this.code = code;
	}

	public final int getCode() {
		return code;
	}
}
