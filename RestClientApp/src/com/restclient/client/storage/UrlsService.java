package com.restclient.client.storage;

import java.util.Date;

import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.Select;
import com.google.code.gwt.database.client.service.Update;
import com.google.code.gwt.database.client.service.VoidCallback;
/**
 * Web database sevise for Urls table.
 * @author jarrod
 *
 */
public interface UrlsService extends AppDatabase {
  /**
   * Create database table.
   * @param callback callback function
   */
  @Update("CREATE TABLE IF NOT EXISTS urls ("
      + "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
      + "time INTEGER, "
      + "url TEXT NOT NULL)")
  void initTable(VoidCallback callback);
  /**
   * Records a URL value, and obtains the ID of the inserted record.
   * @param url URL to save
   * @param upd update time {@link Date} object.
   * @param callback callback function
   */
  @Update("INSERT INTO urls (url,time) VALUES ({url},{upd.getTime()})")
  void insertLink(String url, Date upd, RowIdListCallback callback);
  /**
   * Update timestamp when URL has been used.
   * @param url to update
   * @param upd {@link Date} object
   * @param callback
   */
  @Update("UPDATE urls SET time = {upd.getTime()} WHERE ID = {id}")
  void updateTime(int id, Date upd,VoidCallback callback);
  /**
   * Returns all urls.
   * @param callback callback function
   */
  @Select("SELECT url FROM urls ORDER BY time")
  void getUrls(ListCallback<UrlRow> callback);
  /**
   * Returns all urls.
   * @param callback callback function
   */
  @Select("SELECT ID, url FROM urls WHERE url LIKE {input} ORDER BY time DESC")
  void getUrls(String input, ListCallback<UrlRow> callback);
//  /**
//   * Get count rows for given url.
//   * @param url url to check
//   * @param callback callback function
//   */
//  @Select("SELECT COUNT(*) FROM urls WHERE url LIKE {url}")
//  void getCountByUrl(String url, ScalarCallback<Integer> callback);
}
