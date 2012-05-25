/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.request;

import java.util.ArrayList;

import com.google.gwt.http.client.URL;
import com.google.gwt.regexp.shared.RegExp;

public class RequestPayloadParser {
	/**
	 * Parse list of Payload form values {@link FormPayloadData} to Payload string
	 * @param v
	 * @return
	 */
	public static String parseData(ArrayList<FormPayloadData> input){
		if(input == null) return "";
    	String result = "";
    	
    	for(FormPayloadData item : input){
    		if(!result.isEmpty()){
                result += "&";
            }
    		
    		String key = item.getKey();
            String value = item.getValue();
            if(!(key.trim().equals("") && value.trim().equals(""))){
            	result += URL.encodeQueryString(key.trim());
            	result += "=";
            	result += URL.encodeQueryString(value.trim());
            }
    	}
        return result;
	}
	
	/**
	 * Old bodyToListValues method
	 * @param input
	 * @return
	 */
	public static ArrayList<FormPayloadData> payloadToList(String input){
		ArrayList<FormPayloadData> result = new ArrayList<FormPayloadData>();
		if( input == null ){
    		return result;
    	}
		String[] dataList = input.split("[\r\n]");
		int len = dataList.length;
		for(int i = 0; i < len; i++){
			result.addAll(stringToFormArrayList(dataList[i]));
		}
		return result;
	}
	
	
	/**
	 * Parse application/x-www-form-urlencoded form entity body to {@link FormPayloadData} object
	 * 
	 * Old parseBodyData method
	 * 
	 * @param input
	 * @return
	 */
	public static ArrayList<FormPayloadData> stringToFormArrayList(String input){
		ArrayList<FormPayloadData> result = new ArrayList<FormPayloadData>();
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
    	if(!htmlInputCheck.test(input)){
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
                FormPayloadData fpd = new FormPayloadData();
                fpd.setKey(name);
                fpd.setValue(value);
                result.add(fpd);
            } catch(Exception e){}
        }
        return result;
	}
	/**
	 * Parse raw body data to decoded entity body string for application/x-www-form-urlencoded encoding.
	 * Old parseUrlencodedEntiti method
	 * @param data
	 * @return
	 */
	public static String parseUrlEncodedEntity(String data){
		if(data == null || data.equals("")) return "";
    	
    	ArrayList<FormPayloadData> list = new ArrayList<FormPayloadData>(); 
    	String[] spl = data.split("&");
    	int len = spl.length;
		for(int i = 0; i < len; i++){
			list.addAll(stringToFormArrayList(spl[i]));
		}
		String result = "";
		for(FormPayloadData item : list){
			String key = item.getKey();
            String value = item.getValue();
            if( !result.isEmpty() ){
                result += "&";
            }
            if( !(key.trim().equals("") && value.trim().equals("")) ){
            	result += URL.decodeQueryString(key.trim());
            	result += "=";
            	result += URL.decodeQueryString(value.trim());
            }
		}
		return result;
	}
}
