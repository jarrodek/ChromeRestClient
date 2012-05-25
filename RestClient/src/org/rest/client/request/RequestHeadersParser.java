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
import java.util.List;

import com.google.gwt.xhr2.client.RequestHeader;

public class RequestHeadersParser {
	
	/**
	 * Parse {@link RequestHeader} list into string representation of headers.
	 * @param headers
	 * @return parsed string ready to send with request
	 */
	public static String headersListToString(List<RequestHeader> headers){
		String result = "";
    	
		for(RequestHeader header : headers){
    		if(!result.equals("")){
				result += "\n";
			}
    		String item = header.getName();
			String value = header.getValue();
			if(!(item.trim().equals("") && value.trim().equals(""))){
				result += item+": "+value;
			}
    	}
		return result;
	}
	
	/**
     * Parse HTTP headers string into list of {@link RequestHeader}
     * @param input headers string either from request as all headers response or from saved string
     * @return list of headers as {@link RequestHeader}
     */
	public static ArrayList<RequestHeader> stringToHeaders(String input){
		ArrayList<RequestHeader> result = new ArrayList<RequestHeader>();
		if (input == null || input.equals("")) {
            return result;
        }
		String[] headers = input.split("[\r\n]");
        for (String h : headers) {
        	String[] _tmp = h.split("[:|\r\n]", 2);
            if (_tmp.length > 0) {
            	RequestHeader _h = new RequestHeader(_tmp[0].trim(), null);
            	if (_tmp.length > 1) {
            		_h.setValue(_tmp[1].trim());
            	}
            	result.add(_h);
            }
        }
		
		return result;
	}
}
