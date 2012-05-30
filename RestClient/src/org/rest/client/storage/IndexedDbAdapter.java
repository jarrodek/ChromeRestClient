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
package org.rest.client.storage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.rest.client.storage.indexeddb.IDBAbortHandler;
import org.rest.client.storage.indexeddb.IDBBlockedHandler;
import org.rest.client.storage.indexeddb.IDBCompleteHandler;
import org.rest.client.storage.indexeddb.IDBCursor;
import org.rest.client.storage.indexeddb.IDBDatabase;
import org.rest.client.storage.indexeddb.IDBDatabaseException;
import org.rest.client.storage.indexeddb.IDBErrorHandler;
import org.rest.client.storage.indexeddb.IDBFactory;
import org.rest.client.storage.indexeddb.IDBIndex;
import org.rest.client.storage.indexeddb.IDBKeyRange;
import org.rest.client.storage.indexeddb.IDBObjectStore;
import org.rest.client.storage.indexeddb.IDBOpenDBRequest;
import org.rest.client.storage.indexeddb.IDBRequest;
import org.rest.client.storage.indexeddb.IDBSuccessHandler;
import org.rest.client.storage.indexeddb.IDBTransaction;
import org.rest.client.storage.indexeddb.IDBUpdateNeededHandler;
import org.rest.client.storage.indexeddb.IDBVersionChangeRequest;
import org.rest.client.storage.store.FormEncodingsStore;
import org.rest.client.storage.store.HeadersStore;
import org.rest.client.storage.store.HistoryRequestStore;
import org.rest.client.storage.store.RequestDataStore;
import org.rest.client.storage.store.StatusesStore;
import org.rest.client.storage.store.UrlHistoryStore;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.JavaScriptObject;
/**
 * Extend this adapter for any datastore object you need. In IDB key can be
 * anything: number, string, Date object etc. Values is any valid
 * JavaScriptObject object
 * 
 * @author jarrod
 * 
 * 
 * @param <K>
 *            Should be object like Integer or JavaScriptObject
 * @param <V>
 *            Any object
 */
public abstract class IndexedDbAdapter<K, V extends JavaScriptObject>
		implements StorageAdapter<K, V> {
	
	protected final static HashMap<String, IDBDatabase> connectedDatabases = new HashMap<String, IDBDatabase>();
	protected final static String databaseVersion = "0.62";
	protected final static ArrayList<String> openInProgressDatabasesList = new ArrayList<String>();
	protected final static ArrayList<String> openedDatabasesList = new ArrayList<String>();
	
	/**
	 * This method will be used when DB version is changed. Use
	 * {@link IndexedDbAdapter#db} to do some operations on opened database.
	 * 
	 * Heres should be 
	 * 
	 * @throws IDBDatabaseException
	 */
	private static void setVestion(String databaseName, IDBDatabase db) throws IDBDatabaseException {
		
		if(databaseName.equals("rest_client")){
			// call setVersion on:
			// - UrlHistoryStore
			// - FormEncodingsStore
			// - HistoryRequestStore
			// - RequestDataStore
			// - HeadersStore
			UrlHistoryStore.setVestion(db);
			FormEncodingsStore.setVestion(db);
			HistoryRequestStore.setVestion(db);
			RequestDataStore.setVestion(db);
			HeadersStore.setVestion(db);
			StatusesStore.setVestion(db);
		}
	}
	
	protected final String dbName;
	protected final String storeName;
	protected IDBDatabase db;
	protected boolean isReady = false;
	

	public IndexedDbAdapter(String dbName, String storeName) {
		this.dbName = dbName;
		this.storeName = storeName;
		if(connectedDatabases.containsKey(dbName)){
			isReady = true;
			db = connectedDatabases.get(dbName);
		}
	}
	
	ArrayList<StoreResultCallback<Boolean>> waitOpenRequests = new ArrayList<StoreResultCallback<Boolean>>();
	
	/**
	 * Check if DB is already opened.
	 * @return true if connection to DB is opened.
	 */
	public boolean isOpened(){
		return this.isReady;
	}
	
	@Override
	public void open(final StoreResultCallback<Boolean> callback) {
		if (isReady || openedDatabasesList.contains(dbName)) {
			Log.warn("Opening database: " + dbName + ", but it is opened.");
			callback.onSuccess(true);
			return;
		}
		
		if(openInProgressDatabasesList.contains(dbName)){
			waitOpenRequests.add(callback);
			return;
		}
		
		openInProgressDatabasesList.add(dbName);
		
		IDBFactory idb = IDBFactory.getIfSupported();
		final IDBOpenDBRequest openRequest = idb.open(dbName, databaseVersion);
		final boolean useSetVersion = openRequest.useSetVersionToUpgrade();
		openRequest.addSuccessHandler(new IDBSuccessHandler() {
			@Override
			public void onSuccess() {

				Log.debug("Database: " + dbName
						+ " opened. Checking version....");
				db = openRequest.getResult().cast();
				connectedDatabases.put(dbName, db);
				if (useSetVersion) {
					initDB(callback);
				} else {
					if (databaseVersion.equals(db.getVersion())) {
						callback.onSuccess(true);
						cllbackWaitingOpenRequest(true);
					}
				}
			}
		});
		openRequest.addErrorHandler(new IDBErrorHandler() {
			@Override
			public void onError() {
				callback.onError(null);
				cllbackWaitingOpenRequest(null);
			}
		});
		openRequest.addUpdateNeededHandler(new IDBUpdateNeededHandler() {

			@Override
			public void onUpdateNeeded() {
				try {
					setVestion(dbName, db);
					isReady = true;
					callback.onSuccess(true);
					cllbackWaitingOpenRequest(true);
				} catch (IDBDatabaseException e) {
					e.printStackTrace();
					callback.onError(e);
					cllbackWaitingOpenRequest(e);
				}

			}
		});
	}
	
	void cllbackWaitingOpenRequest(boolean success){
		int cnt = waitOpenRequests.size();
		for(int i=0; i<cnt; i++){
			waitOpenRequests.get(i).onSuccess(success);
		}
		waitOpenRequests.clear();
		openInProgressDatabasesList.remove(dbName);
		openedDatabasesList.add(dbName);
	}
	void cllbackWaitingOpenRequest(Exception e){
		int cnt = waitOpenRequests.size();
		for(int i=0; i<cnt; i++){
			waitOpenRequests.get(i).onError(e);
		}
	}
	
	protected void initDB(final StoreResultCallback<Boolean> callback) {
		if (!databaseVersion.equals(db.getVersion())) {
			Log.debug("Upgrade database: " + db.getVersion()
					+ " -> " + databaseVersion);
			try {
				IDBVersionChangeRequest versionChange = db.setVersion(databaseVersion);
				versionChange.addSuccessHandler(new IDBSuccessHandler() {
					@Override
					public void onSuccess() {
						try {
							Log.debug("Success. Update table data....");
							setVestion(dbName, db);
							isReady = true;
							callback.onSuccess(true);
							cllbackWaitingOpenRequest(true);
						} catch (IDBDatabaseException e) {
							callback.onError(e);
							cllbackWaitingOpenRequest(e);
						}
					}
				});
				versionChange.addBlockedHandler(new IDBBlockedHandler() {

					@Override
					public void onBlocked() {
						Log.error("Blocked error: Unable to set new version of database: "
								+ dbName + ", store: " + storeName);
						callback.onError(null);
						cllbackWaitingOpenRequest(null);
					}
				});
				versionChange.addErrorHandler(new IDBErrorHandler() {
					@Override
					public void onError() {
						Log.error("Unable to set new version of database: "
								+ dbName + ", store: " + storeName);
						callback.onError(null);
						cllbackWaitingOpenRequest(null);
					}
				});
			} catch (IDBDatabaseException e) {
				Log.error("Unable to complete", e);
				e.printStackTrace();
				callback.onError(e);
				cllbackWaitingOpenRequest(e);
			}
		} else {
			isReady = true;
			callback.onSuccess(true);
			cllbackWaitingOpenRequest(true);
		}
	}

	/**
	 * In Indexed DB you can query for keys only by query for all data from DB.
	 * In this case better to not implement this feature :)
	 * 
	 * <p>It will immediately call callback with NULL argument</p>
	 */
	@Override
	public void keys(StoreResultCallback<List<K>> callback) {
		callback.onSuccess(null);
	}

	@SuppressWarnings("unchecked")
	public void put(final V obj, final StoreResultCallback<K> callback) {
		try {
			IDBTransaction tx = db.transaction(storeName,
					IDBTransaction.READ_WRITE);
			IDBObjectStore<K> store = (IDBObjectStore<K>) tx
					.objectStore(storeName);
			final IDBRequest<K> request = (IDBRequest<K>) store.put(obj, null);

			request.addSuccessHandler(new IDBSuccessHandler() {
				@Override
				public void onSuccess() {
					K result = null;
					try {
						result = (K) request.getResult();
						callback.onSuccess(result);
					} catch (Exception e) {
						e.printStackTrace();
						Log.error("Error put", e);
						callback.onError(e);
					}

				}
			});
			request.addErrorHandler(new IDBErrorHandler() {
				@Override
				public void onError() {
					Log.error("Error put data to datastore: " + storeName, obj);
					callback.onError(null);
				}
			});
		} catch (IDBDatabaseException e) {
			e.printStackTrace();
			callback.onError(e);
			Log.error(
					"Database error when put data to datastore: " + storeName,
					e);
			return;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public void put(final V obj, K key, final StoreResultCallback<K> callback) {
		try {
			IDBTransaction tx = db.transaction(storeName,
					IDBTransaction.READ_WRITE);

			IDBObjectStore<K> store = (IDBObjectStore<K>) tx
					.objectStore(storeName);
			final IDBRequest<K> request = (IDBRequest<K>) store.put(obj, key);
			request.addSuccessHandler(new IDBSuccessHandler() {
				@Override
				public void onSuccess() {
					// get generated / added KEY
					K result = (K) request.getResult();
					callback.onSuccess(result);
				}
			});
			request.addErrorHandler(new IDBErrorHandler() {
				@Override
				public void onError() {
					Log.error("Error put data to datastore: " + storeName, obj);
					callback.onError(null);
				}
			});
		} catch (IDBDatabaseException e) {
			e.printStackTrace();
			callback.onError(e);
			Log.error(
					"Database error when put data to datastore: " + storeName,
					e);
			return;
		}
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public void getByKey(K key, final StoreResultCallback<V> callback) {
		try {
			IDBTransaction tx = db.transaction(storeName,
					IDBTransaction.READ_ONLY);
			IDBObjectStore<K> store = (IDBObjectStore<K>) tx
					.objectStore(storeName);
			final IDBRequest<V> request = (IDBRequest<V>) store.get(key);
			request.addSuccessHandler(new IDBSuccessHandler() {
				@Override
				public void onSuccess() {
					V res = request.getResult().cast();
					callback.onSuccess(res);
				}
			});
			request.addErrorHandler(new IDBErrorHandler() {
				@Override
				public void onError() {
					callback.onError(null);
				}
			});
		} catch (IDBDatabaseException e) {
			e.printStackTrace();
			callback.onError(e);
			return;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public void exists(K key, final StoreResultCallback<Boolean> callback) {
		try {
			IDBTransaction tx = db.transaction(storeName,
					IDBTransaction.READ_ONLY);

			IDBObjectStore<K> store = (IDBObjectStore<K>) tx
					.objectStore(storeName);
			final IDBRequest<Long> request = store.count(key);
			request.addSuccessHandler(new IDBSuccessHandler() {
				@Override
				public void onSuccess() {
					Long r = request.getResult();
					if (r != null && r > 0) {
						callback.onSuccess(true);
					} else {
						callback.onSuccess(false);
					}
				}
			});
			request.addErrorHandler(new IDBErrorHandler() {
				@Override
				public void onError() {
					callback.onError(null);
				}
			});
		} catch (IDBDatabaseException e) {
			e.printStackTrace();
			callback.onError(e);
			return;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public void all(final StoreResultCallback<Map<K, V>> callback) {
		try {
			final Map<K, V> result = new HashMap<K, V>();
			IDBTransaction tx = db.transaction(storeName,
					IDBTransaction.READ_ONLY);
			tx.addCompleteHandler(new IDBCompleteHandler() {
				@Override
				public void onComplete() {
					callback.onSuccess(result);
				}
			});
			tx.addErrorHandler(new IDBErrorHandler() {
				@Override
				public void onError() {
					callback.onError(null);
				}
			});
			tx.addAbortHandler(new IDBAbortHandler() {
				@Override
				public void onAbort() {
					callback.onError(null);
				}
			});
			final IDBObjectStore<K> store = (IDBObjectStore<K>) tx
					.objectStore(storeName);
			final IDBRequest<V> request = (IDBRequest<V>) store.openCursor(
					null, IDBCursor.NEXT);
			request.addErrorHandler(new IDBErrorHandler() {

				@Override
				public void onError() {
					callback.onError(null);
					Log.error("IndexedDbAdapter::all->openCursor::errorHandler");
				}
			});
			request.addSuccessHandler(new IDBSuccessHandler() {
				@Override
				public void onSuccess() {
					V cursorResult = request.getResult();

					if (cursorResult != null) {
						final IDBCursor<K> cursor = cursorResult.cast();
						final K key = cursor.getKey();
						try {
							final IDBRequest<V> getReq = (IDBRequest<V>) store
									.get(key);
							getReq.addSuccessHandler(new IDBSuccessHandler() {

								@Override
								public void onSuccess() {
									try {
										V res = getReq.getResult().cast();
										result.put(key, res);
										cursor.cont();
									} catch (Exception e) {
										e.printStackTrace();
										Log.error(
												"IndexedDbAdapter::all->openCursor::successHandler->cursor::getResult->getResult",
												e);
									}

								}
							});
						} catch (IDBDatabaseException e) {
							e.printStackTrace();
							Log.error(
									"IndexedDbAdapter::all->openCursor::successHandler->cursor::getResult",
									e);
							try {
								cursor.cont();
							} catch (IDBDatabaseException e1) {
								e1.printStackTrace();
							}
						}
					} else {
//						Log.debug("Cursor result is null");
					}
				}
			});

		} catch (IDBDatabaseException e) {
			e.printStackTrace();
			callback.onError(e);
			return;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public void remove(K key, final StoreResultCallback<Boolean> callback) {
		try {
			IDBTransaction tx = db.transaction(storeName,
					IDBTransaction.READ_WRITE);
			IDBObjectStore<K> store = (IDBObjectStore<K>) tx
					.objectStore(storeName);
			final IDBRequest<Void> request = store.delete(key);

			request.addSuccessHandler(new IDBSuccessHandler() {
				@Override
				public void onSuccess() {
					callback.onSuccess(true);
				}
			});
			request.addErrorHandler(new IDBErrorHandler() {
				@Override
				public void onError() {
					callback.onError(null);
				}
			});
		} catch (IDBDatabaseException e) {
			e.printStackTrace();
			callback.onError(e);
			return;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public void countAll(final StoreResultCallback<Long> callback) {
		try {
			IDBTransaction tx = db.transaction(storeName,
					IDBTransaction.READ_ONLY);
			final IDBObjectStore<String> store = (IDBObjectStore<String>) tx
					.objectStore(storeName);
			final IDBRequest<Long> request = store.count();
			request.addSuccessHandler(new IDBSuccessHandler() {
				@Override
				public void onSuccess() {
					callback.onSuccess(request.getResult());
				}
			});
			request.addErrorHandler(new IDBErrorHandler() {
				@Override
				public void onError() {
					callback.onError(null);
				}
			});

		} catch (IDBDatabaseException e) {
			e.printStackTrace();
			callback.onError(e);
			return;
		}
	}

	@SuppressWarnings({ "unchecked" })
	@Override
	public void query(String query, String index,
			final StoreResultCallback<Map<K, V>> callback) {
		final Map<K, V> result = new HashMap<K, V>();
		try {
			IDBTransaction tx = db.transaction(storeName,
					IDBTransaction.READ_ONLY);
			tx.addCompleteHandler(new IDBCompleteHandler() {

				@Override
				public void onComplete() {
					callback.onSuccess(result);
				}
			});

			final IDBObjectStore<K> store = (IDBObjectStore<K>) tx
					.objectStore(storeName);
			IDBIndex<K> _index = store.index(index);
			IDBKeyRange range = IDBKeyRange.bound(query.toUpperCase(), query + "z", false,
					false);
			final IDBRequest<IDBCursor<K>> cursorRequest = (IDBRequest<IDBCursor<K>>) _index
					.openCursor(range, IDBCursor.NEXT);

			cursorRequest.addSuccessHandler(new IDBSuccessHandler() {

				@Override
				public void onSuccess() {
					final IDBCursor<V> cursor = (IDBCursor<V>) cursorRequest
							.getResult();
					if (cursor == null) {
						return;
					}
					final K key = (K) cursor.getPrimaryKey();

					try {
						final IDBRequest<V> getRequest = (IDBRequest<V>) store
								.get(key);
						getRequest.addSuccessHandler(new IDBSuccessHandler() {
							@Override
							public void onSuccess() {
								V _r = getRequest.getResult();
								if (_r != null) {
									result.put(key, _r);
								}
								try {
									cursor.cont();
								} catch (IDBDatabaseException e) {
									e.printStackTrace();
								}

							}
						});
					} catch (IDBDatabaseException e) {
						e.printStackTrace();
					}
				}
			});

		} catch (IDBDatabaseException e) {
			e.printStackTrace();
			callback.onError(e);
			return;
		}
	}

	@Override
	public String adapter() {
		return "indexeddb";
	}

	@Override
	public void valid(StoreResultCallback<Boolean> callback) {
		callback.onSuccess(IDBFactory.getIfSupported() != null);
	}

}
