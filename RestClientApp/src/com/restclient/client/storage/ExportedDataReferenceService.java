package com.restclient.client.storage;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.ScalarCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;
import com.google.code.gwt.database.client.service.VoidCallback;

import java.util.Collection;
import java.util.List;

/**
 * Service for database connection with ID of RestForms that already has been
 * sent to application sever
 * 
 * @author Paweł Psztyć
 * 
 */
public interface ExportedDataReferenceService extends AppDatabase {
	/**
	 * Create database table. <br>
	 * Schema: <br>
	 * <code>reference_id</code> - ID of form state from rest_forms table
	 * <code>type</code> - default "form" for future use.
	 * 
	 * @param callback
	 *            callback function
	 */
	@Update("CREATE TABLE IF NOT EXISTS exported ("
			+ "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
			+ "reference_id INTEGER NOT NULL, "
			+ "type TEXT default 'form')")
	void initTable(VoidCallback callback);

	/**
	 * Insert data.
	 * 
	 * @param data
	 * @param callback
	 *            callback function
	 */
	@Update(sql = "INSERT INTO exported (reference_id,type) VALUES ({_.getReferenceId()},{_.getType()})", foreach = "data")
	void insertExported(Collection<ExportedDataInsertItem> data,
			VoidCallback callback);
	/**
	 * @param idsList
	 * @param callback
	 */
	@Select("SELECT * FROM exported WHERE reference_id IN ({idsList})")
	void getExportedByReferenceId(List<Integer> idsList, ListCallback<ExportedDataItem> callback);
	
	@Select("SELECT COUNT(*) FROM exported")
	void countExported(ScalarCallback<Integer> callback);
}
