package org.rest.server;

import java.io.IOException;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

/**
 * Servlet for communication with extension.
 * 
 * @author Paweł Psztyć
 * 
 */
public class UserDataServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7475618275284475409L;

		
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String path = req.getPathInfo();
		if(path == null || path.equals("") || path.equals("/")){
			resp.getWriter().println("Unknown action.");
			resp.setStatus(404);
			return;
		}
		
		User user = getUser();
		if(user == null){
			//
			// Only logged in users can enter this servlet
			//
			resp.getWriter().println("Not authorized.");
			resp.setStatus(401);
			return;
		}
		if(path.equals("/deleteall")){
			if(deleteAllUserData(user)){
				UserService userService = UserServiceFactory.getUserService();
				String redirect = userService.createLogoutURL("/index.jsp?i=removedall");
				resp.sendRedirect(redirect);
				return;
			} else {
				resp.sendRedirect("/listing.jsp?e=2");
				return;
			}
		} if(path.equals("/delete")){
			String k = req.getParameter("k");
			if(k == null || k.isEmpty()){
				resp.getWriter().println("This action require item key.");
				resp.setStatus(404);
				return;
			}
			
			if(!deleteForm(k, user)){
				resp.sendRedirect("/listing.jsp?e=1");
				return;
			}
			resp.sendRedirect("/listing.jsp");
		} else {
			resp.getWriter().println("Not found.");
			resp.setStatus(404);
			return;
		}
	}
	
	private boolean deleteAllUserData(User user){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Key userKey = KeyFactory.createKey(AppUser.class.getSimpleName(), user.getUserId());
		AppUser appUser = null;
		try{
			appUser = pm.getObjectById(AppUser.class, userKey);
		} catch(Exception e){
			pm.close();
			return false;
		}
		
		try {
			pm.deletePersistent(appUser);
		} catch(Exception e){
			e.printStackTrace();
			return false;
		} finally {
			pm.close();
		}
		
		return true;
	}
	
	private boolean deleteForm(String keyValue, User user){
		Key itemKey = null;
		try{
			itemKey = KeyFactory.stringToKey(keyValue);
		} catch(Exception e){
			System.out.println("Not valid key: " + keyValue);
			return false;
		}
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Key userKey = KeyFactory.createKey(AppUser.class.getSimpleName(), user.getUserId());
		AppUser appUser = null;
		try{
			appUser = pm.getObjectById(AppUser.class, userKey);
		} catch(Exception e){
			pm.close();
			return false;
		}
		
		if(appUser == null){
			System.out.println("No user found");
			return false;
		}
		boolean contain = false;
		List<RequestItem> userItems = appUser.getItemsSet();
		for(RequestItem _item : userItems){
			if(_item.getKey().equals(itemKey)){
				contain = true;
				userItems.remove(_item);
				break;
			}
		}
		if(!contain){
			System.out.println("User do not own item. size: "+appUser.getItemsSet().size());
			return false;
		}
		appUser.setItemsSet(userItems);
		try {
			pm.makePersistent(appUser);
		} catch(Exception e){
			e.printStackTrace();
			return false;
		} finally {
			pm.close();
		}
		
		return true;
	}
	
	/**
	 * Get current logged in user.
	 * @return User or null if not logged in
	 */
	private User getUser(){
		UserService userService = UserServiceFactory.getUserService();
		if(!userService.isUserLoggedIn()) return null;
		return userService.getCurrentUser();
	}
}
