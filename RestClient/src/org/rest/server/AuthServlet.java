package org.rest.server;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

/**
 * Servlet for communication with extension.
 * 
 * @author Paweł Psztyć
 * 
 */
public class AuthServlet extends HttpServlet {
	private static final String ERROR_STATUS = "ERROR";
//    private static final String OK_STATUS = "OK";
//    private static final String LOGIN_REQUIRED_STATUS = "LOGIN_REQUIRED";
    
	private static final Logger log =
	        Logger.getLogger(AuthServlet.class.getName());
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -7178713755516331846L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setContentType("text/html");
		boolean signIn = req.getRequestURI().startsWith("/auth/signin");
		// Get the extension return URL
        String extRet = req.getParameter("ret");
        if (extRet == null) {
            resp.setStatus(400);
            resp.getWriter().println(ERROR_STATUS + " (extret parameter missing)");
            return;
        }
        
        UserService userService = UserServiceFactory.getUserService();
        // If login/logout is complete, redirect to the extension page. Otherwise, send user to
        // login/logout, setting the continue page back to this servlet (since UserService does
        // not understand chrome-extension:// URLs)
        if (userService.isUserLoggedIn() || req.getParameter("completed") != null) {
        	// Server-side redirects don't work for chrome-extension:// URLs so we do a client-
            // side redirect instead
        	//check if user click log in...
            if( signIn && !userService.isUserLoggedIn() ){
	            String followOnURL = req.getScheme() + "://" + req.getServerName() + "/index.html#loginInterupted";
	            resp.sendRedirect(followOnURL);
	            return;
            }
            // Sanitize the extRet URL for XSS protection
            String regExChrome = "chrome-extension://[a-z]+" + (signIn ? "/auth\\.html#auth" : "/signed_out\\.html");
            if (extRet.matches(regExChrome)) {
            	resp.getWriter().println("<meta http-equiv=\"refresh\" content=\"0;url=" + extRet + "\">");
            } else {
            	String regDevModel = "http://127\\.0\\.0\\.1:8888+" + (signIn ? "/auth\\.html#auth" : "/signed_out\\.html");
            	if (extRet.matches(regDevModel)) {
            		resp.sendRedirect(extRet);
            		return;
            	}
                resp.setStatus(400);
                resp.getWriter().println(ERROR_STATUS + " (invalid redirect)");
                log.warning("Invalid redirect " + extRet);
            }
        } else {
        	String followOnURL = req.getRequestURI() + "?completed=true&ret=" +
                    URLEncoder.encode(extRet, "UTF-8");
        	resp.sendRedirect(signIn ? userService.createLoginURL(followOnURL) : userService.createLogoutURL(followOnURL));
        }
	}

	
}
