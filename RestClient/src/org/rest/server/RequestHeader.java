package org.rest.server;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class RequestHeader {
	
	/**
	 * New objectify index object.
	 */
	@Id Long id;
	
	@PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key key;
	
    private String name;
	private String value;
	
	RequestHeader(){}
	
	RequestHeader(String name, String value){
		this.name = name;
		this.value = value;
	}
	
	/**
	 * @return the key
	 */
	public final Key getKey() {
		return key;
	}

	/**
	 * @param key the key to set
	 */
	public final void setKey(Key key) {
		this.key = key;
	}

	/**
	 * @return the name
	 */
	public final String getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	public final void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the value
	 */
	public final String getValue() {
		return value;
	}

	/**
	 * @param value the value to set
	 */
	public final void setValue(String value) {
		this.value = value;
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("RequestHeader[");
		sb.append("key=").append(KeyFactory.keyToString(key)).append(", ");
		sb.append("name=").append(name).append(", ");
		sb.append("value=").append(value);
		sb.append("]");
		return sb.toString();
	}
}
