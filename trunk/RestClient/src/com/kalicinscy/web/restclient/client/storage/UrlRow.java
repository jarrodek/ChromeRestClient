package com.kalicinscy.web.restclient.client.storage;

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;
/**
 * Class representing single row of URLs database table.
 * @author jarrod
 *
 */
public class UrlRow extends JavaScriptObject {
  /**
   * Empty.
   */
  protected UrlRow() {
  }
  /**
   * Return url field.
   * @return url string
   */
  public final String getUrl() {
    return this._getUrl();
  }
  public final int getId(){
    return this._getId();
  }
  
  public final double getTime(){
	  double time = 0;
	  try{
		  time = _getTime();
	  } catch( JavaScriptException e){}
	  return time;
  }
  /**
   * Native getUrl.
   * @return url string
   */
  private native String _getUrl()/*-{
    return this.url;
  }-*/;
  public final native double _getTime()/*-{
	  return this.time;
  }-*/;
  private native int _getId()/*-{
  	//$wnd.console.log(this,this.ID,this.id);
    return this.id;
  }-*/;
}
