package org.rest.client.storage.websql;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;
import com.google.code.gwt.database.client.service.VoidCallback;

import java.util.Collection;
import java.util.List;

/**
 * Service for database connection with headers table
 * 
 * @author Paweł Psztyć
 * 
 */
public interface HeadersService extends AppDatabase {
	/**
	 * Create database table. Schema: <code>name</code> - header name
	 * <code>desc</code> - header long desc <code>example</code> - example
	 * <code>type</code> - request or response ONLY!
	 * 
	 * @param callback
	 *            callback function
	 */
	@Update("CREATE TABLE IF NOT EXISTS headers ("
			+ "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
			+ "name TEXT NOT NULL, " + "desc TEXT, " + "example TEXT, "
			+ "type TEXT)")
	void initTable(VoidCallback callback);

	/**
	 * Insert header data.
	 * @param headersList 
	 * @param callback
	 *            callback function
	 */
	@Update(sql = "INSERT INTO headers (name,desc,example,type) VALUES ({_.getName()},{_.getDesc()},{_.getExample()},{_.getType()})", foreach = "headersList")
	void insertHeaders(Collection<HeaderRow> headersList,
			RowIdListCallback callback);
	/**
	 * Insert header data.
	 * @param header to insert 
	 * @param callback
	 *            callback function
	 */
	@Update(sql = "INSERT INTO headers (name,desc,example,type) VALUES ({header.getName()},{header.getDesc()},{header.getExample()},{header.getType()})")
	void insertHeader(HeaderRow header, RowIdListCallback callback);

	/**
	 * Returns all header names.
	 * @param input 
	 * 
	 * @param callback
	 *            callback function
	 */
	@Select("SELECT name FROM headers WHERE name LIKE {input}")
	void getNames(String input, ListCallback<HeaderRow> callback);
	/**
	 * Returns all header names for request.
	 * @param input 
	 * 
	 * @param callback
	 *            callback function
	 */
	@Select("SELECT name FROM headers WHERE name LIKE {input} AND type='request'")
	void getRequestNames(String input, ListCallback<HeaderRow> callback);
	
	/**
	 * @param headersList
	 * @param callback
	 */
	@Select("SELECT * FROM headers WHERE name IN ({headersList}) AND type='response'")
	void getResponseHeaders(List<String> headersList, ListCallback<HeaderRow> callback);

	
	/**
	 * @param headersList
	 * @param callback
	 */
	@Select("SELECT * FROM headers WHERE name IN ({headersList}) AND type='request'")
	void getRequestHeaders(List<String> headersList, ListCallback<HeaderRow> callback);
	
	/**
	 * @param headersList
	 * @param type
	 * @param callback
	 */
	@Select("SELECT * FROM headers WHERE name LIKE {headersList} AND type LIKE {type}")
	void getHeader(String headersList, String type, ListCallback<HeaderRow> callback);
}
