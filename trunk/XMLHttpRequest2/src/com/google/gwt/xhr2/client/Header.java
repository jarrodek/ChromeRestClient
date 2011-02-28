package com.google.gwt.xhr2.client;

/**
 * Class for describing an HTTP header.
 * 
 */
public abstract class Header {
  /**
   * Returns the name of the HTTP header.
   * 
   * @return name of the HTTP header 
   */
  public abstract String getName();
  
  /**
   * Returns the value of the HTTP header.
   * 
   * @return value of the HTTP header 
   */
  public abstract String getValue();
}