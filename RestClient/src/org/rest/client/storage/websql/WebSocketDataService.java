package org.rest.client.storage.websql;

import org.rest.client.storage.store.objects.WebSocketObject;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;
import com.google.code.gwt.database.client.service.VoidCallback;

/**
 * New version of request data store. This store stores all requests data either
 * saved as project endpoint or regular request.
 * 
 * @author Paweł Psztyć
 * 
 */
public interface WebSocketDataService extends AppDatabase {

	/**
	 * Create database table.
	 * 
	 * @param callback
	 *            callback function
	 */
	@Update("CREATE TABLE IF NOT EXISTS websocket_data ("
			+ "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
			+ "url TEXT NOT NULL, " 
			+ "time INTEGER)")
	void initTable(VoidCallback callback);

	@Update("INSERT INTO websocket_data (url, time) VALUES ("
			+ "{data.getURL()},{data.getTime()})")
	void insertData(WebSocketObject data, RowIdListCallback callback);

	@Update("UPDATE websocket_data SET "
			+ "url = {data.getURL()}, time = {data.getTime()}"
			+ " WHERE ID = {data.getId()}")
	void updateData(WebSocketObject data, VoidCallback callback);
	
	/**
	 * @param callback
	 */
	@Select("SELECT * FROM websocket_data ORDER BY time DESC")
	void getAllData(ListCallback<WebSocketObject> callback);
	
	@Select("SELECT * FROM websocket_data WHERE ID={id}")
	void getWebSocketData(int id, ListCallback<WebSocketObject> callback);
	
	@Select("SELECT * FROM websocket_data WHERE url LIKE {url}")
	void queryByUrl(String url, ListCallback<WebSocketObject> callback);
	
	@Select("SELECT * FROM websocket_data WHERE url = {url}")
	void getByUrl(String url, ListCallback<WebSocketObject> callback);
}
