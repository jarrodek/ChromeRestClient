package org.rest.client.storage.websql;

import java.util.List;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.Select;

/**
 * Service for database connection with headers table
 * 
 * @author Paweł Psztyć
 * 
 */
public interface HeadersService extends AppDatabase {

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
