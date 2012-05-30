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

import java.util.Map;
import java.util.Set;

import org.rest.client.ClientFactory;
import org.rest.client.event.AddEncodingEvent;
import org.rest.client.event.ClearFormEvent;
import org.rest.client.place.RequestPlace;
import org.rest.client.request.RequestParameters;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.storage.store.objects.FormEncodingObject;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.ui.AddEncodingView;
import org.rest.client.ui.RequestView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
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
		RequestView.Presenter {

	@SuppressWarnings("unused")
	final private RequestPlace place;
	private EventBus eventBus;

	public RequestActivity(RequestPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);

		RequestView view = this.clientFactory.getRequestView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());
		restoreLatestRequest(view);
		
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

		clientFactory.getFormEncodingsStore().open(
				new StoreResultCallback<Boolean>() {
					@Override
					public void onSuccess(Boolean result) {
						if (!result)
							return;
						clientFactory
								.getFormEncodingsStore()
								.all(new StoreResultCallback<Map<Long, FormEncodingObject>>() {

									@Override
									public void onSuccess(
											Map<Long, FormEncodingObject> result) {

										final RequestView view = clientFactory
												.getRequestView();
										String encodingToSelect = selectCurrentEncoding;

										if (selectCurrentEncoding == null) {
											encodingToSelect = view
													.getEncoding();
										}

										String[] values = new String[result
												.size()];
										Set<Long> keys = result.keySet();
										int i = 0;
										for (Long k : keys) {
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
										Log.error(
												"getFormEncodingsStore.all in RequestActivity",
												e);
									}
								});
					}

					@Override
					public void onError(Throwable e) {
						Log.error(
								"getFormEncodingsStore.open in RequestActivity",
								e);
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
					clientFactory.getFormEncodingsStore().put(feo, null,
							new StoreResultCallback<Long>() {
								@Override
								public void onSuccess(Long result) {
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
}
