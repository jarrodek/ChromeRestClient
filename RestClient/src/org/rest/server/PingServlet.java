package org.rest.server;

import java.io.IOException;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;

/**
 * Servlet for communication with extension.
 * 
 * @author Paweł Psztyć
 * 
 */
public class PingServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7475618275284475409L;

	@Override
	protected void doOptions(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		System.out.println("doOptions: " + req.getRemoteAddr());

		HttpServletResponse response = (HttpServletResponse) res;
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		super.doOptions(req, res);
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		HttpServletResponse response = (HttpServletResponse) resp;
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");

		Gson gson = new Gson();
		resp.setHeader("Content-Type", "application/json");
		String path = req.getPathInfo();
		
		if(path == null || path.equals("") || path.equals("/")){
			resp.setStatus(400);
			resp.getWriter().print(
					gson.toJson(new ResponseError("Unknown path.")));
			return;
		}
		
		if(path.equals("/session")){
			//
			// Check if user has active session
			//
			resp.getWriter().print(
					gson.toJson(new SessionState()));
		}
		

		resp.setStatus(200);
	}
	
	
	
	@SuppressWarnings("unused")
	private static class SessionState {
		final boolean hasSession;
		final String userId;
		SessionState(){
			UserService userService = UserServiceFactory.getUserService();
			this.hasSession = userService.isUserLoggedIn();
			if(this.hasSession){
				this.userId = userService.getCurrentUser().getUserId();
			} else {
				this.userId = null;
			}
		}
	}
	
	
	@SuppressWarnings("unused")
	private static class ResponseError {
		final boolean error = true;
		/**
		 * Code error
		 */
		final int code;
		/**
		 * Error message
		 */
		final String message;
		/**
		 * Time of request
		 */
		final long time;

		ResponseError(String message) {
			this.message = message;
			this.time = new Date().getTime();
			this.code = 400;
		}

		ResponseError(String message, int code) {
			this.message = message;
			this.time = new Date().getTime();
			this.code = code;
		}
	}
}
