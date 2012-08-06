package org.rest.client.storage.websql;

import org.rest.client.storage.store.objects.ProjectObject;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;
import com.google.code.gwt.database.client.service.VoidCallback;

/**
 * New version of request data store. This store stores all requests data either
 * saved as project endpoint or regular request.
 * 
 * @author Paweł Psztyć
 * 
 */
public interface ProjectService extends AppDatabase {

	/**
	 * Create database table.
	 * 
	 * @param callback
	 *            callback function
	 */
	@Update("CREATE TABLE IF NOT EXISTS projects ("
			+ "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
			+ "name TEXT NOT NULL, " 
			+ "time INTEGER)")
	void initTable(VoidCallback callback);

	@Update("INSERT INTO projects (name, time) VALUES ("
			+ "{data.getName()},{data.getCreated()})")
	void insert(ProjectObject data, RowIdListCallback callback);
	
	@Select("SELECT * FROM projects WHERE ID = {id}")
	void get(int id, ListCallback<ProjectObject> result);
	
	@Select("SELECT * FROM projects WHERE 1")
	void all(ListCallback<ProjectObject> result);
}
