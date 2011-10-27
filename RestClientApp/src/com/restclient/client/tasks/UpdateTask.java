package com.restclient.client.tasks;

import java.util.ArrayList;
import java.util.List;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.gwt.storage.client.Storage;
import com.restclient.client.RestApp;
import com.restclient.client.storage.HeaderInsertRow;

/**
 * Task to perform app update (like headers list to DB).
 * @author Paweł Psztyć
 *
 */
public class UpdateTask implements LoadTask {
	
	TasksCallback callback;
	private final static List<HeaderInsertRow> updHxvalues;
	static{
		updHxvalues = new ArrayList<HeaderInsertRow>();
		updHxvalues.add( new HeaderInsertRow().setName("X-Forwarded-For").setDesc("Originating IP of a client connection to the server").setExample("X-Forwarded-for: 212.77.100.101").setType("request") );
		updHxvalues.add( new HeaderInsertRow().setName("X-Forwarded-Host").setDesc("Origination host name").setExample("X-Forwarded-host: www.google.com").setType("request") );
		updHxvalues.add( new HeaderInsertRow().setName("X-Forwarded-Server").setDesc("Origination server name").setExample("X-Forwarded-server: GAE @ 8.8.8.8").setType("request") );
		updHxvalues.add( new HeaderInsertRow().setName("X-Requested-With").setDesc("Mainly used to identify Ajax requests. Most JavaScript frameworks send this header with value of XMLHttpRequest").setExample("X-Requested-With: XMLHttpRequest").setType("request") );
		updHxvalues.add( new HeaderInsertRow().setName("X-Do-Not-Track").setDesc("Requests a web application to disable their tracking of a user. Mozilla implements the DNT header with a similar purpose").setExample("X-Do-Not-Track: 1").setType("request") );
		updHxvalues.add( new HeaderInsertRow().setName("DNT").setDesc("Requests a web application to disable their tracking of a user. This is Mozilla implementation. Other browsers may use \"X-Do-Not-Track\" header.").setExample("DNT: 1").setType("request") );
		updHxvalues.add( new HeaderInsertRow().setName("X-Frame-Options").setDesc("Clickjacking protection: \"deny\" - no rendering within a frame, \"sameorigin\" - no rendering if origin mismatch").setExample("X-Frame-Options: deny").setType("response") );
		updHxvalues.add( new HeaderInsertRow().setName("X-XSS-Protection").setDesc("Cross-site scripting (XSS) filter").setExample("X-XSS-Protection: 1; mode=block").setType("response") );
		updHxvalues.add( new HeaderInsertRow().setName("X-Content-Type-Options").setDesc("The only defined value, \"nosniff\", prevents Internet Explorer from MIME-sniffing a response away from the declared content-type").setExample("X-Content-Type-Options: nosniff").setType("response") );
		updHxvalues.add( new HeaderInsertRow().setName("X-Forwarded-Proto").setDesc("A de facto standard for identifying the originating protocol of an HTTP request, since a reverse proxy (load balancer) communicates with a web server using HTTP").setExample("X-Forwarded-Proto: https").setType("response") );
		updHxvalues.add( new HeaderInsertRow().setName("X-Powered-By").setDesc("Specifies the technology (ASP.NET, PHP, JBoss, e.g.) supporting the web application (version details are often in X-Runtime, X-Version, or X-AspNet-Version)").setExample("X-Powered-By: PHP/5.2.1").setType("response") );
	}
	
	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		this.callback = callback;
		updateHeadersXvalues();
	}
	
	@Override
	public int getTasksCount() {
		return 1;
	}
	
	/**
	 * Update headers list to handle 
	 * common X headers.
	 */
	private void updateHeadersXvalues(){
		final Storage storage = Storage.getLocalStorageIfSupported();
		String isUpdated = storage.getItem("updHxvalues");
		if( isUpdated != null || isUpdated == "true" ){
			callback.onInnerTaskFinished();
			callback.onSuccess();
			return;
		}
		RestApp.HEADERS_SERVICE.insertHeaders(updHxvalues, new RowIdListCallback() {
			@Override
			public void onFailure(DataServiceException error) {
				if( RestApp.isDebug() ){
					Log.error("Error save headers data to database.", error);
				}
				callback.onFailure(0);
			}

			@Override
			public void onSuccess(List<Integer> rowIds) {
				storage.setItem("updHxvalues", "true");
				callback.onInnerTaskFinished();
				callback.onSuccess();
			}
		});
	}
	
}
