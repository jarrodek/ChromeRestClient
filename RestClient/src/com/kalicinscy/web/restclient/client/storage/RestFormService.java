package com.kalicinscy.web.restclient.client.storage;

import java.util.Date;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;
import com.google.code.gwt.database.client.service.VoidCallback;

public interface RestFormService extends AppDatabase {
	/**
	   * Create database table.
	   * Schema:
	   * <code>name</code> - config name
	   * <code>url</code> - url for config (to display in select box)
	   * <code>data</code> - data to save (Rest params to string).
	   * <code>time</code> - insert time
	   * @param callback callback function
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
	   * @param name 
	   * @param url
	   * @param config data to save. See {@link RequestParameters#toString()}
	   * @param dt {@link Date} object. SQLite do not support date/time objects.
	   * @param callback
	   */
	  @Update("INSERT INTO rest_forms (name,url,data,time) VALUES ({name},{url},{config},{dt.getTime()})")
	  void insertData(String name, String url, String config, Date dt, RowIdListCallback callback);
	  
	  @Select("SELECT * FROM rest_forms ORDER BY name")
	  void getAllData(ListCallback<RestFormJS> callback);
	  
	  @Update("UPDATE rest_forms SET name = {name} WHERE ID = {id}")
	  void updateItemName(int id, String name,VoidCallback callback);
	  
	  @Update("DELETE FROM rest_forms WHERE ID = {id}")
	  void deleteItem(int id, VoidCallback callback);
}
