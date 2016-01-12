package org.rest.server;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class OfyService {
	static {
        
    }

    public static Objectify ofy() {
        return ObjectifyService.ofy();
    }

    
}
