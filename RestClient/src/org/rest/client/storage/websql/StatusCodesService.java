package org.rest.client.storage.websql;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.Select;

/**
 * Service for database connection with statusCodes table
 * 
 * @author jarrod
 * 
 */
public interface StatusCodesService extends AppDatabase {

	/**
	 * @param code
	 * @param callback
	 */
	@Select("SELECT * FROM statuses WHERE code = {code}")
	void getCode(int code, ListCallback<StatusCodeRow> callback);
}
