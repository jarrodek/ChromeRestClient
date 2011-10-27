package com.restclient.client.storage;

import com.google.code.gwt.database.client.service.Connection;
import com.google.code.gwt.database.client.service.DataService;

/**
 * Main app database connection service. Any other databases services must
 * extend this class.
 * 
 * @author jarrod
 * 
 */
@Connection(name = "restClient", version = "1.0", description = "Rest service database", maxsize = 1000000)
public interface AppDatabase extends DataService {

}
