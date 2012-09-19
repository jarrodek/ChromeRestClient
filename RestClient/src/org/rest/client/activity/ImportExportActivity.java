package org.rest.client.activity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.deprecated.DataExportImpl;
import org.rest.client.deprecated.ImportDataCallback;
import org.rest.client.deprecated.ImportListingDialog;
import org.rest.client.deprecated.ImportRequest;
import org.rest.client.deprecated.ImportSuggestionsCallback;
import org.rest.client.deprecated.LoaderDialog;
import org.rest.client.deprecated.RestForm;
import org.rest.client.deprecated.SuggestionImportItem;
import org.rest.client.event.StoreDataEvent;
import org.rest.client.place.ImportExportPlace;
import org.rest.client.request.ApplicationSession;
import org.rest.client.request.ApplicationSessionCallback;
import org.rest.client.request.PingRequest;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.storage.websql.ExportedDataInsertItem;
import org.rest.client.ui.ImportExportView;
import org.rest.client.ui.desktop.StatusNotification;
import org.rest.client.util.Utils;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.storage.client.StorageEvent;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.web.bindery.event.shared.EventBus;

public class ImportExportActivity extends AppActivity implements
		ImportExportView.Presenter {

	final private ImportExportPlace place;
	private EventBus eventBus;
	private ImportExportView view;

	public ImportExportActivity(ImportExportPlace place,
			ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel,
			com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);

		view = clientFactory.getImportExportView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());

		// Old system setup
		checkUserSession();
		handleSessionChange();
		StoreDataEvent.register(eventBus, new StoreDataEvent.Handler() {
			@Override
			public void onSuccess() {
				if (view != null)
					view.serverControlsSetEnabled(true);
			}

			@Override
			public void onFailure() {
				if (view != null)
					view.serverControlsSetEnabled(true);
			}
		});

		if (place.isServerImport()) {
			importData(place.getServerImportApplicationId());
		}
	}

	//
	// OLD SYSTEM
	//
	private String applicationUserId = null;

	private void checkUserSession() {
		if (RestClient.isDebug()) {
			Log.debug("Checking session status on applications server.");
		}

		PingRequest.getSession(new ApplicationSessionCallback() {

			@Override
			public void onSuccess(ApplicationSession session) {
				if (session.getState() == ApplicationSession.CONNECTED) {
					applicationUserId = session.getUserId();
					view.setIsUserView();
				} else {
					view.setIsNotUserView();
				}
			}

			@Override
			public void onFailure(String message, Throwable exception) {
				if (RestClient.isDebug()) {
					Log.error(message, exception);
				}
				StatusNotification.notify(message,
						StatusNotification.TYPE_CRITICAL);
			}
		});
	}

	@Override
	public String getApplicationUserId() {
		return applicationUserId;
	}

	/**
	 * When clicking to "Connect" button application creates new window to login
	 * to application. When returning it will redirect user to auth.html page.
	 * This page sets localStorage "applogin" value to current time. When it
	 * done this handler should hide connect controls and show other options.
	 * 
	 */
	private void handleSessionChange() {
		addNativeStorageEventHandlerandler(new StorageEvent.Handler() {
			@Override
			public void onStorageChange(StorageEvent event) {
				checkUserSession();
			}
		});
	}

	/**
	 * Fixed storage event handler...
	 * 
	 * @param handler
	 */
	private final native void addNativeStorageEventHandlerandler(
			StorageEvent.Handler handler) /*-{
		var clb = $entry(function(event) {
			handler.@com.google.gwt.storage.client.StorageEvent.Handler::onStorageChange(Lcom/google/gwt/storage/client/StorageEvent;)(event);
		});
		$wnd.addEventListener('storage', clb, true);
	}-*/;

	@Override
	public void serverStoreAction() {
		DataExportImpl impl = new DataExportImpl();
		impl.setEventBus(eventBus);
		impl.synch();
	}

	@Override
	public void doServerImport(String[] keys) {
		if (keys.length == 0) {
			StatusNotification.notify("No items to import.",
					StatusNotification.TYPE_ERROR,
					StatusNotification.TIME_SHORT);
			return;
		}
		final LoaderDialog dialog = new LoaderDialog(
				"Downloading data. Please wait.", false);
		dialog.show();

		ImportRequest.importData(keys, new ImportDataCallback() {

			@Override
			public void onSuccess(final List<RestForm> result) {
				if (result.size() == 0) {
					StatusNotification
							.notify("Something went wrong. There is no data to save :(",
									StatusNotification.TYPE_ERROR);
					dialog.hide();
					return;
				}
				final ArrayList<RequestObject> importData = new ArrayList<RequestObject>();
				for (RestForm _i : result) {

					String data = _i.getData();
					JSONValue value = null;
					try {
						value = JSONParser.parseLenient(data);
					} catch (Exception e) {
						Log.error("Unable to parse data: " + data, e);
						continue;
					}
					if (value == null) {
						continue;
					}
					JSONObject obj = value.isObject();
					if (obj == null) {
						continue;
					}
					final RequestObject ro = RequestObject.createRequest();

					String url = Utils.getJsonString(obj, "url");
					if (url != null) {
						ro.setURL(url);
					}
					String formEncoding = Utils.getJsonString(obj,
							"formEncoding");
					if (formEncoding != null) {
						ro.setEncoding(formEncoding);
					}
					String post = Utils.getJsonString(obj, "post");
					if (post != null) {
						ro.setPayload(post);
					}
					String method = Utils.getJsonString(obj, "method");
					if (method != null) {
						ro.setMethod(method);
					}
					JSONArray headersArray = obj.get("headers").isArray();
					String headers = "";
					if (headersArray != null) {
						int cnt = headersArray.size();
						for (int j = 0; j < cnt; j++) {
							JSONValue _tmp = headersArray.get(j);
							if (_tmp == null) {
								continue;
							}
							JSONObject _data = _tmp.isObject();
							if (_data == null) {
								continue;
							}
							Set<String> keys = _data.keySet();
							if (keys.size() == 1) {
								String headerName = keys.iterator().next();
								JSONValue headerValueJs = _data.get(headerName);
								if (headerValueJs == null) {
									continue;
								}
								JSONString _headerValueJS = headerValueJs
										.isString();
								String headerValue = _headerValueJS
										.stringValue();
								headers += headerName + ": " + headerValue
										+ "\n";
							}
						}
					}
					ro.setHeaders(headers);
					ro.setName(_i.getName());
					importData.add(ro);
				}

				clientFactory
						.getRequestDataStore()
						.getService()
						.insertImportData(importData, new Date(),
								new RowIdListCallback() {
									@Override
									public void onFailure(
											DataServiceException error) {
										StatusNotification
												.notify("Unable to save data to local database :(",
														StatusNotification.TYPE_ERROR);
										if (RestClient.isDebug()) {
											Log.error(
													"Unable to vave data to local database :(",
													error);
										}
										dialog.hide();
									}

									@Override
									public void onSuccess(List<Integer> rowIds) {
										//
										// Insert into exported list to prevent
										// duplicates on server side.
										//
										List<ExportedDataInsertItem> exported = new ArrayList<ExportedDataInsertItem>();
										int i = 0;
										for (RestForm form : result) {
											int dbId = rowIds.get(i);
											ExportedDataInsertItem item = new ExportedDataInsertItem(
													form.key);
											item.setReferenceId(dbId);
											item.setType("form");
											exported.add(item);
											i++;
										}

										clientFactory
												.getExportedDataReferenceService()
												.insertExported(exported,
														new VoidCallback() {
															@Override
															public void onFailure(
																	DataServiceException error) {
																if (RestClient
																		.isDebug()) {
																	Log.error(
																			"Unable to insert imported references. During export duplicates may occur.",
																			error);
																}
															}

															@Override
															public void onSuccess() {
															}
														});

										StatusNotification.notify(
												"Saved import data.",
												StatusNotification.TYPE_NORMAL,
												StatusNotification.TIME_MEDIUM);
										dialog.hide();
									}
								});
			}

			@Override
			public void onFailure(String message, Throwable exception) {
				if (RestClient.isDebug()) {
					if (exception != null) {
						Log.error(message, exception);
					} else {
						Log.error(message);
					}
				}
				StatusNotification.notify(message,
						StatusNotification.TYPE_ERROR);
				dialog.hide();
			}
		});
	}

	private void importData(final String importUid) {
		// Show dialog
		final LoaderDialog dialog = new LoaderDialog(
				"Preparing data to download. Please wait.", false);
		dialog.show();

		// Make request
		ImportRequest.getImportSuggestions(importUid,
				new ImportSuggestionsCallback() {

					@Override
					public void onSuccess(List<SuggestionImportItem> result) {
						dialog.hide();
						if (result == null) {
							StatusNotification.notify(
									"Server returns empty data",
									StatusNotification.TYPE_ERROR);
//							storeData.setEnabled(true);
//							restoreData.setEnabled(true);
							return;
						}
						final ImportListingDialog importDialog = new ImportListingDialog(ImportExportActivity.this);
						importDialog.append(result);
						//
						// delay show dialog for data providers to refresh the
						// list
						// and show dialog in it's place (center)
						//
						new Timer() {
							@Override
							public void run() {
								importDialog.show();
							}
						}.schedule(200);
					}

					@Override
					public void onFailure(String message, Throwable exception) {
						if (RestClient.isDebug()) {
							if (exception != null) {
								Log.error(message, exception);
							} else {
								Log.error(message);
							}
						}
						StatusNotification.notify(message,
								StatusNotification.TYPE_ERROR);
						dialog.hide();
//						storeData.setEnabled(true);
//						restoreData.setEnabled(true);
					}
				});
	}
}
