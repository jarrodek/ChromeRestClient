package org.rest.client.storage.store.objects;

public interface History {
	/**
	 * @return IDB ID.
	 */
	int getId();
	/**
	 * @param id ID to set (on update only)
	 */
	void setId(int id);
	/**
	 * @return saved URL data
	 */
	String getURL();
	/**
	 * Sets request URL data
	 * 
	 * @param url
	 *            URL to save
	 */
	void setURL(String url);
	/**
	 * @return Saved request method value
	 */
	String getMethod();
	/**
	 * Sets request method value eg. POST
	 * 
	 * @param method
	 *            Method to set
	 */
	void setMethod(String method);
	/**
	 * @return Saved request form encoding
	 */
	String getEncoding();
	/**
	 * Sets request data encoding eg. application/json
	 * 
	 * @param encoding
	 *            Encoding to set. Any valid encoding value
	 */
	void setEncoding(String encoding);
	/**
	 * @return Saved request headers data.
	 */
	String getHeaders();
	/**
	 * Sets headers data in string representation.
	 * 
	 * @param headers
	 */
	void setHeaders(String headers);
	/**
	 * @return Saved payload data
	 */
	String getPayload();
	/**
	 * Sets form payload
	 * 
	 * @param payload
	 *            Payload to set. Any string.
	 */
	void setPayload(String payload);
	
	double getTime();
	void setTime(double time);
}
