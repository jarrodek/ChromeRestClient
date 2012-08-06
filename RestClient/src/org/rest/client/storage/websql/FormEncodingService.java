package org.rest.client.storage.websql;


import org.rest.client.storage.store.objects.FormEncodingObject;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;
import com.google.code.gwt.database.client.service.VoidCallback;

/**
 * Class to handle connection to "rest form" database table.
 * 
 * @author Paweł Psztyć
 * 
 */
public interface FormEncodingService extends AppDatabase {
	
	/**
	 * Create database table. Schema: <code>name</code> - configuration name
	 * <code>url</code> - url for configuration (to display in select box)
	 * <code>data</code> - data to save (Rest params to string).
	 * <code>time</code> - insert time
	 * 
	 * @param callback
	 *            callback function
	 */
	@Update("CREATE TABLE IF NOT EXISTS form_encoding ("
			+ "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
			+ "encoding TEXT NOT NULL)")
	void initTable(VoidCallback callback);

	/**
	 * Insert new config value.
	 * 
	 * @param name
	 * @param url
	 * @param config
	 *            data to save. See {@link RequestParameters#toString()}
	 * @param dt
	 *            {@link Date} object. SQLite do not support date/time objects.
	 * @param callback
	 */
	@Update("INSERT INTO form_encoding (encoding) VALUES ({encoding.getEncoding()})")
	void put(FormEncodingObject encoding, RowIdListCallback callback);
	
	/**
	 * @param callback
	 */
	@Select("SELECT * FROM form_encoding ORDER BY encoding")
	void getAll(ListCallback<FormEncodingObject> callback);
}
