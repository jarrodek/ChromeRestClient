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
import org.rest.client.event.RequestChangeEvent;
import org.rest.client.event.RequestEndEvent;
import org.rest.client.place.RequestPlace;
import org.rest.client.request.RequestParameters;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.storage.store.objects.FormEncodingObject;
import org.rest.client.storage.store.objects.HistoryObject;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.storage.websql.HeaderRow;
import org.rest.client.storage.websql.StatusCodeRow;
import org.rest.client.ui.AddEncodingView;
import org.rest.client.ui.RequestView;
import org.rest.client.ui.ResponseView;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.dom.client.Style.Overflow;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;
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
	FlowPanel viewFlowPanel;

	public RequestActivity(RequestPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);

		RequestView requestView = this.clientFactory.getRequestView();
		requestView.setPresenter(this);
		viewFlowPanel = new FlowPanel();
		viewFlowPanel.getElement().getStyle().setOverflow(Overflow.HIDDEN);
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
			Log.error("Restore method for this place is not yet implemented.");
			throw new IllegalArgumentException("Not implemented yet");
		} else if(place.isProjectsEndpoint()){
			Log.error("Restore method for this place is not yet implemented.");
			throw new IllegalArgumentException("Not implemented yet");
		} else if(place.isSaved()){
			Log.error("Restore method for this place is not yet implemented.");
			throw new IllegalArgumentException("Not implemented yet");
		} else if(place.isExternal()){
			createExternalRequest(requestView,entryId);
		} else {
			restoreLatestRequest(requestView);
		}
		observeEvents();
	}
	
	
	private void observeEvents() {
		RequestChangeEvent.register(eventBus, new RequestChangeEvent.Handler() {
			@Override
			public void onChange(RequestChangeEvent event) {
//				Log.debug("RequestChangeEvent: " + event.getChangeType()); 
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
				responseView.setPresenter(RequestActivity.this);
				responseView.setResponseData(success, response, requestTime);
				viewFlowPanel.add(responseView);
				ExternalEventsFactory.postMessage(ExternalEventsFactory.EXT_GET_COLLECTED_REQUEST_DATA, null, new Callback<String, Throwable>() {
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
					}
					
					@Override
					public void onFailure(Throwable reason) {
						
					}
				});
			}
		});
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
		//{"URL":"http://127.0.0.1:8888/test?p=cookie",
		//"RESPONSE_HEADERS":[{"name":"Content-Type","value":"text/plain; charset=iso-8859-1"},{"name":"Expires","value":"Thu, 01 Jan 1970 00:00:00 GMT"},{"name":"Set-Cookie","value":"testcookie_1344376133560=\"another value : 1344376133560\""},{"name":"Content-Length","value":"13"},{"name":"Server","value":"Jetty(6.1.x)"}],
		//"REQUEST_HEADERS":[{"name":"User-Agent","value":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.3 (KHTML, like Gecko) Chrome/22.0.1221.0 Safari/537.3"},{"name":"Content-Type","value":"application/x-www-form-urlencoded"},{"name":"Accept","value":"*/*"},{"name":"Referer","value":"http://127.0.0.1:8888/RestClient.html?gwt.codesvr=127.0.0.1:9997"},{"name":"Accept-Encoding","value":"gzip,deflate,sdch"},{"name":"Accept-Language","value":"pl,en-US;q=0.8,en;q=0.6"},{"name":"Accept-Charset","value":"UTF-8,*;q=0.5"}]}
	}
	
	
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
		ExternalEventsFactory.postMessage(ExternalEventsFactory.EXT_GET_EXTERNAL_REQUEST_DATA, requestUUID, new Callback<String, Throwable>() {
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
			}
			
			@Override
			public void onFailure(Throwable reason) {
				Log.error("Can't receive mesage for " + requestUUID);
			}
		});
		
	}
	
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
					view.setUrl(result.getRequestUrl());
					view.setMethod(result.getMethod());
					view.setHeaders(result.getHeaders());
					view.setPayload(result.getPostData());
					setUserDefinedContentEncodingValues(result
							.getFormEncoding());
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
		RequestView view = this.clientFactory.getRequestView();
		RequestObject ro = RequestObject.createRequest();
		ro.setEncoding(view.getEncoding());
		ro.setHeaders(view.getHeaders());
		ro.setMethod(view.getMethod());
		ro.setPayload(view.getPayload());
		ro.setURL(view.getUrl());

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
	public void getStatusCodeInfo(int code, final Callback<StatusCodeRow, Throwable> callback) {
		clientFactory.getStatusesStore().getByKey(code, new StoreResultCallback<StatusCodeRow>(){

			@Override
			public void onSuccess(StatusCodeRow result) {
				callback.onSuccess(result);
			}

			@Override
			public void onError(Throwable e) {
				callback.onFailure(e);
			}});
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
}
