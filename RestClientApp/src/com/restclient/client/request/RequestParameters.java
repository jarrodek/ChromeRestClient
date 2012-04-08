package com.restclient.client.request;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.Window.ClosingEvent;
import com.google.gwt.user.client.Window.ClosingHandler;
import com.google.gwt.xhr2.client.RequestHeader;
import com.restclient.client.RequestHistoryItem;
import com.restclient.client.RestApp;
import com.restclient.client.Utils;
import com.restclient.client.event.BodyChangeEvent;
import com.restclient.client.event.EncodingChangeEvent;
import com.restclient.client.event.FilesChangeEvent;
import com.restclient.client.event.HeadersChangeEvent;
import com.restclient.client.event.MethodChangeEvent;
import com.restclient.client.event.UrlChangeEvent;
import com.restclient.client.storage.FilesObject;
import com.restclient.client.storage.RestForm;

/**
 * @author jarrod
 *
 */
public class RequestParameters {

	private static final Storage store = Storage.getLocalStorageIfSupported();
	private EventBus eventBus;

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

	private static RequestParameters INSTANCE = null;

	/**
	 * @return
	 */
	public static RequestParameters getInstance() {
		if (INSTANCE == null) {
			INSTANCE = new RequestParameters();
		}
		return INSTANCE;
	}

	private RequestParameters() {
	}

	/**
	 * Initialize RequestParameters factory. You must call this before any other
	 * method in this class.
	 * 
	 * @param eb
	 *            app event bus.
	 */
	public static void initialize(final EventBus eb) {
		final RequestParameters instance = getInstance();
		instance.eventBus = eb;
		
		Window.addWindowClosingHandler(new ClosingHandler() {
			@Override
			public void onWindowClosing(ClosingEvent event) {
				store();
			}
		});
		UrlChangeEvent.register(eb, new UrlChangeEvent.Handler() {
			@Override
			public void onChange(String url, Object source) {
				instance.requestUrl = url;
			}
		});
		MethodChangeEvent.register(eb, new MethodChangeEvent.Handler() {
			@Override
			public void onChange(String oldMethod, String newMethod) {
				if( oldMethod == null ){
					return;
				}
				instance.method = newMethod;
				if( RestApp.isDebug() ){
					Log.debug("Request method has changed from " + oldMethod + " to " + newMethod);
				}
			}
		});
		HeadersChangeEvent.register(eb, new HeadersChangeEvent.Handler() {
			@Override
			public void onChange(List<RequestHeader> headers, Object source) {
				instance.headers = headers;
				if( RestApp.isDebug() ){
					Log.debug( "Change in headers list. Current set:" );
					if(headers != null)
					for(RequestHeader header : headers){
						Log.debug( header.getName() + ": " + header.getValue() );
					}
				}
			}
		});
		BodyChangeEvent.register(eb, new BodyChangeEvent.Handler() {
			@Override
			public void onChange(String body, Object source) {
				instance.postData = body;
			}
		});
		FilesChangeEvent.register(eb, new FilesChangeEvent.Handler() {
			@Override
			public void onChange(List<FilesObject> files, Object source) {
				instance.filesList = files;
			}
		});
		EncodingChangeEvent.register(eb, new EncodingChangeEvent.Handler() {
			@Override
			public void onChange(String enc, Object source) {
				if( RestApp.isDebug() ){
					Log.debug("Setting new form encoding to: " + enc);
				}
				instance.formEncoding = enc;
				if(instance.headers != null){
					for(RequestHeader header : instance.headers){
						if(header.getName().toLowerCase().equals("content-type")){
							header.setValue(enc);
							if( RestApp.isDebug() ){
								Log.debug("Overvrite existing content-type header value");
							}
							instance.eventBus.fireEventFromSource(new HeadersChangeEvent(instance.headers), RequestParameters.class);
							break;
						}
					}
				}
			}
		});
	}

	/**
	 * Store request parameters to local storage
	 */
	public static void store() {
		if (store != null){
			String value = getInstance().toString();
			store.setItem("latestRequest", value);
			if( RestApp.isDebug() ){
				Log.debug("Current state saved: " + value);
			}
		}
	}
//	/**
//	 * Store request parameters to local storage and in history list 
//	 * @param saveInHistory true if request should be stored in history list as well.
//	 */
//	public static void store(boolean saveInHistory){
//		if (store != null){
//			String data = getInstance().toString();
//			store.setItem("latestRequest", data);
//		}
//	}
	
	@Override
	public String toString() {
		JSONObject data = this._toJSON();
		return data.toString();
	}
	/**
	 * Create JSON object from request parameters class fields values.
	 * @return JSON object, never null.
	 */
	public static JSONObject toJSON(){
		
		RequestParameters instance = getInstance();
		return instance._toJSON();
		
	}
	
	private JSONObject _toJSON(){
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
		if (this.headers != null) {
			for( RequestHeader header : headers){
				if(header == null) continue;
				JSONObject headerObject = new JSONObject();
				headerObject.put(header.getName(), new JSONString(header.getValue()));
				headersArray.set(headersArray.size(), headerObject);
			}
		}
		data.put("headers", headersArray);
		return data;
	}

	/**
	 * 
	 */
	public static void restoreFromStorage() {
		if (store != null) {
			String data = store.getItem("latestRequest");
			restore(data, true);
		}
	}

	/**
	 * @param data
	 */
	public static void restoreFromSavedState(RestForm data) {
		String json = data.getData();
		restore(json, true);
		store();
	}

	/**
	 * Restore state from history
	 * @param item
	 */
	public static void restoreHistory(RequestHistoryItem item){
		RequestParameters ins = getInstance();
		
		ins.requestUrl = item.getRequestUrl();
		ins.formEncoding = item.getFormEncoding();
		ins.postData = item.getPostData();
		ins.method = item.getMethod();
		List<RequestHeader> headersValue = item.getHeaders();
		if( headersValue == null ){
			headersValue = new ArrayList<RequestHeader>();
		}
		ins.headers = headersValue;
		//
		// Events
		//
		ins.eventBus.fireEventFromSource(new UrlChangeEvent(ins.requestUrl), RequestParameters.class);
		ins.eventBus.fireEventFromSource(new EncodingChangeEvent(ins.formEncoding), RequestParameters.class);
		ins.eventBus.fireEventFromSource(new BodyChangeEvent(ins.postData), RequestParameters.class);
		ins.eventBus.fireEventFromSource(new MethodChangeEvent(null, ins.method),RequestParameters.class);
		ins.eventBus.fireEventFromSource(new HeadersChangeEvent(ins.headers), RequestParameters.class);
	}
	
	
	/**
	 * Restore parameters from local storage.
	 */
	private static void restore(String data, boolean fireEvents) {
		if (data == null) {
			return;
		}
		JSONValue value = JSONParser.parseLenient(data);
		if (value == null) {
			return;
		}
		JSONObject obj = value.isObject();
		if (obj == null) {
			return;
		}
		RequestParameters ins = getInstance();

		String url = Utils.getJsonString(obj, "url");
		if (url != null) {
			ins.requestUrl = url;
		}
		if (fireEvents) {
			ins.eventBus.fireEventFromSource(new UrlChangeEvent(url),
					RequestParameters.class);
		}
		
		String formEncoding = Utils.getJsonString(obj, "formEncoding");
		if (formEncoding != null) {
			formEncoding = formEncoding.trim();
			ins.formEncoding = formEncoding;
			if (fireEvents) {
				ins.eventBus.fireEventFromSource(new EncodingChangeEvent(formEncoding), RequestParameters.class);
			}
		}
		String post = Utils.getJsonString(obj, "post");
		if (post != null) {
			ins.postData = post;
		}
		if (fireEvents) {				
			ins.eventBus.fireEventFromSource(new BodyChangeEvent(post), RequestParameters.class);
		}
		String method = Utils.getJsonString(obj, "method");
		if (method != null) {
			ins.method = method;
			if (fireEvents) {
				ins.eventBus.fireEventFromSource(new MethodChangeEvent(null, method),RequestParameters.class);
			}
		}

		JSONArray headersArray = obj.get("headers").isArray();
		List<RequestHeader> headers = new ArrayList<RequestHeader>();
		if (headersArray != null) {
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
					
					if(headerName.toLowerCase().equals("content-type") && headerValue.trim().toLowerCase().equals(formEncoding)){
						//
						// Do not duplicate content type header if it is same as form encoding value
						//
						continue;
					}
					
					headers.add(new RequestHeader(headerName, headerValue));
				}
			}
		}
		ins.headers = headers;
		if (fireEvents) {
			ins.eventBus.fireEventFromSource(new HeadersChangeEvent(headers), RequestParameters.class);
		}
	}

	// private fields

	/**
	 * Set new POST data. It's must be URLencoded string eg: a=b&c=My%20data
	 * 
	 * @param data
	 * @param fireEvent 
	 */
	public static void setData(String data, boolean fireEvent) {
		RequestParameters ins = getInstance();
		ins.postData = data;
		if (fireEvent) {
			// PostDataChangedEvent event = new PostDataChangedEvent(data);
			// impl.fireEvent(event);
			// eventBus.fireEventFromSource(event, RequestParameters.class);
		}
	}

	/**
	 * URLencoded string representing POST data.
	 * 
	 * @return URLencoded string
	 */
	public static String getData() {
		return getInstance().postData;
	}

	/**
	 * Sets request method. Allowed value is one from XMLHttpRequest Methods.
	 * 
	 * @param method
	 *            the method to set
	 */
	public static void setMethod(String method) {
		RequestParameters ins = getInstance();
		ins.method = method;
		// MethodChangedEvent event = new MethodChangedEvent(method);
		// impl.fireEvent(event);
		// eventBus.fireEventFromSource(event, RequestParameters.class);
	}

	/**
	 * Request method.
	 * 
	 * @return the method
	 */
	public static String getMethod() {
		return getInstance().method;
	}

	/**
	 * URL to request
	 * 
	 * @param requestUrl
	 *            the requestUrl to set
	 */
	public static void setUrl(String requestUrl) {
		RequestParameters ins = getInstance();
		ins.requestUrl = requestUrl;
		// UrlChangedEvent event = new UrlChangedEvent(requestUrl);
		// impl.fireEvent(event);
		// eventBus.fireEventFromSource(event, RequestParameters.class);
		// if( saveAfterRequest ){
		// this.store();
		// }
	}

	/**
	 * URL to request
	 * 
	 * @return the requestUrl
	 */
	public static String getUrl() {
		return getInstance().requestUrl;
	}

	/**
	 * Add new header to headers list.
	 * 
	 * @param key
	 *            header name
	 * @param value
	 *            header value.
	 */
	public static void addHeader(String key, String value) {
		RequestParameters ins = getInstance();
		if (ins.headers == null) {
			ins.headers = new ArrayList<RequestHeader>();
		}
		ins.headers.add(new RequestHeader(key, value));
	}

	/**
	 * Sets new request headers.
	 * 
	 * @param map
	 *            new headers map.
	 * @param notifyChanges 
	 */
	public void setHeaders(List<RequestHeader> map,
			boolean notifyChanges) {
		RequestParameters ins = getInstance();
		ins.headers = map;
		if (notifyChanges) {
			// HeadersChangedEvent event = new HeadersChangedEvent(map);
			// impl.fireEvent(event);
			// eventBus.fireEventFromSource(event, RequestParameters.class);
		}
	}

	/**
	 * Returns request headers as string eg. for text inputs
	 * @return 
	 */
	public static String headersAsString() {
		RequestParameters ins = getInstance();
		if (ins.headers == null) {
			return null;
		}
		return RequestDataFormatter.headersToString(ins.headers);
	}

	/**
	 * @return
	 */
	public static String getFormEncoding() {
		return getInstance().formEncoding;
	}

	/**
	 * 
	 * @param formEncoding
	 *            new data encoding to set.
	 * @throws IllegalArgumentException
	 *             if new value is null
	 */
	public static void setFormEncoding(String formEncoding)
			throws IllegalArgumentException {
		RequestParameters ins = getInstance();
		if (formEncoding == null) {
			throw new IllegalArgumentException();
		}
		ins.formEncoding = formEncoding;
	}

	/**
	 * Check if some request headers exists.
	 * 
	 * @return True if headers length >0
	 */
	public static boolean hasHeaders() {
		return getInstance().headers.size() > 0;
	}

	/**
	 * @return
	 */
	public static List<RequestHeader> getHeaders() {
		return getInstance().headers;
	}

	/**
	 * Resets all collected data. It's also affect local storage
	 */
	public static void reset() {
		RequestParameters ins = getInstance();
		ins.requestUrl = null;
		ins.postData = null;
		ins.method = "GET"; // default
		ins.headers = new ArrayList<RequestHeader>();
		ins.formEncoding = "application/x-www-form-urlencoded";
	}

	/**
	 * @param filesList
	 *            the filesList to set
	 */
	public static void setFilesList(List<FilesObject> filesList) {
		RequestParameters ins = getInstance();
		ins.filesList = filesList;
	}

	/**
	 * @return the filesList
	 */
	public static List<FilesObject> getFilesList() {
		return getInstance().filesList;
	}
}
