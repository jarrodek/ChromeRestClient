package org.rest.client.storage.websql;

import java.util.Date;

import org.rest.client.storage.store.objects.HistoryObject;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Select;
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
	/**
	 * Get data for history view. Response will include: id, url and method fields.
	 * @param callback
	 */
	@Select("SELECT id,url,method,time FROM history ORDER BY time DESC")
	void getDataForHistoryView(ListCallback<HistoryObject> callback);
	/**
	 * Find all history items for given URL and method
	 * @param url
	 * @param method
	 * @param callback
	 */
	@Select("SELECT * FROM history WHERE url={url} AND method={method} ORDER BY time DESC")
	void getHistoryItems(String url, String method, ListCallback<HistoryObject> callback);
	
	@Select("SELECT * FROM history WHERE ID={id}")
	void getHistoryItem(int id, ListCallback<HistoryObject> callback);
	/**
	 * Update timestamp when history item has been used.
	 * 
	 * @param id
	 * @param upd
	 *            {@link Date} object
	 * @param callback
	 */
	@Update("UPDATE history SET time = {upd.getTime()} WHERE ID = {id}")
	void updateTime(int id, Date upd,VoidCallback callback);
}
