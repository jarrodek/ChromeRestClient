package org.rest.client.storage.websql;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.ScalarCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;
import com.google.code.gwt.database.client.service.VoidCallback;

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
			+ "gaeKey TEXT, "
			+ "type TEXT default 'form')")
	void initTable(VoidCallback callback);

	/**
	 * Insert data.
	 * 
	 * @param databaseSave
	 * @param callback
	 *            callback function
	 */
	@Update(sql = "INSERT INTO exported (reference_id, gaeKey, type) VALUES ({_.getReferenceId()},{_.getGaeKey()},{_.getType()})", foreach = "data")
	void insertExported(List<ExportedDataInsertItem> data,
			VoidCallback callback);
	/**
	 * @param idsList
	 * @param callback
	 */
	@Select("SELECT * FROM exported WHERE reference_id IN ({idsList}) AND type='form'")
	void getExportedFormByReferenceId(List<Integer> idsList, ListCallback<ExportedDataItem> callback);
	/**
	 * Find row by request object item ID.
	 * @param restFormId referenced ID
	 * @param callback
	 */
	@Select("SELECT * FROM exported WHERE reference_id = {restFormId} AND type='form'")
	void findFormByReferenceId(int restFormId, ListCallback<ExportedDataItem> callback);
	
	@Select("SELECT COUNT(*) FROM exported AND type='form'")
	void countExportedRestForms(ScalarCallback<Integer> callback);
}
