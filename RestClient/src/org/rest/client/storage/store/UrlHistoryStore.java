package org.rest.client.storage.store;

import org.rest.client.storage.IndexedDbAdapter;
import org.rest.client.storage.indexeddb.IDBDatabase;
import org.rest.client.storage.indexeddb.IDBDatabaseException;
import org.rest.client.storage.indexeddb.IDBIndexParameters;
import org.rest.client.storage.indexeddb.IDBObjectStore;
import org.rest.client.storage.indexeddb.IDBObjectStoreParameters;
import org.rest.client.storage.store.objects.UrlHistoryObject;

import com.allen_sauer.gwt.log.client.Log;

public class UrlHistoryStore extends IndexedDbAdapter<Long, UrlHistoryObject> {
	/**
	 * Store index for URL field
	 */
	public final static String URL_INDEX = "encoding";
	public static final String STORE_NAME = "url_history";
	
	public UrlHistoryStore() {
		super("rest_client", STORE_NAME);
	}

	@SuppressWarnings("unchecked")
	public static void setVestion(IDBDatabase db) throws IDBDatabaseException {
		
		Log.debug("Set store (url_history) new version " + databaseVersion);
		Log.warn("This will remove all previous data.");
		
		if(db.getObjectStoreNames().contains(STORE_NAME)){
			Log.debug("Remove previous selected store: " + STORE_NAME);
			db.deleteObjectStore(STORE_NAME);
		}
		
		IDBObjectStoreParameters parameters = IDBObjectStoreParameters.create();
		parameters.setKeyPath("id");
		parameters.setAutoIncrement(true);
		Log.debug("Create new store: Store name: " + STORE_NAME);
		IDBObjectStore<Long> newStore = (IDBObjectStore<Long>) db.createObjectStore(STORE_NAME, parameters);
		
		IDBIndexParameters encodingIndexParameters = IDBIndexParameters.create();
		encodingIndexParameters.setUnique(true);
		newStore.createIndex(URL_INDEX, URL_INDEX, encodingIndexParameters);
		Log.debug("Create new store index (url): Store name: " + STORE_NAME);
	}

}
