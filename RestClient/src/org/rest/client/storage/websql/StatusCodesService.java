package org.rest.client.storage.websql;

import java.util.Collection;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;

/**
 * Service for database connection with statusCodes table
 * 
 * @author jarrod
 * 
 */
public interface StatusCodesService extends AppDatabase {

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
