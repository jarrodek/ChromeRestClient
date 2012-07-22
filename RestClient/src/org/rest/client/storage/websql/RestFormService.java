package org.rest.client.storage.websql;

import java.util.Collection;
import java.util.Date;

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
public interface RestFormService extends AppDatabase {
	
	/**
	 * Create database table. Schema: <code>name</code> - configuration name
	 * <code>url</code> - url for configuration (to display in select box)
	 * <code>data</code> - data to save (Rest params to string).
	 * <code>time</code> - insert time
	 * 
	 * @param callback
	 *            callback function
	 */
	@Update("CREATE TABLE IF NOT EXISTS rest_forms ("
			+ "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
			+ "name TEXT NOT NULL, " 
			+ "url TEXT, " 
			+ "data TEXT, "
			+ "time INTEGER)")
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
	@Update("INSERT INTO rest_forms (name,url,data,time) VALUES ({name},{url},{config},{dt.getTime()})")
	void insertData(String name, String url, String config, Date dt,
			RowIdListCallback callback);

	@Update(sql = "INSERT INTO rest_forms (name,url,data,time) VALUES ({_.getName()},{_.getUrl()},{_.getData()},{dt.getTime()})", foreach = "data")
	void insertImportData(Collection<RestForm> data, Date dt, RowIdListCallback callback);
	
	/**
	 * @param callback
	 */
	@Select("SELECT * FROM rest_forms ORDER BY name")
	void getAllData(ListCallback<RestForm> callback);

	@Select("SELECT * FROM rest_forms WHERE name = {name}")
	void getByName(String name, ListCallback<RestForm> callback);
	
	/**
	 * @param id
	 * @param name
	 * @param callback
	 */
	@Update("UPDATE rest_forms SET name = {name} WHERE ID = {id}")
	void updateItemName(int id, String name, VoidCallback callback);

	/**
	 * @param id
	 * @param callback
	 */
	@Update("DELETE FROM rest_forms WHERE ID = {id}")
	void deleteItem(int id, VoidCallback callback);
	
	@Update("DELETE FROM rest_forms WHERE name = {name}")
	void deleteByName(String name, VoidCallback callback);
	
	@Update("UPDATE rest_forms SET data = {data}, time = {current.getTime()} WHERE ID = {id}")
	void updateFormData(int id, String data, Date current, VoidCallback callback);
}
