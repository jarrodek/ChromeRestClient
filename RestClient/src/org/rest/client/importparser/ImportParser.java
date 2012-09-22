package org.rest.client.importparser;

import java.util.ArrayList;
import java.util.Date;

import org.rest.client.RestClient;
import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.util.Utils;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;

public class ImportParser {
	
	
	public interface ImportParserHandler {
		void onParse(ImportResult result);
	}
	
	
	
	private final String input;
	private ArrayList<RequestObject> requestsResult = new ArrayList<RequestObject>();
	private ArrayList<ProjectObject> projectsResult = new ArrayList<ProjectObject>();
	
	public ImportParser(String data){
		this.input = data;
	}
	
	public void parse(final ImportParserHandler callback){
		if(this.input == null) {
			callback.onParse(null);
			return;
		}
		JSONValue inputValue = null;
		try{
			inputValue = JSONParser.parseStrict(this.input);
		} catch(Exception e){
			if(RestClient.isDebug()){
				Log.error("Unable parse input file.",e);
			}
			callback.onParse(null);
			return;
		}
		
		final JSONObject root = inputValue.isObject();
		if(!(root.containsKey("projects")||root.containsKey("requests"))){
			if(RestClient.isDebug()){
				Log.error("File that you trying to import is not a valid ARC file.");
			}
			callback.onParse(null);
			return;
		}
		
		
		if(root.containsKey("requests")){
			JSONValue requestsValue = root.get("requests");
			if(requestsValue != null){
				JSONArray requestsArray = requestsValue.isArray();
				if(requestsArray != null){
					parseRequestsList(requestsArray, new Callback<Void, Void>() {
						
						@Override
						public void onSuccess(Void result) {
							parseProjects(root, callback);
						}
						@Override
						public void onFailure(Void reason) {
							parseProjects(root, callback);
						}
					});
					
				} else {
					parseProjects(root, callback);
				}
			} else {
				parseProjects(root, callback);
			}
		} else {
			parseProjects(root, callback);
		}
	}
	
	
	private void parseProjects(JSONObject root, final ImportParserHandler callback){
		final ImportResult importResult = new ImportResult();
		importResult.setRequests(requestsResult);
		boolean returnNow = false;
		if(root.containsKey("projects")){
			JSONValue projectsValue = root.get("projects");
			if(projectsValue != null){
				JSONArray projectsArray = projectsValue.isArray();
				if(projectsArray != null){
					parseProjectsList(projectsArray, new Callback<Void, Void>() {
						
						@Override
						public void onSuccess(Void result) {
							importResult.setProjects(projectsResult);
							callback.onParse(importResult);
						}
						
						@Override
						public void onFailure(Void reason) {
							callback.onParse(importResult);
						}
					});
				} else {
					returnNow = true;
				}
			} else {
				returnNow = true;
			}
		} else {
			returnNow = true;
		}
		if(returnNow){
			callback.onParse(importResult);
		}
	}
	
	private int currentRequestObject = 0;
	protected void parseRequestsList(final JSONArray requests, final Callback<Void, Void> callback){
		
		final int len = requests.size();
		if(len == 0){
			callback.onSuccess((Void) GWT.create(Void.class));
			return;
		}
		
		
		Scheduler.RepeatingCommand rc = new Scheduler.RepeatingCommand() {
			@Override
			public boolean execute() {
				JSONValue itemValue = requests.get(currentRequestObject);
				if(itemValue == null) {
					currentRequestObject++;
					return !(currentProjectObject == len);
				}
				JSONObject item = itemValue.isObject();
				if(item == null) {
					currentRequestObject++;
					return !(currentProjectObject == len);
				}
				
				RequestObject ro = RequestObject.createRequest();
				String encoding = Utils.getJsonString(item, "encoding");
				if(encoding != null){
					ro.setEncoding(encoding);
				}
				String headers = Utils.getJsonString(item, "headers");
				if(headers != null){
					ro.setHeaders(headers);
				}
				String method = Utils.getJsonString(item, "method");
				if(method != null){
					ro.setMethod(method);
				}
				String name = Utils.getJsonString(item, "name");
				if(name != null){
					ro.setName(name);
				}
				String payload = Utils.getJsonString(item, "payload");
				if(payload != null){
					ro.setPayload(payload);
				}
				String url = Utils.getJsonString(item, "url");
				if(url != null){
					ro.setURL(url);
				}
				int project = Utils.getJsonInt(item, "project");
				if(project != -1){
					ro.setProject(project);
				}
				long time = Utils.getJsonLong(item, "time");
				if(time > 0){
					ro.setTime(new Date(time));
				}
				if(project > 0){
					Boolean skipHeaders = Utils.getJsoniBool(item, "skipHeaders");
					if(skipHeaders != null){
						ro.setSkipHeaders(skipHeaders.booleanValue());
					}
					Boolean skipHistory = Utils.getJsoniBool(item, "skipHistory");
					if(skipHistory != null){
						ro.setSkipHistory(skipHistory.booleanValue());
					}
					Boolean skipMethod = Utils.getJsoniBool(item, "skipMethod");
					if(skipMethod != null){
						ro.setSkipMethod(skipMethod.booleanValue());
					}
					Boolean skipParams = Utils.getJsoniBool(item, "skipParams");
					if(skipParams != null){
						ro.setSkipParams(skipParams.booleanValue());
					}
					Boolean skipPath = Utils.getJsoniBool(item, "skipPath");
					if(skipPath != null){
						ro.setSkipPath(skipPath.booleanValue());
					}
					Boolean skipPayload = Utils.getJsoniBool(item, "skipPayload");
					if(skipPayload != null){
						ro.setSkipPayload(skipPayload.booleanValue());
					}
					Boolean skipProtocol = Utils.getJsoniBool(item, "skipProtocol");
					if(skipProtocol != null){
						ro.setSkipProtocol(skipProtocol.booleanValue());
					}
					Boolean skipServer = Utils.getJsoniBool(item, "skipServer");
					if(skipServer != null){
						ro.setSkipServer(skipServer.booleanValue());
					}
				}
				requestsResult.add(ro);
				
				currentRequestObject++;
				boolean hasMore = !(currentRequestObject == len);
				if(!hasMore){
					callback.onSuccess((Void) GWT.create(Void.class));
				}
				return hasMore;
			}
		};
		
		
		Scheduler.get().scheduleIncremental(rc);
	}
	private int currentProjectObject = 0;
	protected void parseProjectsList(final JSONArray projects, final Callback<Void, Void> callback){
		
		final int len = projects.size();
		if(len == 0){
			callback.onSuccess((Void) GWT.create(Void.class));
			return;
		}
		
		Scheduler.RepeatingCommand rc = new Scheduler.RepeatingCommand() {

			@Override
			public boolean execute() {
				JSONValue itemValue = projects.get(currentProjectObject);
				if(itemValue == null) {
					currentProjectObject++;
					return !(currentProjectObject == len);
				}
				JSONObject item = itemValue.isObject();
				if(item == null) {
					currentRequestObject++;
					return !(currentProjectObject == len);
				}
				String name = Utils.getJsonString(item, "name");
				int id = Utils.getJsonInt(item, "id");
				
				if(name == null || id < 1) {
					currentRequestObject++;
					return !(currentProjectObject == len);
				}
				ProjectObject project = ProjectObject.create();
				project.setName(name);
				project.setId(id);
				
				long time = Utils.getJsonLong(item, "time");
				if(time > 0){
					project.setCreated(time);
				}  else {
					project.setCreated(new Date().getTime());
				}
				
				projectsResult.add(project);
				
				currentProjectObject++;
				boolean hasMore = !(currentProjectObject == len);
				if(!hasMore){
					callback.onSuccess((Void) GWT.create(Void.class));
				}
				return hasMore;
			}
		};
		
		Scheduler.get().scheduleIncremental(rc);
	}
	
	
}
