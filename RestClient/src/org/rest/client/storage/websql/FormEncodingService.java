package org.rest.client.storage.websql;


import org.rest.client.storage.store.objects.FormEncodingObject;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;

/**
 * Class to handle connection to "rest form" database table.
 * 
 * @author Paweł Psztyć
 * 
 */
public interface FormEncodingService extends AppDatabase {
	
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
