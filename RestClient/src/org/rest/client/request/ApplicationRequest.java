package org.rest.client.request;

import com.google.gwt.core.client.GWT;
import com.google.gwt.xhr2.client.Request;
import com.google.gwt.xhr2.client.RequestBuilder;
/**
 * Base class for requests to applications server.
 * @author Paweł Psztyć
 *
 */
public class ApplicationRequest {
	private final static String SERVICE_HOST;
	/**
	 * URL where to send remote requests.
	 */
	protected static final String SERVICE_URL;
	protected static final String PING_URL;
	public static final String AUTH_URL;
	public static final String ASSETS_URL;
	static {
		if (GWT.isProdMode()) {
			SERVICE_HOST = "https://chromerestclient.appspot.com/";
		} else {
			SERVICE_HOST = "http://127.0.0.1:8888/";
		}
		SERVICE_URL = SERVICE_HOST + "ext-channel";
		PING_URL = SERVICE_HOST + "ping/session";
		AUTH_URL = SERVICE_HOST + "auth";
		ASSETS_URL = SERVICE_HOST + "static/";
	}
	
	protected static Request currentRequest = null;
	
	protected static RequestBuilder getApplicationRequestBuilder(String url, String method) {
		RequestBuilder b = new RequestBuilder(url, method);
		b.setHeader("X-Chrome-Extension", "ChromeRestClient");
		return b;
	}
	
}