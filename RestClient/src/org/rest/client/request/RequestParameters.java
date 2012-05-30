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

import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.storage.store.objects.RequestObject;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;

public class RequestParameters {
	/**
	 * String with POST parameters. NULL if request is not POST or PUT request.
	 */
	private String postData = null;
	/**
	 * URL to request.
	 */
	private String requestUrl = null;
	/**
	 * Request method name. Default it's always GET
	 */
	private String method = "GET";
	/**
	 * Post form data encoding. Default application/x-www-form-urlencoded.
	 */
	private String formEncoding = "application/x-www-form-urlencoded";
	/**
	 * NOT PERSISTANT VALUE! This data will not be stored in Storage! It is a
	 * file objects from input file form.
	 */
	private List<FilesObject> filesList = null;
	/**
	 * Headers to send;
	 */
	private String headers = null;
	
	
	
	
	/**
	 * @return the postData
	 */
	public String getPostData() {
		return postData;
	}




	/**
	 * @param postData the postData to set
	 */
	public void setPostData(String postData) {
		this.postData = postData;
	}




	/**
	 * @return the requestUrl
	 */
	public String getRequestUrl() {
		return requestUrl;
	}




	/**
	 * @param requestUrl the requestUrl to set
	 */
	public void setRequestUrl(String requestUrl) {
		this.requestUrl = requestUrl;
	}




	/**
	 * @return the method
	 */
	public String getMethod() {
		return method;
	}




	/**
	 * @param method the method to set
	 */
	public void setMethod(String method) {
		this.method = method;
	}




	/**
	 * @return the formEncoding
	 */
	public String getFormEncoding() {
		return formEncoding;
	}




	/**
	 * @param formEncoding the formEncoding to set
	 */
	public void setFormEncoding(String formEncoding) {
		this.formEncoding = formEncoding;
	}




	/**
	 * @return the filesList
	 */
	public List<FilesObject> getFilesList() {
		return filesList;
	}




	/**
	 * @param filesList the filesList to set
	 */
	public void setFilesList(List<FilesObject> filesList) {
		this.filesList = filesList;
	}




	/**
	 * @return the headers
	 */
	public String getHeaders() {
		return headers;
	}




	/**
	 * @param headers the headers to set
	 */
	public void setHeaders(String headers) {
		this.headers = headers;
	}



	/**
	 * 
	 * @param clientFactory
	 * @param callback
	 */
	public static void restoreLatest(final Callback<RequestParameters, Throwable> callback){
		
		final LocalStore store = RestClient.getClientFactory().getLocalStore();
		store.open(new StoreResultCallback<Boolean>() {
			
			@Override
			public void onSuccess(Boolean result) {
				if(!result){
					callback.onFailure(null);
					return;
				}
				store.getByKey(LocalStore.LATEST_REQUEST_KEY, new StoreResultCallback<String>() {
					
					@Override
					public void onSuccess(String result) {
						RequestParameters rp = new RequestParameters();
						if(result == null || result.isEmpty()){
							callback.onSuccess(rp);
							return;
						}
						try{
							RequestObject ro = RequestObject.fromString(result);
							rp.setFormEncoding(ro.getEncoding());
							rp.setHeaders(ro.getHeaders());
							rp.setMethod(ro.getMethod());
							rp.setPostData(ro.getPayload());
							rp.setRequestUrl(ro.getURL());
							callback.onSuccess(rp);
						} catch(Exception e){
							Log.error("Error perform getByKey.",e);
							callback.onFailure(e);
						}
					}
					
					@Override
					public void onError(Throwable e) {
						Log.error("Error perform getByKey.",e);
						callback.onFailure(e);
					}
				});
			}
			
			@Override
			public void onError(Throwable e) {
				callback.onFailure(e);
			}
		});
	}
}
