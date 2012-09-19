package org.rest.client.deprecated;

import java.util.Date;

public class SuggestionImportItem {
	private String key;
	private String name;
	private String url;
	private Date created;

	/**
	 * @param name
	 *            the name to set
	 */
	public final void setName(String name) {
		this.name = name;
	}

	/**
	 * @param url
	 *            the url to set
	 */
	public final void setUrl(String url) {
		this.url = url;
	}

	/**
	 * @param created
	 *            the created to set
	 */
	public final void setCreated(Date created) {
		this.created = created;
	}
	
	public final void setKey(String key){
		this.key = key;
	}

	/**
	 * @return the key
	 */
	public final String getKey() {
		return key;
	}

	/**
	 * @return the name
	 */
	public final String getName() {
		return name;
	}

	/**
	 * @return the url
	 */
	public final String getUrl() {
		return url;
	}

	/**
	 * @return the created
	 */
	public final Date getCreated() {
		return created;
	}
	
}
