package com.google.gwt.xhr2.client;

import java.util.Comparator;
/**
 * Application HTTP Header object representation.
 * It can be compared for sorting (by header name)
 * @author Paweł Psztyć
 *
 */
public class RequestHeader implements Comparable<RequestHeader> {
	/**
	 * Comparator used to sort headers list.
	 * @author Paweł Psztyć
	 *
	 */
	public static class HeadersComparator implements Comparator<RequestHeader> {
		@Override
		public int compare(RequestHeader arg0, RequestHeader arg1) {
			return arg0.compareTo(arg1);
		}
	}
	
	private String name;
	private String value;
	/**
	 * Create new Header object.
	 * @param name Header name
	 * @param value Header value
	 */
	public RequestHeader(String name, String value){
		this.name = name;
		this.value = value;
	}
	/**
	 * Set header name
	 * @param name
	 */
	public void setName(String name){
		this.name = name;
	}
	/**
	 * Set header value
	 * @param value
	 */
	public void setValue(String value){
		this.value = value;
	}
	/**
	 * Get header name
	 */
	public String getName() {
		return name;
	}
	/**
	 * Get header value
	 */
	public String getValue() {
		return value;
	}
	
	@Override
	public int compareTo(RequestHeader o) {
		return this.getName().compareTo(o.getName());
	}
	
	@Override
	public boolean equals(Object obj) {
		if(!(obj instanceof RequestHeader)) return false;
		RequestHeader o = (RequestHeader) obj;
		return this.getName().equals(o.getName()) && this.getValue().equals(o.getValue());
	}
}
