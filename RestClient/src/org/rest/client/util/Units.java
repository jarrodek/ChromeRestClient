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
package org.rest.client.util;

public class Units {
	
	public static String swithFileSize(long bytes){
		String[] units = {"b","B","KB","MB","GB","TB"}; 
		long _result = bytes;
		String result = "";
		
		for(int i=0; i<units.length; i++){
			if(_result > 1024){
				_result = _result/1024;
			} else {
				result = _result + " " + units[i];
				break;
			}
		}
		
		return result;
	}
}
