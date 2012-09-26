/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.activity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.rest.client.ClientFactory;
import org.rest.client.ExternalEventsFactory;
import org.rest.client.RestClient;
import org.rest.client.event.AddEncodingEvent;
import org.rest.client.event.ClearFormEvent;
import org.rest.client.event.OverwriteUrlEvent;
import org.rest.client.event.RequestEndEvent;
import org.rest.client.place.RequestPlace;
import org.rest.client.request.RedirectData;
import org.rest.client.request.RequestParameters;
import org.rest.client.request.URLParser;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.storage.store.ProjectStoreWebSql;
import org.rest.client.storage.store.objects.FormEncodingObject;
import org.rest.client.storage.store.objects.HistoryObject;
import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.storage.websql.HeaderRow;
import org.rest.client.ui.AddEncodingView;
import org.rest.client.ui.RequestView;
import org.rest.client.ui.ResponseView;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.gwt.core.client.Callback;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.xhr2.client.Header;
import com.google.gwt.xhr2.client.Response;
import com.google.web.bindery.event.shared.EventBus;
import com.google.web.bindery.event.shared.HandlerRegistration;

/**
 * Activities typically restore state ("wake up"), perform initialization
 * ("set up"), and load a corresponding UI ("show up")
 * 
 * @author Paweł Psztyć
 * 
 */
public class RequestActivity extends AppActivity implements
		RequestView.Presenter, ResponseView.ResponsePresenter {

	
	final private RequestPlace place;
	private EventBus eventBus;
	protected ResponseView responseView;
	protected RequestView requestView;
	FlowPanel viewFlowPanel;
	
	public RequestActivity(RequestPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);
		if(RestClient.getOpenedProject() > 0){
			RestClient.setPreviousProject(RestClient.getOpenedProject());
			RestClient.setOpenedProject(-1);
		}

		requestView = this.clientFactory.getRequestView();
		requestView.reset();
		
		requestView.setPresenter(this);
		viewFlowPanel = new FlowPanel();
//		viewFlowPanel.getElement().getStyle().setOverflow(Overflow.HIDDEN);
		viewFlowPanel.add(requestView);
		panel.setWidget(viewFlowPanel);
		
		String entryId = place.getEntryId();
		
		if(place.isHistory()){
			try{
				int historyId = Integer.parseInt(entryId);
				restoreRequestFromHistory(historyId, requestView);
			} catch(Exception e){
				if(RestClient.isDebug()){
					Log.error("Unable read history ID",e);
				}
				StatusNotification.notify("Unable read history ID", StatusNotification.TYPE_ERROR);
				restoreLatestRequest(requestView);
			}
		} else if(place.isProject()){
			
			
			try{
				int projectId = Integer.parseInt(entryId);
				RestClient.setOpenedProject(projectId);
				restoreRequestFromProject(projectId, -1, requestView);
			} catch(Exception e){
				if(RestClient.isDebug()){
					Log.error("Unable read project ID",e);
				}
				StatusNotification.notify("Unable read project ID", StatusNotification.TYPE_ERROR);
				restoreLatestRequest(requestView);
			}
			
			
		} else if(place.isProjectsEndpoint()){
			try{
				int endpointId = Integer.parseInt(entryId);
				restoreRequestFromProject(-1, endpointId, requestView);
			} catch(Exception e){
				if(RestClient.isDebug()){
					Log.error("Unable read project's endpoint ID",e);
				}
				StatusNotification.notify("Unable read project data", StatusNotification.TYPE_ERROR);
				restoreLatestRequest(requestView);
			}
		} else if(place.isSaved()){
			try{
				int savedId = Integer.parseInt(entryId);
				restoreFormSavedRequest(savedId, requestView);
			} catch(Exception e){
				if(RestClient.isDebug()){
					Log.error("Unable read saved item ID",e);
				}
				StatusNotification.notify("Unable read saved request data", StatusNotification.TYPE_ERROR);
				restoreLatestRequest(requestView);
			}
		} else if(place.isExternal()){
			createExternalRequest(requestView,entryId);
		} else {
			restoreLatestRequest(requestView);
		}
		observeEvents();
	}
	
	/**
	 * 
	 * @param projectId -1 if project ID is unknown
	 * @param endopintId -1 for default endpoint (first one) 
	 * @param requestView
	 */
	private void restoreRequestFromProject(int projectId, int endopintId,
			final RequestView requestView) {
		if(projectId == -1 && endopintId == -1){
			if(RestClient.isDebug()){
				Log.error("Project ID and endpoint ID can't be -1 at once.");
			}
			StatusNotification.notify("Unable read project data", StatusNotification.TYPE_ERROR);
			restoreLatestRequest(requestView);
			return;
		}
		final ProjectStoreWebSql projectsStore = clientFactory.getProjectsStore();
		if(endopintId == -1){
			projectsStore.getByKey(projectId, new StoreResultCallback<ProjectObject>(){

				@Override
				public void onSuccess(ProjectObject result) {
					restoreDefaultRequestFromProject(result, requestView);
				}

				@Override
				public void onError(Throwable e) {
					if(RestClient.isDebug()){
						Log.error("Unable read project data.", e);
					}
					StatusNotification.notify("Unable read project data", StatusNotification.TYPE_ERROR);
				}
			});
		} else {
			clientFactory.getRequestDataStore().getByKey(endopintId, new StoreResultCallback<RequestObject>(){
				@Override
				public void onSuccess(final RequestObject result) {
					if(result.getProject() > 0){
						RestClient.setOpenedProject(result.getProject());
						projectsStore.getByKey(result.getProject(), new StoreResultCallback<ProjectObject>(){
	
							@Override
							public void onSuccess(ProjectObject project) {
								restoreProjectEndpoint(project, result, requestView);
							}
	
							@Override
							public void onError(Throwable e) {
								if(RestClient.isDebug()){
									Log.error("Unable read project data.", e);
								}
								StatusNotification.notify("Unable read project data", StatusNotification.TYPE_ERROR);
							}
						});
					} else {
						if(RestClient.isDebug()){
							Log.error("Project does not contain selected endpoint.");
						}
						StatusNotification.notify("Project does not contain selected endpoint.", StatusNotification.TYPE_ERROR);
					}
				}

				@Override
				public void onError(Throwable e) {
					if(RestClient.isDebug()){
						Log.error("Unable read project data.", e);
					}
					StatusNotification.notify("Unable read project's endpoint data", StatusNotification.TYPE_ERROR);
				}
			});
		}
	}
	
	private void restoreDefaultRequestFromProject(final ProjectObject project, final RequestView requestView){
		if(project == null || project.getId() <= 0){
			if(RestClient.isDebug()){
				Log.error("No such project.");
			}
			StatusNotification.notify("No such project.", StatusNotification.TYPE_ERROR);
		}
		clientFactory.getRequestDataStore().getService().getProjectDefaultRequests(project.getId(), new ListCallback<RequestObject>(){

			@Override
			public void onFailure(DataServiceException error) {
				if(RestClient.isDebug()){
					Log.error("Can't find default endpoint for this project. Database error.",error);
				}
				StatusNotification.notify("Can't find default endpoint for this project.", StatusNotification.TYPE_ERROR);
			}

			@Override
			public void onSuccess(List<RequestObject> result) {
				if(result == null || result.size() == 0){
					if(RestClient.isDebug()){
						Log.error("Can't find default endpoint for this project.");
					}
					StatusNotification.notify("Can't find default endpoint for this project.", StatusNotification.TYPE_ERROR);
					return;
				}
				restoreProjectEndpoint(project, result.get(0), requestView);
			}});
	}
	
	private void restoreProjectEndpoint(final ProjectObject project, final RequestObject request, final RequestView requestView){
		
		showProjectRelatedData(project.getId(),project, requestView);
		
		boolean canOvervriteCurrentParameters = false;
		
		if(RestClient.getOpenedProject() == RestClient.getPreviousProject()){
			canOvervriteCurrentParameters = true;
		}
		
		if(!(canOvervriteCurrentParameters && request.isSkipHeaders())){
			requestView.setHeaders(request.getHeaders());
		}
		if(!(canOvervriteCurrentParameters && request.isSkipMethod())){
			requestView.setMethod(request.getMethod());
		}
		if(!(canOvervriteCurrentParameters && request.isSkipPayload())){
			requestView.setPayload(request.getPayload());
		}
		
		Storage store = Storage.getLocalStorageIfSupported();
		
		String _oldUrl = store.getItem(LocalStore.LATEST_REQUEST_KEY); 
		if(_oldUrl == null || _oldUrl.isEmpty()){
			requestView.setUrl(request.getURL());
			Log.debug("OLD URL is null.");
			return;
		}
		JSONValue oldUrlValue = JSONParser.parseStrict(_oldUrl);
		if(!oldUrlValue.isObject().containsKey("url")){
			requestView.setUrl(request.getURL());
			Log.debug("No URL key in old url.");
			return;
		}
		
		String oldUrl = oldUrlValue.isObject().get("url").isString().stringValue();
		
		String newUrl = request.getURL();
		URLParser urlData = new URLParser().parse(newUrl);
		URLParser oldUrlData = new URLParser().parse(oldUrl);
		
		if(canOvervriteCurrentParameters && request.isSkipHistory()){
			//remove hash from restored and get one from latest
			urlData.setAnchor(oldUrlData.getAnchor());
		}
		if(canOvervriteCurrentParameters && request.isSkipParams()){
			//remove query string from restored and get one from latest
			Log.debug("Old params: " + oldUrlData.getQuery());
			urlData.setQuery(oldUrlData.getQuery());
		}
		if(canOvervriteCurrentParameters && request.isSkipPath()){
			//remove path from restored and get one from latest
			urlData.setPath(oldUrlData.getPath());
		}
		if(canOvervriteCurrentParameters && request.isSkipProtocol()){
			//remove hash from restored and get one from latest
			urlData.setProtocol(oldUrlData.getProtocol());
		}
		if(canOvervriteCurrentParameters && request.isSkipServer()){
			//remove hash from restored and get one from latest
			urlData.setAuthority(oldUrlData.getAuthority());
		}
		
		requestView.setUrl(urlData.toString());
		
		setUserDefinedContentEncodingValues(request
				.getEncoding());
		RestClient.fixChromeLayout();
		
	}
	
	
	private void showProjectRelatedData(final int projectId, final ProjectObject project, final RequestView requestView){
		clientFactory.getRequestDataStore().getService().getProjectRequests(projectId, new ListCallback<RequestObject>(){

			@Override
			public void onFailure(DataServiceException error) {
				if(RestClient.isDebug()){
					Log.error("Unable to find related projects.", error);
				}
			}
	
			@Override
			public void onSuccess(final List<RequestObject> request) {
				if(project == null){
					ProjectStoreWebSql projectsStore = clientFactory.getProjectsStore();
					projectsStore.getByKey(projectId, new StoreResultCallback<ProjectObject>(){

						@Override
						public void onSuccess(ProjectObject project) {
							requestView.setProjectData(project, request);
						}

						@Override
						public void onError(Throwable e) {
							if(RestClient.isDebug()){
								Log.error("Unable read project data.", e);
							}
							StatusNotification.notify("Unable read project related data", StatusNotification.TYPE_ERROR);
						}
					});
				} else {
					requestView.setProjectData(project, request);
				}
			}});
	}
	

	private void observeEvents() {
//		RequestChangeEvent.register(eventBus, new RequestChangeEvent.Handler() {
//			@Override
//			public void onChange(RequestChangeEvent event) {
//				Log.debug("RequestChangeEvent: " + event.getChangeType()); 
//			}
//		});
		OverwriteUrlEvent.register(eventBus, new OverwriteUrlEvent.Handler() {
			@Override
			public void onUrlChange(String url) {
				requestView.setUrl(url);
			}
		});
		RequestEndEvent.register(eventBus, new RequestEndEvent.Handler() {
			@Override
			public void onResponse(boolean success, final Response response, long requestTime) {
				if(responseView != null){
					responseView.asWidget().removeFromParent();
					responseView = null;
				}
				responseView = clientFactory.getResponseView();
				viewFlowPanel.add(responseView);
				responseView.setPresenter(RequestActivity.this);
				responseView.setResponseData(success, response, requestTime);
				
				
				
				/**
				 * Get request and response headers data from Chrome Extensions API
				 */
				clientFactory.getChromeMessagePassing().postMessage(ExternalEventsFactory.EXT_GET_COLLECTED_REQUEST_DATA, null, new Callback<String, Throwable>() {
					@Override
					public void onSuccess(String result) {
						if(result == null){
							responseView.setRequestHeadersExternal(null);
							responseView.setResponseHeadersExternal(null);
							return;
						}
						JSONObject parsedResponse = null;
						try{
							parsedResponse = JSONParser.parseStrict(result).isObject();
						}catch(Exception e){
							responseView.setRequestHeadersExternal(null);
							responseView.setResponseHeadersExternal(null);
							return;
						}
						
						responseView.setRequestHeadersExternal(extractHeadersExternal(parsedResponse, "REQUEST_HEADERS"));
						responseView.setResponseHeadersExternal(extractHeadersExternal(parsedResponse, "RESPONSE_HEADERS"));
						
						
						//look for redirections
						JSONValue redirectValue = parsedResponse.get("REDIRECT_DATA");
						if(redirectValue != null){
							ArrayList<RedirectData> redirects = getRedirectData(redirectValue.isArray());
							if(redirects != null && redirects.size() > 0){
								responseView.setRedirectData(redirects);
							}
						}
						
						
						responseView.scrollToView();
					}
					
					@Override
					public void onFailure(Throwable reason) {
						
					}
				});
			}
		});
	}
	
	
	private ArrayList<RedirectData> getRedirectData(JSONArray response){
		ArrayList<RedirectData> result = new ArrayList<RedirectData>();
		if(response == null){
			return result;
		}
		int size = response.size();
		for(int i=0; i<size; i++){
			JSONValue itemValue = response.get(i);
			JSONObject item = itemValue.isObject();
			if(item == null) continue;
			
			boolean fromCache = item.get("fromCache").isBoolean().booleanValue();
			String redirectUrl = item.get("redirectUrl").isString().stringValue();
			
			String statusLine = null;
			JSONValue statusLineValue = item.get("statusLine");
			if(statusLineValue != null){
				statusLine = item.get("statusLine").isString().stringValue();
			}
			int statusCode = Integer.parseInt(item.get("statusCode").isNumber().toString());
			ArrayList<Header> headers = extractHeadersExternal(item, "responseHeaders");
			RedirectData redirect = new RedirectData();
			redirect.setRedirectUrl(redirectUrl);
			redirect.setFromCache(fromCache);
			redirect.setResponseHeaders(headers);
			redirect.setStatusCode(statusCode);
			if(statusLine != null)
				redirect.setStatusLine(statusLine);
			result.add(redirect);
		}
		return result;
	}
	
	
	private ArrayList<Header> extractHeadersExternal(JSONObject response, String key){
		ArrayList<Header> headers = new ArrayList<Header>();
		JSONValue valuesValue = response.get(key);
		if(valuesValue == null){
			return headers;
		}
		JSONArray arr = valuesValue.isArray();
		if(arr == null){
			return headers;
		}
		int len = arr.size();
		for(int i=0; i<len; i++){
			JSONValue item = arr.get(i);
			final String name = item.isObject().get("name").isString().stringValue();
			final String value = item.isObject().get("value").isString().stringValue();
			Header header = new Header() {
				@Override
				public String getName() {
					return name;
				}

				@Override
				public String getValue() {
					return value;
				}

				@Override
				public String toString() {
					return name + " : " + value;
				}
			};
			headers.add(header);
		}
		return headers;
	}
	
	/**
	 * Restore request from history DB
	 * @param historyId
	 * @param requestView
	 */
	private void restoreRequestFromHistory(int historyId,
			final RequestView requestView) {
		RestClient.getClientFactory().getHistoryRequestStore().getHistoryItem(historyId, new StoreResultCallback<HistoryObject>() {
			
			@Override
			public void onSuccess(HistoryObject result) {
				requestView.setUrl(result.getURL());
				requestView.setMethod(result.getMethod());
				requestView.setHeaders(result.getHeaders());
				requestView.setPayload(result.getPayload());
				setUserDefinedContentEncodingValues(result
						.getEncoding());
				RestClient.fixChromeLayout();
			}
			
			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.error("Unable read history data",e);
				}
				StatusNotification.notify("Unable read history data", StatusNotification.TYPE_ERROR);
			}
		});
	}
	
	
	private void createExternalRequest(final RequestView view, final String requestUUID){
		clientFactory.getChromeMessagePassing().postMessage(ExternalEventsFactory.EXT_GET_EXTERNAL_REQUEST_DATA, requestUUID, new Callback<String, Throwable>() {
			@Override
			public void onSuccess(String result) {
				if(result.isEmpty()){
					StatusNotification.notify("Data from external extension is no longer available :(", StatusNotification.TYPE_CRITICAL, StatusNotification.TIME_MEDIUM);
					return;
				}
				JSONValue parsedValue = null;
				try{
					parsedValue = JSONParser.parseStrict(result);
				}catch(Exception e){
				}
				if(parsedValue == null){
					Log.error("Malformed External Data Exception. Passed data: " + result);
					StatusNotification.notify("Unable to read data from external extension :(", StatusNotification.TYPE_CRITICAL, StatusNotification.TIME_MEDIUM);
					return;
				}
				JSONObject obj = parsedValue.isObject();
				if(obj.containsKey("error")){
					if(obj.get("error").isBoolean().booleanValue()){
						Log.error("Error get External Data. Message: " + obj.get("message").isString().stringValue());
						StatusNotification.notify(obj.get("message").isString().stringValue(), StatusNotification.TYPE_CRITICAL, StatusNotification.TIME_MEDIUM);
						return;
					}
				}
				if(obj.containsKey("data")){
					JSONObject dataObj = obj.get("data").isObject();
					if(dataObj.containsKey("url")){
						view.setUrl(dataObj.get("url").isString().stringValue());
					}
					if(dataObj.containsKey("method")){
						view.setMethod(dataObj.get("method").isString().stringValue());
					}
					if(dataObj.containsKey("headers")){
						view.setHeaders(dataObj.get("headers").isString().stringValue());
					}
					if(dataObj.containsKey("payload")){
						view.setPayload(dataObj.get("payload").isString().stringValue());
					}
					if(dataObj.containsKey("encoding")){
						view.setEncoding(dataObj.get("encoding").isString().stringValue());
					}
				}
				RestClient.fixChromeLayout();
			}
			
			@Override
			public void onFailure(Throwable reason) {
				Log.error("Can't receive mesage for " + requestUUID);
			}
		});
		
	}
	
	private void restoreFormSavedRequest(final int savedId, final RequestView view){
		clientFactory.getRequestDataStore().getByKey(savedId, new StoreResultCallback<RequestObject>(){

			@Override
			public void onSuccess(RequestObject result) {
				if (result == null) {
					view.setUrl(null);
					view.setMethod(null);
					view.setHeaders(null);
					view.setPayload(null);
					view.setEncoding(null);
					return;
				}
				if(result.getProject() > 0){
					showProjectRelatedData(result.getProject(), null, view);
					RestClient.setOpenedProject(result.getProject());
				}
				
				view.setUrl(result.getURL());
				view.setMethod(result.getMethod());
				view.setHeaders(result.getHeaders());
				view.setPayload(result.getPayload());
				setUserDefinedContentEncodingValues(result
						.getEncoding());
				RestClient.fixChromeLayout();
			}

			@Override
			public void onError(Throwable e) {
				Log.error("Unable read stored data :(", e);
				StatusNotification.notify("Unable read stored data :(", StatusNotification.TYPE_CRITICAL, StatusNotification.TIME_MEDIUM);
			}});
	}
	
	
	/**
	 * Restore latest, not saved request
	 * @param view
	 */
	private void restoreLatestRequest(final RequestView view){
		RequestParameters
			.restoreLatest(new Callback<RequestParameters, Throwable>() {
				@Override
				public void onSuccess(RequestParameters result) {
					if (result == null) {
						view.setUrl(null);
						view.setMethod(null);
						view.setHeaders(null);
						view.setPayload(null);
						view.setEncoding(null);
						return;
					}
					
					if(result.getProject() > 0){
						showProjectRelatedData(result.getProject(), null, view);
						RestClient.setOpenedProject(result.getProject());
					}
					
					view.setUrl(result.getRequestUrl());
					view.setMethod(result.getMethod());
					view.setHeaders(result.getHeaders());
					view.setPayload(result.getPostData());
					setUserDefinedContentEncodingValues(result
							.getFormEncoding());
					RestClient.fixChromeLayout();
				}
	
				@Override
				public void onFailure(Throwable caught) {
				}
			});
	}
	
	private void setUserDefinedContentEncodingValues(
			final String selectCurrentEncoding) {

		
		clientFactory.getFormEncodingStore().all(new StoreResultCallback<Map<Integer,FormEncodingObject>>() {
			
			@Override
			public void onSuccess(Map<Integer, FormEncodingObject> result) {
				final RequestView view = clientFactory
						.getRequestView();
				String encodingToSelect = selectCurrentEncoding;

				if (selectCurrentEncoding == null) {
					encodingToSelect = view
							.getEncoding();
				}
				

				String[] values = new String[result
						.size()];
				Set<Integer> keys = result.keySet();
				int i = 0;
				for (Integer k : keys) {
					FormEncodingObject dbvalue = result
							.get(k);
					if (dbvalue != null)
						values[i] = dbvalue
								.getEncoding();
					i++;
				}

				view.appendEncodingValues(values);
				view.setEncoding(encodingToSelect);
			}
			
			@Override
			public void onError(Throwable e) {
				e.printStackTrace();
				Log.error("getFormEncodingsStore.all in RequestActivity",e);
			}
		});
	}

	@Override
	public String mayStop() {
		revokeDownloadData();
		
		RequestView view = this.clientFactory.getRequestView();
		RequestObject ro = RequestObject.createRequest();
		ro.setEncoding(view.getEncoding());
		ro.setHeaders(view.getHeaders());
		ro.setMethod(view.getMethod());
		ro.setPayload(view.getPayload());
		ro.setURL(view.getUrl());
		ro.setProject(RestClient.getOpenedProject());
		
		this.clientFactory.getLocalStore().put(ro.toJSON(),
				LocalStore.LATEST_REQUEST_KEY,
				new StoreResultCallback<String>() {
					@Override
					public void onSuccess(String result) {
					}

					@Override
					public void onError(Throwable e) {
					}
				});

		return null;
	}

	private static HandlerRegistration addDialogRegistrtion = null;
	
	@Override
	public void requestAddEncodingDialog(final String previousEncoding) {
		AddEncodingView dialog = clientFactory.getAddEncodingView(eventBus);
		dialog.show();

		final RequestView view = this.clientFactory.getRequestView();
		

		final AddEncodingEvent.Handler handler = new AddEncodingEvent.Handler() {
			@Override
			public void onAddEncoding(final String encoding) {
				addDialogRegistrtion.removeHandler();
				if (encoding == null || encoding.isEmpty()) {
					view.setEncoding(previousEncoding);
				} else {
					FormEncodingObject feo = FormEncodingObject.create();
					feo.setEncoding(encoding);
					clientFactory.getFormEncodingStore().put(feo, null,
							new StoreResultCallback<Integer>() {
								@Override
								public void onSuccess(Integer result) {
									setUserDefinedContentEncodingValues(encoding);
								}

								@Override
								public void onError(Throwable e) {
									e.printStackTrace();
									Log.error(
											"RequestActivity::requestAddEncodingDialog->AddEncodingEvent.Handler->store::put",
											e);
									view.setEncoding(previousEncoding);
								}
							});
				}

				addDialogRegistrtion = null;
			}
		};

		addDialogRegistrtion = AddEncodingEvent.register(eventBus, handler);
	}

	@Override
	public void fireClearAllEvent() {
		eventBus.fireEvent(new ClearFormEvent());
	}

	@Override
	public void getResponseHeadersInfo(ArrayList<String> names,
			final Callback<List<HeaderRow>, Throwable> callback) {
		
		clientFactory.getHeadersStore().getResponseHeadersByName(names, new StoreResultCallback<List<HeaderRow>>() {
			
			@Override
			public void onSuccess(List<HeaderRow> result) {
				callback.onSuccess(result);
			}
			
			@Override
			public void onError(Throwable e) {
				callback.onFailure(e);
			}
		});
	}

	@Override
	public void getRequestHeadersInfo(ArrayList<String> names,
			final Callback<List<HeaderRow>, Throwable> callback) {
		clientFactory.getHeadersStore().getRequestHeadersByName(names, new StoreResultCallback<List<HeaderRow>>() {
			
			@Override
			public void onSuccess(List<HeaderRow> result) {
				callback.onSuccess(result);
			}
			
			@Override
			public void onError(Throwable e) {
				callback.onFailure(e);
			}
		});
	}
	
	
	private String exportFileObjectUrl = null;
	@Override
	public String createDownloadData(String body, String endoding) {
		if(exportFileObjectUrl != null){
			revokeDownloadData();
		}
		exportFileObjectUrl = createDownloadDataImpl(body, endoding); 
		return exportFileObjectUrl;
	}
	private final native String createDownloadDataImpl(String data, String endoding) /*-{
		var blob = new $wnd.Blob([data], {type: endoding});
		return $wnd.URL.createObjectURL(blob);
	}-*/;
	
	
	@Override
	public void revokeDownloadData() {
		if(exportFileObjectUrl != null){
			revokeDownloadDataImpl(exportFileObjectUrl);
			exportFileObjectUrl = null;
		}
	}
	private final native void revokeDownloadDataImpl(String url) /*-{
		$wnd.URL.revokeObjectURL(url);
	}-*/;
	
}
