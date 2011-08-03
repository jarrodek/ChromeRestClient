package com.restclient.client.request;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Set;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.http.client.URL;

/**
 *
 * @author jarrod
 */
public class RequestDataFormatter {

    public static LinkedHashMap<String, String> parseHeaders(String input){
        if (input.equals("")) {
            return null;
        }
        LinkedHashMap<String, String> result = new LinkedHashMap<String, String>();
        String[] headers = input.split("[\r\n]");
        for (String h : headers) {
            String[] _tmp = h.split("[:|\r\n]", 2);
            if (_tmp.length == 2) {
                result.put( _tmp[0].trim(), _tmp[1].trim());
            }
        }
        return result;
    }
    
    public static String headersToString(LinkedHashMap<String, String> headers){
    	String result = "";
    	Set<String> set = headers.keySet();
		Iterator<String> it = set.iterator();
		while(it.hasNext()){
			if( !result.equals("") ){
				result += "\n";
			}
			String item = it.next();
			String value = headers.get(item);
			if( !(item.trim().equals("") && value.trim().equals("")) ){
				result += item+": "+headers.get(item);
			}
		}
		return result;
    }

    public static String parseData(LinkedHashMap<String, String> input){
    	if( input == null ) return "";
    	String result = "";
    	Set<String> keys = input.keySet();
        Iterator<String> it = keys.iterator();
        while(it.hasNext()){
            if( !result.isEmpty() ){
                result += "&";
            }
            String key = it.next();
            String value = input.get(key);
            if( !(key.trim().equals("") && value.trim().equals("")) ){
            	result += URL.encodeQueryString(key.trim());
            	result += "=";
            	result += URL.encodeQueryString( value.trim() );
            	//result += key.trim()+"="+value.trim();
            }
        }
        return result;
    }
    public static LinkedHashMap<String, String> parseDataToHashMap(String input){
    	if( input == null ){
    		return null;
    	}
    	String[] dataList = input.split("[\r\n]");
    	LinkedHashMap<String, String> _tmpResult = null;
    	if( dataList.length == 1 ){
            _tmpResult = parseQueryString(dataList[0]);
        } else {
            _tmpResult = parseQueryString(dataList);
        }
    	return _tmpResult;
    }
    
    public static String parseData(String input){
    	Log.debug("parseData: "+input);
        if (input.equals("")) {
            return "";
        }
        String result = "";
        LinkedHashMap<String, String> _tmpResult = parseDataToHashMap(input);        
        if( _tmpResult.isEmpty() ){
            return "";
        }
        result = parseData(_tmpResult);
        return result;
    }
    /**
     * Parse application/x-www-form-urlencoded form entity body to key => value pairs.
     * 
     * @param input
     * @return
     */
    public static LinkedHashMap<String, String> parseQueryString(String input){
    	LinkedHashMap<String, String> result = new LinkedHashMap<String, String>();

        String[] list = input.split("&");
        for( String param : list ){
            String[] _tmp = param.split("=");
            if( _tmp.length != 2 ){
            	continue;
            }
            
            try{
            	
            	String key = URL.decodeQueryString(_tmp[0].trim());
                String value = URL.decodeQueryString(_tmp[1].trim());
                result.put(key, value);
            	
            } catch(Exception e){}
        }

        return result;
    }

    public static LinkedHashMap<String, String> parseQueryString(String[] input){
    	LinkedHashMap<String, String> result = new LinkedHashMap<String, String>();
        for (String dataLine : input) {
            String[] _tmp = dataLine.split("[=|\r\n]", 2);
            if (_tmp.length == 2) {
                try{
                	String key = URL.decodeQueryString(_tmp[0].trim());
                    String value = URL.decodeQueryString(_tmp[1].trim());
                    result.put(key, value);
                } catch(Exception e){}
            }
        }
        return result;
    }
    /**
     * Parse raw body data to decoded entiti body string for application/x-www-form-urlencoded encoding.
     * @param data
     * @return
     */
    public static String parseUrlencodedEntiti(String data){
    	if( data == null || data.equals("") ) return "";
    	
    	LinkedHashMap<String, String> list = parseQueryString(data.split("&"));
    	String result = "";
    	Set<String> set = list.keySet();
		Iterator<String> it = set.iterator();
		while(it.hasNext()){
            String key = it.next();
            String value = list.get(key);
            
            if( !result.isEmpty() ){
                result += "&";
            }
            
            if( !(key.trim().equals("") && value.trim().equals("")) ){
            	result += URL.decodeQueryString(key.trim());
            	result += "=";
            	result += URL.decodeQueryString( value.trim() );
            }
		}
		return result;
    }
    
}
