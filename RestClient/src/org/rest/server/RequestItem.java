package org.rest.server;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Text;

@PersistenceCapable
public class RequestItem {
	
	@PrimaryKey 
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key key;
	
	@Persistent
    private String name;
	
	@Persistent
    private Text url;
	
	@Persistent
    private Text post;
	
	@Persistent
    private String method;
	
	@Persistent
	private String encoding;
	
	@Persistent(defaultFetchGroup = "true")
    private List<RequestHeader> headers;
	/**
	 * Application from where request item has been sent.
	 */
	@Persistent
	private String applicationUUID;
	/**
	 * Helper UUID
	 */
	@Persistent
	private String itemUUID;
	/**
	 * User - owner of item.
	 */
	@Persistent
	private AppUser appUser;
	/**
	 * Date when object has been created
	 */
	@Persistent
	private Date createDate;
	
	public RequestItem(){
		this.createDate = new Date();
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
	 * @return the url
	 */
	public final String getUrl() {
		return url.getValue();
	}



	/**
	 * @param url the url to set
	 */
	public final void setUrl(String url) {
		this.url = new Text(url);
	}



	/**
	 * @return the post
	 */
	public final String getPost() {
		return post.getValue();
	}



	/**
	 * @param post the post to set
	 */
	public final void setPost(String post) {
		this.post = new Text(post);
	}



	/**
	 * @return the method
	 */
	public final String getMethod() {
		return method;
	}



	/**
	 * @param method the method to set
	 */
	public final void setMethod(String method) {
		this.method = method;
	}



	/**
	 * @return the encoding
	 */
	public final String getEncoding() {
		return encoding;
	}



	/**
	 * @param encoding the encoding to set
	 */
	public final void setEncoding(String encoding) {
		this.encoding = encoding;
	}



	/**
	 * @return the headers
	 */
	public final List<RequestHeader> getHeaders() {
		return headers == null ? new ArrayList<RequestHeader>() : headers;
	}



	/**
	 * @param headers the headers to set
	 */
	public final void setHeaders(List<RequestHeader> headers) {
		this.headers = headers;
	}



	/**
	 * @return the ownerUUID
	 */
	public final String getApplicationUUID() {
		return applicationUUID;
	}


	/**
	 * @return the appUser
	 */
	public final AppUser getAppUser() {
		return appUser;
	}



	/**
	 * @param appUser the appUser to set
	 */
	public final void setAppUser(AppUser appUser) {
		this.appUser = appUser;
	}



	/**
	 * @return the createDate
	 */
	public final Date getCreateDate() {
		return createDate;
	}



	/**
	 * @param createDate the createDate to set
	 */
	public final void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}



	/**
	 * @param applicationUUID the ownerUUID to set
	 * @throws IllegalArgumentException if UUID if not 36 characters length string
	 */
	public final void setApplicationUUID(String applicationUUID) throws IllegalArgumentException {
		if(applicationUUID == null || applicationUUID.length() != 36){
			throw new IllegalArgumentException("ownerUUID="+applicationUUID+" is not valid UUID");
		}
		this.applicationUUID = applicationUUID;
	}
	
	
	
	/**
	 * @return the itemUUID
	 */
	public final String getItemUUID() {
		return itemUUID;
	}



	/**
	 * @param itemUUID the itemUUID to set
	 */
	public final void setItemUUID(String itemUUID) {
		this.itemUUID = itemUUID;
	}
	
	
	public static List<RequestItem> getByAppUser(AppUser user){
		List<RequestItem> result = new ArrayList<RequestItem>();
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
		Query query = pm.newQuery(RequestItem.class);
		query.setFilter("appUser == userParam");
	    query.setOrdering("createDate asc");
	    query.declareParameters("com.restclient.server.AppUser userParam");
	    
	    try {
	        @SuppressWarnings("unchecked")
			List<RequestItem> results = (List<RequestItem>) query.execute(user);
	        if (!results.isEmpty()) {
	            for (RequestItem e : results) {
	            	result.add(e);
	            }
	        }
	    } finally {
	        query.closeAll();
	    }
	    return result;
	}

	public static RequestItem getItemById(String itemId){
		Key _key = null;
		try{
			_key = KeyFactory.stringToKey(itemId);
		} catch(Exception e){
			return null;
		}
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		RequestItem item = null;
		try {
			item = pm.getObjectById(RequestItem.class, _key);
			return item; //pm.detachCopy(item);
		} catch (Exception e) {
			//e.printStackTrace();
			return null;
		} finally {
			pm.close();
		}
	}
	
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("RequestItem[");
		if(key != null)
			sb.append("key=").append(KeyFactory.keyToString(key)).append(", ");
		sb.append("url=").append(url.getValue()).append(", ");
		sb.append("post=").append(post.getValue()).append(", ");
		sb.append("method=").append(method).append(", ");
		sb.append("encoding=").append(encoding).append(", ");
		sb.append("ownerUUID=").append(applicationUUID).append(", ");
		sb.append("user=").append(appUser).append(", ");
		sb.append("itemUUID=").append(itemUUID).append(", ");
		sb.append("headers={");
		if(headers != null){
			for(RequestHeader header : headers){
				sb.append(header.toString()).append(", ");
			}
		}
		sb.append("}");
		sb.append("]");
		return sb.toString();
	}
}
