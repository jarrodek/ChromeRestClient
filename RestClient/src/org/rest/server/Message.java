package org.rest.server;

import java.util.ArrayList;
import java.util.Date;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

@PersistenceCapable
public class Message {
	/**
	 * key from userID
	 */
	@PrimaryKey
	@Persistent
	private Key key;
	
	@Persistent private String title;
	@Persistent private String message;
	@Persistent private Date created;
	@Persistent private boolean ready;
	
	public Message(Key key){
		this.key = key;
		this.created = new Date();
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
	
	

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public boolean isReady() {
		return ready;
	}

	public void setReady(boolean ready) {
		this.ready = ready;
	}
	
	

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("AppUser[");
		sb.append("key=").append(KeyFactory.keyToString(key)).append(", ");
		sb.append("title=").append(title).append(", ");
		sb.append("message=").append(message).append(", ");
		sb.append("created=").append(created).append(", ");
		sb.append("ready=").append(ready);
		sb.append("]");
		return sb.toString();
	}
	
	public static ArrayList<Message> getMessages(long since){
		Date date = new Date(since);
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
		Query query = pm.newQuery(Message.class, "created == createdParam && ready == true order by created asc");
	    query.declareParameters("java.util.Date createdParam");
	    ArrayList<Message> result = new ArrayList<Message>();
	    try {
	        @SuppressWarnings("unchecked")
			ArrayList<Message> results = (ArrayList<Message>) query.execute(date);
	        if (!results.isEmpty()) {
	            for (Message e : results) {
	            	result.add(e);
	            }
	        }
	    } catch (Exception e) {
	    	e.printStackTrace();
	    } finally {
	        query.closeAll();
	    }
	    return result;
	}
	
}
