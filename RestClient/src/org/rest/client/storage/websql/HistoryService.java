package org.rest.client.storage.websql;

import org.rest.client.storage.store.objects.HistoryObject;

import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Update;
import com.google.code.gwt.database.client.service.VoidCallback;

/**
 * Service for database connection with headers table
 * 
 * @author Paweł Psztyć
 * 
 */
public interface HistoryService extends AppDatabase {
	/**
	 * Create database table. Schema: <br/>
	 * <code>url</code> - Requests url<br/>
	 * <code>data</code> - data to save (Rest params to string). <br/>
	 * <code>time</code> - insert time <br/>
	 * 
	 * @param callback
	 *            callback function
	 */
	@Update("CREATE TABLE IF NOT EXISTS history ("
			+ "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
			+ "url TEXT NOT NULL, "
			+ "method TEXT NOT NULL, "
			+ "encoding TEXT NOT NULL, "
			+ "headers TEXT, "
			+ "payload TEXT, "
			+ "time INTEGER)")
	void initTable(VoidCallback callback);

	/**
	 * Insert header data.
	 * @param headersList 
	 * @param callback
	 *            callback function
	 */
	@Update(sql = "INSERT INTO history (url,method,encoding,headers,payload,time) VALUES ({data.getURL()},{data.getMethod()},{data.getEncoding()},{data.getHeaders()},{data.getPayload()},{data.getTime()})")
	void insertRequest(HistoryObject data,
			RowIdListCallback callback);
	/**
	 * Truncate table.
	 * @param callback
	 */
	@Update(sql = "DELETE FROM history")
	void truncate(VoidCallback callback);
}
