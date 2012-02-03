package com.restclient.client;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.xhr2.client.RequestHeader;
import com.restclient.client.request.RequestParameters;
import com.restclient.client.storage.FilesObject;

/**
 * An history item restored from local storage.
 * 
 * <p>
 * When submitting an request each parameters are stored into local storage as
 * list. This class represents list item.
 * </p>
 * <p>
 * This class is similar to {@link RequestParameters} - have same fields plus
 * additional fields to determine history order;
 * </p>
 * 
 * @author jarrod
 * 
 */
public class RequestHistoryItem implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * String with POST parameters. NULL if request is not POST or PUT request.
	 */
	private String postData = null;
	/**
	 * URL to request.
	 */
	private String requestUrl = null;
	/**
	 * Headers to send;
	 */
	private List<RequestHeader> headers = null;
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
	 * Timestamp when this object has been updated last time. 
	 */
	private long updated = 0;
	
	
	/**
	 * Constructor to create new history item.
	 */
	public RequestHistoryItem(){}
	/**
	 * Constructor to create new history item from JSON data.
	 * @param data - restored and parsed to JSONObject data
	 */
	public RequestHistoryItem(JSONValue data){
		if (data == null) {
			return;
		}
		JSONObject obj = data.isObject();
		if (obj == null) {
			return;
		}
		String url = Utils.getJsonString(obj, "url");
		if (url != null) {
			this.requestUrl = url;
		}
		String formEncoding = Utils.getJsonString(obj, "formEncoding");
		if (formEncoding != null) {
			this.formEncoding = formEncoding;
		}
		String post = Utils.getJsonString(obj, "post");
		if (post != null) {
			this.postData = post;
		}
		String method = Utils.getJsonString(obj, "method");
		if (method != null) {
			this.method = method;
		}
		JSONArray headersArray = obj.get("headers").isArray();
		if (headersArray != null) {
			List<RequestHeader> headers = new ArrayList<RequestHeader>();
			
			int cnt = headersArray.size();
			for (int i = 0; i < cnt; i++) {
				JSONValue _tmp = headersArray.get(i);
				if (_tmp == null) {
					continue;
				}
				JSONObject _data = _tmp.isObject();
				if (_data == null) {
					continue;
				}
				Set<String> keys = _data.keySet();
				if (keys.size() == 1) {
					String headerName = keys.iterator().next();
					JSONValue headerValueJs = _data.get(headerName);
					if (headerValueJs == null) {
						continue;
					}
					JSONString _headerValueJS = headerValueJs.isString();
					String headerValue = _headerValueJS.stringValue();
					headers.add(new RequestHeader(headerName, headerValue));
				}
			}
			
			this.headers = headers;
		}
		JSONValue updatedValue = obj.get("updated");
		if( updatedValue != null ){
			JSONNumber updateObject = updatedValue.isNumber();
			if(updateObject != null){
				this.updated = (long) updateObject.doubleValue();
			}
		}
	}

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
	 * @return the headers
	 */
	public List<RequestHeader> getHeaders() {
		return headers;
	}


	/**
	 * @param headers the headers to set
	 */
	public void setHeaders(List<RequestHeader> headers) {
		this.headers = headers;
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
	 * @return the updated
	 */
	public long getUpdated() {
		return updated;
	}


	/**
	 * @param updated the updated to set
	 */
	public void setUpdated(long updated) {
		this.updated = updated;
	}
	
	@Override
	public String toString() {
		JSONObject data = this.toJSON();
		return data.toString();
	}
	
	
	/**
	 * @return history item values into JSON object
	 */
	public JSONObject toJSON(){
		JSONObject data = new JSONObject();
		JSONString url = this.requestUrl == null ? new JSONString("null")
				: new JSONString(requestUrl);
		data.put("url", url);
		JSONString post = this.postData == null ? new JSONString("null")
				: new JSONString(postData);
		data.put("post", post);
		JSONString method = this.method == null ? new JSONString("null")
				: new JSONString(this.method);
		data.put("method", method);
		data.put("formEncoding", new JSONString(this.formEncoding));
		JSONArray headersArray = new JSONArray();
		if (headers != null) {
			for( RequestHeader header : headers){
				if(header == null) continue;
				JSONObject headerObject = new JSONObject();
				headerObject.put(header.getName(), new JSONString(header.getValue()));
				headersArray.set(headersArray.size(), headerObject);
			}
		}
		data.put("headers", headersArray);
		
		JSONNumber updated = this.updated == 0 ? new JSONNumber(new Date().getTime())
		: new JSONNumber(this.updated);
		data.put("updated", updated);
		return data;
	}
}
