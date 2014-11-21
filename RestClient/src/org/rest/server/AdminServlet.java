package org.rest.server;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;

import javax.jdo.PersistenceManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

public class AdminServlet extends HttpServlet {
	

	/**
	 * 
	 */
	private static final long serialVersionUID = -3878227809088749144L;
	
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		
		UserService userService = UserServiceFactory.getUserService();
		boolean isUser = userService.isUserLoggedIn();
		boolean admin = userService.isUserAdmin();
		
		if(!isUser){
			String followOnURL = req.getRequestURI();
			resp.sendRedirect(userService.createLoginURL(followOnURL));
			return;
		}
		
		if(!admin){
			resp.sendRedirect("/index.jsp");
			return;
		}
		
		req.getRequestDispatcher("./admin.jsp").forward(req, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		HashMap<String, String> params = new HashMap<String, String>();
		
		Enumeration<String> names = req.getParameterNames();
		while(names.hasMoreElements()){
			String key = names.nextElement();
			String value = req.getParameter(key);
			params.put(key, value);
		}
		
		PrintWriter writer = resp.getWriter();
		
		if(!params.containsKey("payload")){
			return;
		}
		String payload = params.get("payload");
		
		writer.println(payload);
		writer.println();
		if(payload.equals("message-add")){
			writer.println("try add");
			if(addNewDeveloperMessgae(params.get("title"),params.get("message"))){
				writer.println("added");
			}
		}
		
		
		
		
		writer.println("OK");
	}
	
	boolean addNewDeveloperMessgae(String title, String message){
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Message msg = new Message();
			msg.setReady(true);
			msg.setTitle(title);
			msg.setMessage(message);
			pm.makePersistent(msg);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		} finally {
			pm.close();
		}
		
		return true;
	}
}
