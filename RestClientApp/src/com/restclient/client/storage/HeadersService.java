package com.restclient.client.storage;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;
import com.google.code.gwt.database.client.service.VoidCallback;

import java.util.Collection;
import java.util.List;
/**
 * Service for database connection with headers table
 * @author jarrod
 *
 */
public interface HeadersService extends AppDatabase {
  /**
   * Create database table.
   * Schema:
   * <code>name</code> - header name
   * <code>desc</code> - header long desc
   * <code>example</code> - example
   * <code>type</code> - request or response ONLY!
   * @param callback callback function
   */
  @Update("CREATE TABLE IF NOT EXISTS headers ("
      + "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
      + "name TEXT NOT NULL, "
      + "desc TEXT, "
      + "example TEXT, "
      + "type TEXT)")
  void initTable(VoidCallback callback);
  /**
   * Insert header data.
   * @param url URL to save
   * @param callback callback function
   */
  @Update(sql="INSERT INTO headers (name,desc,example,type) VALUES ({_.getName()},{_.getDesc()},{_.getExample()},{_.getType()})", foreach="headersList")
  void insertHeaders(Collection<HeaderInsertRow> headersList, RowIdListCallback callback);
  /**
   * Returns all header names.
   * @param callback callback function
   */
  @Select("SELECT name FROM headers WHERE name LIKE {input}")
  void getNames(String input, ListCallback<HeaderRow> callback);
  
  @Select("SELECT * FROM headers WHERE name IN ({headersList})")
  void getHeaders(List<String> headersList, ListCallback<HeaderRow> callback);
  @Select("SELECT * FROM headers WHERE name LIKE {headersList}")
  void getHeader(String headersList, ListCallback<HeaderRow> callback);
}
