package org.rest.client.storage.websql;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;
import com.google.code.gwt.database.client.service.VoidCallback;

import java.util.Collection;

/**
 * Service for database connection with statusCodes table
 * 
 * @author jarrod
 * 
 */
public interface StatusCodesService extends AppDatabase {
	/**
	 * Create database table. Schema: <code>code</code> - code ID
	 * <code>label</code> - label for code (response text) <code>desc</code> -
	 * long desc for code
	 * 
	 * @param callback
	 *            callback function
	 */
	@Update("CREATE TABLE IF NOT EXISTS statuses ("
			+ "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
			+ "code INTEGER NOT NULL, " + "label TEXT, " + "desc TEXT)")
	void initTable(VoidCallback callback);

	/**
	 * Insert header data.
	 * @param codeList 
	 * @param callback
	 *            callback function
	 */
	@Update(sql = "INSERT INTO statuses (code,label,desc) VALUES ({_.getCode()},{_.getLabel()},{_.getDesc()})", foreach = "codeList")
	void insertCodes(Collection<StatusCodeRow> codeList,
			RowIdListCallback callback);

	/**
	 * @param code
	 * @param callback
	 */
	@Select("SELECT * FROM statuses WHERE code = {code}")
	void getCode(int code, ListCallback<StatusCodeRow> callback);
}
