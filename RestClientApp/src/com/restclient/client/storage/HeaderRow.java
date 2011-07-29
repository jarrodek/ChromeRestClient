package com.restclient.client.storage;

import com.google.gwt.core.client.JavaScriptObject;
/**
 * Class representing database header table row.
 * @author jarrod
 *
 */
public class HeaderRow extends JavaScriptObject {
  /**
   * Const.
   */
  protected HeaderRow(){
  }
  /**
   * Get name field.
   * @return
   */
  public final String getName(){
    return this._getName();
  }
  private native String _getName()/*-{
    return this.name;
  }-*/;
  /**
   * Get desc field.
   * @return
   */
  public final String getDesc(){
    return this._getDesc();
  }
  private native String _getDesc()/*-{
    return this.desc;
  }-*/;
  /**
   * Get example field.
   * @return
   */
  public final String getExample(){
    return this._getExample();
  }
  private native String _getExample()/*-{
    return this.example;
  }-*/;
  /**
   * Get type field.
   * @return
   */
  public final String getType(){
    return this._getType();
  }
  private native String _getType()/*-{
    return this.type;
  }-*/;
}
