package com.kalicinscy.web.restclient.client.request;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.kalicinscy.web.restclient.client.events.FormEncodingChangeHandler;
import com.kalicinscy.web.restclient.client.events.HeadersChangedEvent;
import com.kalicinscy.web.restclient.client.events.HeadersChangedEventHandler;
import com.kalicinscy.web.restclient.client.events.MethodChangedEvent;
import com.kalicinscy.web.restclient.client.events.MethodChangedHandler;
import com.kalicinscy.web.restclient.client.events.PostDataChangedEvent;
import com.kalicinscy.web.restclient.client.events.PostDataChangedEventHandler;
import com.kalicinscy.web.restclient.client.events.UrlChangedEvent;
import com.kalicinscy.web.restclient.client.events.UrlChangedEventHandler;
import com.kalicinscy.web.restclient.client.storage.LocalStorage;
import com.kalicinscy.web.restclient.client.storage.RestForm;
import com.kalicinscy.web.restclient.client.ui.FilesForm.FilesObject;

public class RequestParameters {
	
	private static RequestParametersImpl impl = GWT.create( RequestParametersImpl.class );
	
	/**
	 * Store request parameters to local storage
	 */
	public void store() {
		LocalStorage.setValue("latestRequest", this.toString());
		//Log.debug(this.toString());
	}
	
	@Override
	public String toString() {
		JSONObject data = new JSONObject();
		JSONString url = this.requestUrl == null ? new JSONString("null"): new JSONString(requestUrl);
		data.put("url", url);
		JSONString post = this.postData == null ? new JSONString("null"): new JSONString(postData);
		data.put("post", post);
		JSONString method = this.method == null ? new JSONString("null"): new JSONString(this.method);
		data.put("method", method);
		data.put("formEncoding", new JSONString(this.formEncoding));
		JSONArray headersArray = new JSONArray();
		if( this.headers != null ){
			Set<String> keys = this.headers.keySet();
			Iterator<String> it = keys.iterator();
			while(it.hasNext()){
				String k = it.next();
				if( k.toLowerCase().equals("content-type") ){ //never store this value!
					continue;
				}
				JSONObject header = new JSONObject();
				header.put(k, new JSONString(this.headers.get(k)));
				headersArray.set(headersArray.size(), header);
			}
		}
		data.put("headers", headersArray);
		return data.toString();
	}
	
	private String getJsonStringData(JSONObject obj, String key){
		JSONValue keyObj = obj.get(key);
		if( keyObj == null ){
			return null;
		}
		JSONString keyJS = keyObj.isString();
		if( keyJS == null ){
			return null;
		}
		String value = keyJS.stringValue();
		if( !value.equals("null") ){
			return value;
		}
		return null;
	}
	
	
	public void restoreFromStorage(){
		String data = LocalStorage.getValue("latestRequest");
		restore(data,false);
	}
	
	public void restoreFromSavedState(RestForm data){
		String json = data.getData();
		restore(json,true);
		store();
	}
	
	/**
	 * Restore parameters from local storage.
	 */
	private void restore(String data, boolean fireEvents) {
		
		if(data == null) {
			return;
		}
		JSONValue value = JSONParser.parseLenient(data);
		if( value == null ){
			return;
		}
		JSONObject obj = value.isObject();
		if(obj==null) {
			return;
		}
		
		String url = getJsonStringData(obj,"url");
		if( url != null ){
			this.setUrl(url, false);
		}
		String formEncoding = getJsonStringData(obj,"formEncoding");
		if( formEncoding != null ){
			this.setFormEncoding(formEncoding);
		}
		String post = getJsonStringData(obj,"post");
		if( post != null ){
			this.setData(post, fireEvents);
		}
		String method = getJsonStringData(obj,"method");
		if( method != null ){
			this.setMethod(method);
		}
		
		JSONArray headersArray = obj.get("headers").isArray();
		if(headersArray != null) {
			LinkedHashMap<String, String> headers = new LinkedHashMap<String, String>();
			int cnt = headersArray.size();
			for( int i = 0; i<cnt; i++ ){
				JSONValue _tmp = headersArray.get(i);
				if( _tmp == null ){
					continue;
				}
				JSONObject _data = _tmp.isObject();
				if( _data == null ){
					continue;
				}
				Set<String> keys = _data.keySet();
				if( keys.size() == 1 ){
					String headerName = keys.iterator().next();
					JSONValue headerValueJs = _data.get( headerName );
					if( headerValueJs == null ){
						continue;
					}
					JSONString _headerValueJS = headerValueJs.isString();
					String headerValue = _headerValueJS.stringValue();
					//Log.debug( headerName + " : " + headerValue );
					headers.put(headerName, headerValue);
				}
			}
			this.headers = headers;
			if( fireEvents ){
				HeadersChangedEvent event = new HeadersChangedEvent(this.headers);
				impl.fireEvent(event);
			}
		}
	}
	
	//private fields
	/**
	 * String with POST parameters.
	 * NULL if request is not POST or PUT request.
	 */
	private String postData = null;
	/**
	 * URL to request.
	 */
	private String requestUrl = null;
	/**
	 * Headers to send;
	 */
	private LinkedHashMap<String, String> headers = null;
	/**
	 * Request method name.
	 * Default it's always GET
	 */
	private String method = "GET";
	/**
	 * Post form data encoding.
	 * Default application/x-www-form-urlencoded.
	 */
	private String formEncoding = "application/x-www-form-urlencoded";
	/**
	 * NOT PERSISTANT VALUE!
	 * This data will not be stored in Storage!
	 * It is a file objects from input file form.
	 */
	private List<FilesObject> filesList = null;
	
	/**
	 * Set new POST data.
	 * It's must be URLencoded string eg:
	 * a=b&c=My%20data
	 * @param data
	 */
	public void setData(String data, boolean fireEvent){
		this.postData = data;
		if(fireEvent){
			PostDataChangedEvent event = new PostDataChangedEvent(data);
			impl.fireEvent(event);
		}
	}
	/**
	 * URLencoded string representing POST data.
	 * @return URLencoded string
	 */
	public String getData(){
		return this.postData;
	}

	/**
	 * Sets request method.
	 * Allowed value is one from XMLHttpRequest Methods.
	 * @param method the method to set
	 */
	public void setMethod(String method) {
		this.method = method;
		MethodChangedEvent event = new MethodChangedEvent(method);
		impl.fireEvent(event);
	}

	/**
	 * Request method.
	 * @return the method
	 */
	public String getMethod() {
		return method;
	}

	/**
	 * URL to request
	 * @param requestUrl the requestUrl to set
	 * @param saveAfterRequest if true all data will be stored by {@link store} method
	 */
	public void setUrl(String requestUrl, boolean saveAfterRequest) {
		this.requestUrl = requestUrl;
		UrlChangedEvent event = new UrlChangedEvent(requestUrl);
		impl.fireEvent(event);
		if( saveAfterRequest ){
			this.store();
		}
	}

	/**
	 * URL to request
	 * @return the requestUrl
	 */
	public String getUrl() {
		return requestUrl;
	}
	/**
	 * Add new header to headers list.
	 * @param key header name
	 * @param value header value.
	 */
	public void addHeader(String key, String value){
		if( this.headers == null ){
			this.headers = new LinkedHashMap<String, String>();
		}
		this.headers.put(key, value);
		HeadersChangedEvent event = new HeadersChangedEvent(this.headers);
		impl.fireEvent(event);
	}
	/**
	 * Sets new request headers.
	 * @param map new headers map.
	 */
	public void setHeaders(LinkedHashMap<String, String> map, boolean notyfiChanges){
		this.headers = map;
		if( notyfiChanges ){
			HeadersChangedEvent event = new HeadersChangedEvent(map);
			impl.fireEvent(event);
		}
	}
	/**
	 * Returns request headers as string 
	 * eg. for text inputs
	 */
	public String headersAsString(){
		if( this.headers == null ){
			return null;
		}
		return RequestDataFormatter.headersToString( this.headers );
	}
	
	public String getFormEncoding() {
		return formEncoding;
	}
	/**
	 * 
	 * @param formEncoding new data encoding to set.
	 * @throws IllegalArgumentException if new value is null
	 */
	public void setFormEncoding(String formEncoding) throws IllegalArgumentException {
		if( formEncoding == null ){
			throw new IllegalArgumentException();
		}
		this.formEncoding = formEncoding;
	}
	
	
	/**
	 * Check if some request headers exists.
	 * @return True if headers length >0
	 */
	public boolean hasHeaders(){
		return this.headers.size()>0;
	}
	
	public LinkedHashMap<String, String> getHeaders(){
		return this.headers;
	}
	/**
	 * Resets all collected data.
	 * It's also affect local storage
	 */
	public void reset() {
		this.requestUrl = null;
		this.postData = null;
		this.method = "GET"; //default
		this.headers = new LinkedHashMap<String, String>();
		this.formEncoding = "application/x-www-form-urlencoded";
	}
	/**
	 * Adds a {@link com.kalicinscy.web.restclient.client.events.UrlChangedEvent} handler
	 * to be informed of changes to the Request URL parameter.
	 * 
	 * @param handler the handler
	 * @return the registration used to remove this value change handler
	 */
	public HandlerRegistration addUrlChangeHandler(UrlChangedEventHandler handler) {
		return impl.addUrlChangedEventHandler(handler);
	}
	/**
	 * Adds a {@link com.kalicinscy.web.restclient.client.events.PostDataChangedEvent} handler
	 * to be informed of changes to the Request POST data parameter.
	 * 
	 * @param handler the handler
	 * @return the registration used to remove this value change handler
	 */
	public HandlerRegistration addPostChangeHandler(PostDataChangedEventHandler handler) {
		return impl.addPostDataChangedEventHandler(handler);
	}
	
	/**
	 * Adds a {@link com.kalicinscy.web.restclient.client.events.HeadersChangedEvent} handler
	 * to be informed of changes to the Request Headers list.
	 * 
	 * It's not return new added value. It's return all headers list.
	 * 
	 * @param handler the handler
	 * @return the registration used to remove this value change handler
	 */
	public HandlerRegistration addHeadersChangeHandler(HeadersChangedEventHandler handler) {
		return impl.addHeadersChangedEventHandler(handler);
	}
	
	/**
	 * Adds a {@link com.kalicinscy.web.restclient.client.events.MethodChangedEvent} handler
	 * to be informed of changes to the Method parameter.
	 * 
	 * 
	 * @param handler the handler
	 * @return the registration used to remove this value change handler
	 */
	public HandlerRegistration addMethodChangeHandler(MethodChangedHandler handler) {
		return impl.addMethodChangedEventHandler(handler);
	}
	/**
	 * Adds a {@link com.kalicinscy.web.restclient.client.events.MethodChangedEvent} handler
	 * to be informed of changes to the Method parameter.
	 * 
	 * 
	 * @param handler the handler
	 * @return the registration used to remove this value change handler
	 */
	public HandlerRegistration addEncodingChangeHandler(FormEncodingChangeHandler handler) {
		return impl.addEncodingChangeHandler(handler);
	}

	/**
	 * @param filesList the filesList to set
	 */
	public void setFilesList(List<FilesObject> filesList) {
		this.filesList = filesList;
	}

	/**
	 * @return the filesList
	 */
	public List<FilesObject> getFilesList() {
		return filesList;
	}
}
