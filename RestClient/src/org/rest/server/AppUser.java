package org.rest.server;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.JDOObjectNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.annotations.Element;
import javax.jdo.annotations.Extension;
import javax.jdo.annotations.Order;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;

@PersistenceCapable
public class AppUser {
	/**
	 * key from userID
	 */
	@PrimaryKey
	@Persistent
	private Key key;
	
	@Persistent
    private User user;
	
	/**
	 * User saved requests
	 */
	@Persistent(mappedBy = "appUser", defaultFetchGroup = "true")
	@Order(extensions = @Extension(vendorName = "datanucleus", key = "list-ordering", value = "createDate desc"))
	@Element(dependent = "true")
	private List<RequestItem> itemsSet;
	
	public AppUser(Key key){
		this.key = key;
		itemsSet = new ArrayList<RequestItem>();
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
	 * @return the user
	 */
	public final User getUser() {
		return user;
	}

	/**
	 * @param user the user to set
	 */
	public final void setUser(User user) {
		this.user = user;
	}
	
	/**
	 * @return the itemsSet
	 */
	public final List<RequestItem> getItemsSet() {
		if(itemsSet != null){
			itemsSet.size();
			return itemsSet;
		}
		return new ArrayList<RequestItem>();
	}

	/**
	 * @param itemsSet the itemsSet to set
	 */
	public final void setItemsSet(List<RequestItem> itemsSet) {
		this.itemsSet = itemsSet;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("AppUser[");
		sb.append("key=").append(KeyFactory.keyToString(key)).append(", ");
		sb.append("user=").append(user.getUserId()).append(", ");
		sb.append("items cnt=").append(getItemsSet().size());
		sb.append("]");
		return sb.toString();
	}
	
	public static AppUser getUserById(String userId){
		Key _key = KeyFactory.createKey(AppUser.class.getSimpleName(), userId);
		PersistenceManager pm = PMF.get().getPersistenceManager();
		AppUser appUser = null;
		try {
			appUser = pm.getObjectById(AppUser.class, _key);
			return pm.detachCopy(appUser);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			pm.close();
		}
	}
	
	/**
	 * 
	 * @param user
	 * @return AppUser object
	 */
	public static AppUser getOrCreateUser(User user){
		Key _key = KeyFactory.createKey(AppUser.class.getSimpleName(), user.getUserId());
		PersistenceManager pm = PMF.get().getPersistenceManager();
		AppUser appUser = null;
		try {
			appUser = pm.getObjectById(AppUser.class, _key);
			return pm.detachCopy(appUser);
		} catch (JDOObjectNotFoundException e){
			appUser = new AppUser(_key);
			appUser.setUser(user);
			pm.makePersistent(appUser);
			return appUser;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			pm.close();
		}
	}
	
	
}
