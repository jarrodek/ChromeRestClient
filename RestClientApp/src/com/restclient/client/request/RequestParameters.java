package com.restclient.client.request;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

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
import com.restclient.client.event.BodyChangeEvent;
import com.restclient.client.event.EncodingChangeEvent;
import com.restclient.client.event.FilesChangeEvent;
import com.restclient.client.event.HeadersChangeEvent;
import com.restclient.client.event.MethodChangeEvent;
import com.restclient.client.event.UrlChangeEvent;
import com.restclient.client.storage.FilesObject;
import com.restclient.client.storage.RestForm;

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
	private LinkedHashMap<String, String> headers = null;
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
//				Log.debug("Store");
				store();
			}
		});
		UrlChangeEvent.register(eb, new UrlChangeEvent.Handler() {
			@Override
			public void onChange(String url, Object source) {
				instance.requestUrl = url;
//				Log.debug("URL change: "+url);
			}
		});
		MethodChangeEvent.register(eb, new MethodChangeEvent.Handler() {
			@Override
			public void onChange(String oldMethod, String newMethod) {
				if( oldMethod == null ){
					return;
				}
//				Log.debug("Method change");
				instance.method = newMethod;
			}
		});
		HeadersChangeEvent.register(eb, new HeadersChangeEvent.Handler() {
			@Override
			public void onChange(LinkedHashMap<String, String> headers, Object source) {
//				Log.debug("Headers change");
				instance.headers = headers;
			}
		});
		BodyChangeEvent.register(eb, new BodyChangeEvent.Handler() {
			@Override
			public void onChange(String body, Object source) {
//				Log.debug("Body change");
				instance.postData = body;
			}
		});
		FilesChangeEvent.register(eb, new FilesChangeEvent.Handler() {
			@Override
			public void onChange(List<FilesObject> files, Object source) {
//				Log.debug("File liest change");
				instance.filesList = files;
			}
		});
		EncodingChangeEvent.register(eb, new EncodingChangeEvent.Handler() {
			@Override
			public void onChange(String enc, Object source) {
//				Log.debug("Form encoding change.");
				instance.formEncoding = enc;
			}
		});
	}

	/**
	 * Store request parameters to local storage
	 */
	public static void store() {

		if (store != null)
			store.setItem("latestRequest", getInstance().toString());
	}

	@Override
	public String toString() {
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
			Set<String> keys = this.headers.keySet();
			Iterator<String> it = keys.iterator();
			while (it.hasNext()) {
				String k = it.next();
				if (k.toLowerCase().equals("content-type")) { // never store
																// this value!
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

	private static String getJsonStringData(JSONObject obj, String key) {
		JSONValue keyObj = obj.get(key);
		if (keyObj == null) {
			return null;
		}
		JSONString keyJS = keyObj.isString();
		if (keyJS == null) {
			return null;
		}
		String value = keyJS.stringValue();
		if (!value.equals("null")) {
			return value;
		}
		return null;
	}

	public static void restoreFromStorage() {
		if (store != null) {
			String data = store.getItem("latestRequest");
			restore(data, true);
		}
	}

	public static void restoreFromSavedState(RestForm data) {
		String json = data.getData();
		restore(json, true);
		store();
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

		String url = getJsonStringData(obj, "url");
		if (url != null) {
			ins.requestUrl = url;
		}
		if (fireEvents) {
			ins.eventBus.fireEventFromSource(new UrlChangeEvent(url),
					RequestParameters.class);
		}
		
		String formEncoding = getJsonStringData(obj, "formEncoding");
		if (formEncoding != null) {
			ins.formEncoding = formEncoding;
			if (fireEvents) {
				ins.eventBus.fireEventFromSource(new EncodingChangeEvent(formEncoding), RequestParameters.class);
			}
		}
		String post = getJsonStringData(obj, "post");
		if (post != null) {
			ins.postData = post;
		}
		if (fireEvents) {				
			ins.eventBus.fireEventFromSource(new BodyChangeEvent(post), RequestParameters.class);
		}
		String method = getJsonStringData(obj, "method");
		if (method != null) {
			ins.method = method;
			if (fireEvents) {
				ins.eventBus.fireEventFromSource(new MethodChangeEvent(null, method),RequestParameters.class);
			}
		}

		JSONArray headersArray = obj.get("headers").isArray();
		if (headersArray != null) {
			LinkedHashMap<String, String> headers = new LinkedHashMap<String, String>();
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
					headers.put(headerName, headerValue);
				}
			}
			ins.headers = headers;
			if (fireEvents) {
				ins.eventBus.fireEventFromSource(new HeadersChangeEvent(headers), RequestParameters.class);
			}
		}
	}

	// private fields

	/**
	 * Set new POST data. It's must be URLencoded string eg: a=b&c=My%20data
	 * 
	 * @param data
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
			ins.headers = new LinkedHashMap<String, String>();
		}
		ins.headers.put(key, value);
		// HeadersChangedEvent event = new HeadersChangedEvent(this.headers);
		// impl.fireEvent(event);
		// eventBus.fireEventFromSource(event, RequestParameters.class);
	}

	/**
	 * Sets new request headers.
	 * 
	 * @param map
	 *            new headers map.
	 */
	public void setHeaders(LinkedHashMap<String, String> map,
			boolean notyfiChanges) {
		RequestParameters ins = getInstance();
		ins.headers = map;
		if (notyfiChanges) {
			// HeadersChangedEvent event = new HeadersChangedEvent(map);
			// impl.fireEvent(event);
			// eventBus.fireEventFromSource(event, RequestParameters.class);
		}
	}

	/**
	 * Returns request headers as string eg. for text inputs
	 */
	public static String headersAsString() {
		RequestParameters ins = getInstance();
		if (ins.headers == null) {
			return null;
		}
		return RequestDataFormatter.headersToString(ins.headers);
	}

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

	public static LinkedHashMap<String, String> getHeaders() {
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
		ins.headers = new LinkedHashMap<String, String>();
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
