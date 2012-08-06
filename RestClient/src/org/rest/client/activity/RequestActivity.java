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
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.gwt.user.client.ui.FlowPanel;
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
			Log.error("Restore method for this place is not yet implemented.");
			throw new IllegalArgumentException("Not implemented yet");
		} else {
			restoreLatestRequest(requestView);
		}
		observeEvents();
	}
	

	private void observeEvents() {
		RequestChangeEvent.register(eventBus, new RequestChangeEvent.Handler() {
			@Override
			public void onChange(RequestChangeEvent event) {
				Log.debug("RequestChangeEvent: " + event.getChangeType()); 
			}
		});
		RequestEndEvent.register(eventBus, new RequestEndEvent.Handler() {
			@Override
			public void onResponse(boolean success, Response response, long requestTime) {
				if(responseView != null){
					responseView.asWidget().removeFromParent();
					responseView = null;
				}
				responseView = clientFactory.getResponseView();
				responseView.setPresenter(RequestActivity.this);
				responseView.setResponseData(success, response, requestTime);
				viewFlowPanel.add(responseView);
			}
		});
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
}
