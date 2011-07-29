package com.kalicinscy.web.restclient.client.request;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Set;

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
			result += item+": "+headers.get(item);
		}
		return result;
    }

    public static String parseData(LinkedHashMap<String, String> input){
    	String result = "";
    	Set<String> keys = input.keySet();
        Iterator<String> it = keys.iterator();
        while(it.hasNext()){
            if( !result.isEmpty() ){
                result += "&";
            }
            String key = it.next();
            String value = input.get(key);
            result += key.trim()+"="+value.trim();
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

    public static LinkedHashMap<String, String> parseQueryString(String input){
    	LinkedHashMap<String, String> result = new LinkedHashMap<String, String>();

        String[] list = input.split("&");
        for( String param : list ){
            String[] _tmp = param.split("=");
            if( _tmp.length == 2 ){
            String value = _tmp[1];
	            try{
	                value = URL.encode(value.trim());
	                result.put(_tmp[0].trim(), value);
	            } catch(Exception e){}
            }
        }

        return result;
    }

    public static LinkedHashMap<String, String> parseQueryString(String[] input){
    	LinkedHashMap<String, String> result = new LinkedHashMap<String, String>();
        for (String dataLine : input) {
            String[] _tmp = dataLine.split("[=|\r\n]", 2);
            if (_tmp.length == 2) {
                try{
                    String value = URL.encode(_tmp[1].trim());
                    result.put(_tmp[0].trim(), value);
                } catch(Exception e){}
            }
        }
        return result;
    }
}
