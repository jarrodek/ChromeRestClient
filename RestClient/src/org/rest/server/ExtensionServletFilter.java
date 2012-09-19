package org.rest.server;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ExtensionServletFilter implements Filter{

	@Override
	public void destroy() {
		
		// If you have assigned any expensive resources as field of
        // this Filter class, then you could clean/close them here.
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws IOException, ServletException {
		
		HttpServletResponse response = (HttpServletResponse) res;
	    response.setHeader("Access-Control-Allow-Origin", "*");
	    
	    final HttpServletRequest httpRequest = (HttpServletRequest) req;
	    String extenstionHeader = httpRequest.getHeader("X-Chrome-Extension");
	    if(extenstionHeader == null){
	    	//protection to enter servlet outside extension
	    	response.setHeader("X-Chrome-Extension", "null");
	    	throw new ServletException("It is not a valid request.");
	    }
	    
	    chain.doFilter(req, res);
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// If you have any <init-param> in web.xml, then you could get them
        // here by config.getInitParameter("name") and assign it as field.
		
	}

}
