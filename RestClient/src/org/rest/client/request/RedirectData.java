package org.rest.client.request;

import java.util.ArrayList;

import com.google.gwt.xhr2.client.Header;

/**
 * Class represent single redirection during request. It contain status data
 * before redirection, received headers, redirect URL and information if
 * redirection information is cached.
 * 
 * @author jarrod
 * 
 */
public class RedirectData {
	
	String redirectUrl;
	int statusCode;
	String statusLine;
	boolean fromCache;
	ArrayList<Header> responseHeaders;
	
	public void setRedirectUrl(String url){
		redirectUrl = url;
	}
	
	public String getRedirectUrl(){
		return redirectUrl;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}

	public String getStatusLine() {
		return statusLine;
	}

	public void setStatusLine(String statusLine) {
		this.statusLine = statusLine;
	}

	public boolean isFromCache() {
		return fromCache;
	}

	public void setFromCache(boolean fromCache) {
		this.fromCache = fromCache;
	}

	public ArrayList<Header> getResponseHeaders() {
		return responseHeaders;
	}

	public void setResponseHeaders(ArrayList<Header> responseHeaders) {
		this.responseHeaders = responseHeaders;
	}
}