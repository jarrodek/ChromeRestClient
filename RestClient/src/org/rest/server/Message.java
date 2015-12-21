package org.rest.server;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.gson.annotations.Expose;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Message {
	
	/**
	 * key for old system.
	 */
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;
	
	/**
	 * New objectify index object.
	 */
	@Id Long id;
	
	@Expose private String message;
	/**
	 * A date object when the message was created.
	 * The app can query on this field.
	 */
	@Expose @Index private Long created;
	/**
	 * An URL to open when the user click on notification.
	 */
	@Expose private String actionUrl;
	
	/*public Message(Key key){
		this.key = key;
		this.created = new Date().getTime();
	}*/
	
	public Message(){
		this.created = new Date().getTime();
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
	
	

	public String getActionUrl() {
		return actionUrl;
	}

	public void setActionUrl(String actionUrl) {
		this.actionUrl = actionUrl;
	}

	public String getMessage() {
		return actionUrl;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Long getCreated() {
		return created;
	}

	public void setCreated(Long created) {
		this.created = created;
	}

	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("AppUser[");
		sb.append("key=").append(KeyFactory.keyToString(key)).append(", ");
		sb.append("actionUrl=").append(actionUrl).append(", ");
		sb.append("message=").append(message).append(", ");
		sb.append("created=").append(created).append(", ");
		sb.append("]");
		return sb.toString();
	}

	public static List<Message> getMessages(long since){
		if(since <= 0){
			Calendar now = Calendar.getInstance();
			now.add(Calendar.DAY_OF_MONTH, -14);
			since = now.getTimeInMillis();
		}
		return ofy().load().type(Message.class).filter("created >", since).list();
	}
}
