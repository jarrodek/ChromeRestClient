package org.rest.server;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;

public class OfyHelper implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {}

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		
		ObjectifyFactory factory = ObjectifyService.factory();
        factory.register(Message.class);
        //factory.register(AppUser.class);
        //factory.register(RequestItem.class);
        //factory.register(RequestHeader.class);
	}
	
}
