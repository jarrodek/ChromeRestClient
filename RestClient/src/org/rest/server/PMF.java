package org.rest.server;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

import com.googlecode.objectify.ObjectifyService;

public class PMF {
	
	static { 
		ObjectifyService.register(Message.class); 
	}
	
	
	
	
	
	private static final PersistenceManagerFactory pmfInstance = JDOHelper
			.getPersistenceManagerFactory("transactions-optional");

	private PMF() {
	}

	public static PersistenceManagerFactory get() {
		return pmfInstance;
	}
}
