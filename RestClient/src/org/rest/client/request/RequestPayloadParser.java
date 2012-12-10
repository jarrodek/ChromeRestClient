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
	 * @param input
	 * @param encode if true params will be encoded
	 * @return
	 */
	public static String parseData(ArrayList<FormPayloadData> input, boolean encode, boolean useBoundary, String currentBoundary){
		if(useBoundary){
			return parseDataBoundary(input, encode, currentBoundary);
		}
		return parseDataMultipart(input, encode);
	}
	
	private static String parseDataMultipart(ArrayList<FormPayloadData> input, boolean encode){
		if(input == null || input.size() == 0) return "";
    	String result = "";
    	
    	for(FormPayloadData item : input){
    		if(!result.isEmpty()){
                result += "&";
            }
    		String key = item.getKey();
            String value = item.getValue();
            if(!(key.trim().equals("") && value.trim().equals(""))){
            	if(encode)
            		result += URL.encodeQueryString(key.trim());
            	else 
            		result += key.trim();
            	result += "=";
            	if(encode)
            		result += URL.encodeQueryString(value.trim());
            	else
            		result += value.trim();
            }
    	}
        return result;
	}
	
	
	public static String recognizeBoundary(String input){
		if(input == null || input.isEmpty()){
			return null;
		}
		String[] body = input.split("\n");
		int lines = body.length;
		if(lines == 0){
			return null;
		}
		
		
		for(int i=0; i<lines; i++){
			String line = body[i];
			if(line.startsWith("--")){
				if(line.endsWith("--")){ //it should not happen
					return null;
				}
				return line.substring(2);
			}
		}
		
		return null;
	}
	
	
	private static String parseDataBoundary(ArrayList<FormPayloadData> input, final boolean encode, String currentBoundary){
		if(input == null || input.size() == 0) return "";
    	
    	StringBuilder sb = new StringBuilder();
    	
    	final String boundary = currentBoundary == null ? "--ARCFormBoundary" + generateBoundary() : "--"+currentBoundary;
    	
    	for(FormPayloadData item : input){
    		String key = item.getKey();
            String value = item.getValue();
            if(key.trim().equals("") && value.trim().equals("")){
            	continue;
            }
            
            if(encode){
            	key = URL.encodeQueryString(key.trim());
            	value = URL.encodeQueryString(value.trim());
            } else { 
            	key = key.trim();
            	value = value.trim();
            }
    		
    		sb.append(boundary).append("\n");
    		sb.append("Content-Disposition: form-data; name=\"").append(key).append("\"").append("\n");
    		sb.append("\n");
    		sb.append(value).append("\n");
    		
    	}
    	sb.append(boundary).append("--").append("\n");
    	return sb.toString();
	}
	
	private static final native String generateBoundary() /*-{ return Math.random().toString(36).substring(3); }-*/;
	
	
	
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
		return stringToFormArrayList(input,false, false);
	}
	
	
	/**
	 * Parse application/x-www-form-urlencoded form entity body to {@link FormPayloadData} object
	 * 
	 * Old parseBodyData method
	 * 
	 * @param input
	 * @return
	 */
	public static ArrayList<FormPayloadData> stringToFormArrayList(String input, boolean decode, boolean useBoundary){
		if(useBoundary){
			return stringToFormArrayListBoundary(input, decode);
		}
		return stringToFormArrayListMultipart(input, decode);
	}
	
	
	public static ArrayList<FormPayloadData> stringToFormArrayListBoundary(String input, boolean decode){
		ArrayList<FormPayloadData> result = new ArrayList<FormPayloadData>();
		if(input == null || input.isEmpty()){
			return result;
		}
		String[] body = input.split("\n");
		int lines = body.length;
		if(lines == 0){
			return result;
		}
		
		FormPayloadData current = null;
		String currentValue = "";
		for(int i=0; i<lines; i++){
			String line = body[i];
			if(line.startsWith("--")){
				
				if(current != null){
					current.setValue(currentValue);
					result.add(current);
					current = new FormPayloadData();
					currentValue = "";
				}
				
				if(line.endsWith("--")){ //end of body
					break;
				}
				//begin part of body
				//just move to the next line
			} else if(line.toLowerCase().contains("content-disposition")){
				String fieldName = extractNameFromBoundaryLine(line);
				
				if(decode){
					fieldName = URL.decodeQueryString(fieldName.trim());
				}
				
				if(current == null){
					current = new FormPayloadData();
				}
				current.setKey(fieldName);
				i++;
				line = body[i];
				//next line should be empty, but check for misspelling 
				if(!line.isEmpty()){
					currentValue = line;
				}
			} else {
				
				if(!currentValue.isEmpty()){
					currentValue += "\n";
				}
				currentValue += line;
			}
		}
		return result;
	}
	
	private static final native String extractNameFromBoundaryLine(String line) /*-{
		var r = /\sname="(.*?)"/gim
		var result = "[unknown]";
		try{
			var m = r.exec(line);
			if(m && m.length > 1){
				result = m[1]; 
			}
		} catch(e){}
		
		return result;
	}-*/;
	
	public static ArrayList<FormPayloadData> stringToFormArrayListMultipart(String input, boolean decode){
		ArrayList<FormPayloadData> result = new ArrayList<FormPayloadData>();
		if(input == null || input.isEmpty()){
			return result;
		}
		/*
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
            	String name = decode ? URL.decodeQueryString(_tmp[0].trim()) : _tmp[0].trim();
                String value = decode ? URL.decodeQueryString(_tmp[1].trim()) : _tmp[1].trim();
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
