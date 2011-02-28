package com.kalicinscy.web.restclient.client.storage;

public class LocalStorage {
  private static LocalStorage instance = new LocalStorage();
  
  private LocalStorage(){
    
  }
  
  private static LocalStorage getInstance(){
    return instance;
  }
  
  public static String getValue(String key){
    return getInstance().get(key);
  }
  private native String get(String key)/*-{
    return $wnd.localStorage.getItem(key);
  }-*/;
  public static void removeValue(String key){
    getInstance().remove(key);
  }
  private native void remove(String key)/*-{
    $wnd.localStorage.removeItem(key);
  }-*/;
  public static void setValue(String key, String value){
    getInstance().set(key, value);
  }
  private native void set(String key, String value)/*-{
    return $wnd.localStorage.setItem(key, value);
  }-*/;
  
  
  public static void clearStorage(){
    getInstance().clear();
  }
  private native void clear()/*-{
    $wnd.localStorage.clear();
  }-*/;
}
