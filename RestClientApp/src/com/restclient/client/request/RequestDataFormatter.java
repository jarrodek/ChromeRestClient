package com.restclient.client.request;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.http.client.URL;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.xhr2.client.RequestHeader;
import com.restclient.client.widgets.BodyFormWidget;
import com.restclient.client.widgets.BodyFormWidget.BodyFormValue;

/**
 *
 * @author jarrod
 */
public class RequestDataFormatter {

    /**
     * Parse HTTP headers string into list of {@link RestHeader}
     * @param input headers string either from request as all headers response or from saved string
     * @return list of headers as {@link RestHeader}
     */
	public static List<RequestHeader> parseHeaders(String input){
        if (input.equals("")) {
            return null;
        }
        List<RequestHeader> result = new ArrayList<RequestHeader>();
        
        String[] headers = input.split("[\r\n]");
        for (String h : headers) {
            String[] _tmp = h.split("[:|\r\n]", 2);
            if (_tmp.length == 2) {
            	result.add(new RequestHeader(_tmp[0].trim(), _tmp[1].trim()));
            }
        }
        return result;
    }
    
    /**
     * Parse headers list into HTTP ready to send string
     * @param list List of {@link RestHeader} objects
     * @return
     */
	public static String headersToString(List<RequestHeader> list){
		String result = "";
    	for( RequestHeader header : list ){
    		if( !result.equals("") ){
				result += "\n";
			}
    		String item = header.getName();
			String value = header.getValue();
			if( !(item.trim().equals("") && value.trim().equals("")) ){
				result += item+": "+value;
			}
    	}
		return result;
    }

    /**
     * Parse list of BODY form values into BODY string
     * @param input
     * @return Request BODY value
     */
	public static String parseData(List<BodyFormWidget.BodyFormValue> input){
    	if( input == null ) return "";
    	String result = "";
    	for(BodyFormValue item : input){
    		if( !result.isEmpty() ){
                result += "&";
            }
    		String key = item.getName();
            String value = item.getValue();
            if( !(key.trim().equals("") && value.trim().equals("")) ){
            	result += URL.encodeQueryString(key.trim());
            	result += "=";
            	result += URL.encodeQueryString(value.trim());
            }
    	}
        return result;
    }
    /**
     * Parse string value to list of form params.
     * @param input
     * @return
     */
	public static List<BodyFormWidget.BodyFormValue> bodyToListValues(String input){
		List<BodyFormWidget.BodyFormValue> result = new ArrayList<BodyFormWidget.BodyFormValue>();
		if( input == null ){
    		return result;
    	}
		String[] dataList = input.split("[\r\n]");
		int len = dataList.length;
		for(int i = 0; i < len; i++){
			result.addAll(parseBodyData(dataList[i]));
		}
		return result;
	}
	/**
	 * Parse application/x-www-form-urlencoded form entity body to {@link BodyFormWidget.BodyFormValue} object
	 * @param data
	 * @return
	 */
	public static List<BodyFormWidget.BodyFormValue> parseBodyData(String input){
		List<BodyFormWidget.BodyFormValue> result = new ArrayList<BodyFormWidget.BodyFormValue>();
    	/**
    	 * Chrome inspector has FormData output like:
    	 * key:value
    	 * key:value
    	 * and so on.
    	 * When copying from inspector parse data to create proper form data.
    	 * 
    	 * But first check if it is not regular form data input.
    	 * 
    	 * @TODO: check other inputs that contain ":" in it.
    	 */
    	RegExp htmlInputCheck = RegExp.compile("^([^\\=]{1,})=(.*)$","m");
    	if( !htmlInputCheck.test(input) ){
	    	RegExp r = RegExp.compile("^([^\\:]{1,}):(.*)$", "gm");
	    	input = r.replace(input, "$1=$2&");
	    	if(input.endsWith("&")){
	    		input = input.substring(0, input.length()-1);
	    	}
    	}
        String[] list = input.split("&");
        for( String param : list ){
            String[] _tmp = param.split("=",2);
            if( _tmp.length != 2 ){
            	continue;
            }
            
            try{
            	String name = URL.decodeQueryString(_tmp[0].trim());
                String value = URL.decodeQueryString(_tmp[1].trim());
                result.add(new BodyFormWidget.BodyFormValue(name, value));
            } catch(Exception e){}
        }
        return result;
	}
    
    /**
     * Parse raw body data to decoded entity body string for application/x-www-form-urlencoded encoding.
     * @param data
     * @return
     */
    public static String parseUrlencodedEntiti(String data){
    	if( data == null || data.equals("") ) return "";
    	
    	List<BodyFormWidget.BodyFormValue> list = new ArrayList<BodyFormWidget.BodyFormValue>(); 
    	String[] spl = data.split("&");
    	int len = spl.length;
		for(int i = 0; i < len; i++){
			list.addAll(parseBodyData(spl[i]));
		}
		String result = "";
		for(BodyFormWidget.BodyFormValue item : list){
			String key = item.getName();
            String value = item.getValue();
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