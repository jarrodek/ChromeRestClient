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
package org.rest.client.place;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceTokenizer;

public class ImportExportPlace extends Place {
	
	private String placeToken = null;
	private boolean serverImport = false;
	private String appId = null;
	/**
	 * @param requestData
	 */
	public ImportExportPlace(String requestData){
		this.placeToken = requestData;
		
		if (requestData == null) {
			return;
		}
		if (requestData.startsWith("import/")) {
			serverImport = true;
			appId = requestData.substring(7);
		}
	}
	
	public boolean isServerImport(){
		return serverImport;
	}
	
	public String getServerImportApplicationId(){
		return appId;
	}
	
	
	public String getToken(){
		return placeToken;
	}
	
	public static ImportExportPlace fromServerImport(String appId){
		return new ImportExportPlace("import/"+appId);
	}
	
	public static class Tokenizer implements PlaceTokenizer<ImportExportPlace> {

		@Override
		public String getToken(ImportExportPlace place) {
			return place.getToken();
		}

		@Override
		public ImportExportPlace getPlace(String token) {
			return new ImportExportPlace(token);
		}

	}
}
