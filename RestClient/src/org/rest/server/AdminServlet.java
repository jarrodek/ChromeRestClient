package org.rest.server;

import java.io.IOException;

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
}
