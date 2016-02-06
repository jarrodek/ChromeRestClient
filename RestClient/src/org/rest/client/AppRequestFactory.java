package org.rest.client;

import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

import org.rest.client.event.RequestChangeEvent;
import org.rest.client.event.RequestEndEvent;
import org.rest.client.event.RequestStartActionEvent;
import org.rest.client.jso.HistoryObject;
import org.rest.client.jso.RequestObject;
import org.rest.client.log.Log;
import org.rest.client.request.FilesObject;
import org.rest.client.request.FormPayloadData;
import org.rest.client.request.HttpMethodOptions;
import org.rest.client.request.RequestHeadersParser;
import org.rest.client.request.RequestPayloadParser;
import org.rest.client.storage.StoreKeys;
import org.rest.client.storage.store.HistoryRequestStore;
import org.rest.client.storage.store.UrlHistoryStore;
import org.rest.client.ui.ErrorDialogView;

import com.google.gwt.chrome.def.BackgroundJsCallback;
import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.core.client.Scheduler.ScheduledCommand;
import com.google.gwt.file.client.File;
import com.google.gwt.file.client.FileList;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.user.client.Window;
import com.google.gwt.xhr2.client.AbortHandler;
import com.google.gwt.xhr2.client.ErrorHandler;
import com.google.gwt.xhr2.client.FormData;
import com.google.gwt.xhr2.client.LoadHandler;
import com.google.gwt.xhr2.client.LoadStartHandler;
import com.google.gwt.xhr2.client.ProgressEvent;
import com.google.gwt.xhr2.client.ProgressHandler;
import com.google.gwt.xhr2.client.RequestBuilder;
import com.google.gwt.xhr2.client.RequestHeader;
import com.google.gwt.xhr2.client.Response;
import com.google.gwt.xhr2.client.TimeoutHandler;
import com.google.gwt.xhr2.client.UploadLoadHandler;
import com.google.web.bindery.event.shared.EventBus;


public class AppRequestFactory {
	
	private static EventBus eventBus;
	private static boolean requestInProgress = false;
	
	/**
	 * Initialize class.
	 * @param ev
	 */
	public static void initialize(EventBus ev) {
		eventBus = ev;
		startObservers();
	}
	
	/**
	 * Add handlers to events.
	 */
	private static void startObservers() {
		RequestStartActionEvent.register(eventBus, new RequestStartActionEvent.Handler() {
			@Override
			public void onStart(Date time) {
				if(requestInProgress){
					if(RestClient.isDebug()){
						Log.warn("Request already in progress. Wait until previous ends.");
					}
					return;
				}
				try{
					collectRequestData();
				}catch(Exception e) {
					Handler[] handlers = Logger.getLogger("").getHandlers();
					if (handlers != null) {
						for (Handler h : handlers) {
							String msg = e.getMessage();
							h.publish(new LogRecord(Level.SEVERE, msg));
						}
					}
				}
			}
		});
	}
	
	private static void reportFailure(String message, Throwable reason){
		requestInProgress = false;
		if(RestClient.isDebug()){
			Log.error(message, reason);
		}
		StatusNotification.notify(message, StatusNotification.TIME_LONG);
		eventBus.fireEvent(new RequestEndEvent(false, null, 0));
	}
	
	
	private static Date startTime;
	/**
	 * Collects data from the form and starts request.
	 */
	private static void collectRequestData(){
		if(RestClient.isDebug()){
			Log.debug("Collecting data...");
		}
		
		RestClient.collectRequestData(new Callback<RequestObject, Throwable>() {
			@Override
			public void onSuccess(final RequestObject data) {
				
				saveCurrentState(data);
				
				String requestUrl = data.getURL();
				if(requestUrl == null || requestUrl.isEmpty()){
					Throwable t = new Throwable("You must provide URL before request starts.");
					reportFailure("You must provide request URL.", t);
					return;
				}
				requestInProgress = true;
				saveHistory(data);
				//save URL for suggestion oracle
				saveUrl(data.getURL());
				if(RestClient.isDebug()){
					Log.debug("Apply magic variables.");
				}
				//replace magic variables
				MagicVariables mv = new MagicVariables();
				
				data.setURL(mv.apply(requestUrl));
				if(RestClient.isDebug()){
					Log.debug("Magic variables has been applied.");
				}
				String headers = data.getHeaders();
				if(headers != null && !headers.isEmpty()){
					data.setHeaders(mv.apply(headers));
				}
				String payload = data.getPayload();
				if(payload != null && !payload.isEmpty()){
					data.setPayload(mv.apply(payload));
				}
				if(RestClient.isDebug()){
					Log.debug("Sending start signal to background page.");
				}
				RestClient.getClientFactory().getChromeMessagePassing().postMessage(ExternalEventsFactory.EXT_REQUEST_BEGIN, data, new BackgroundJsCallback() {
					@Override
					public void onSuccess(Object message) {
						if(RestClient.isDebug()){
							Log.debug("Message to background page passed.");
						}
						startHttpRequest(data);
					}
					
					@Override
					public void onError(String message) {
						reportFailure("Unknown error occured: " + message,null);
					}
				});
			}
			
			@Override
			public void onFailure(Throwable reason) {
				reportFailure("Unable to collect request data from the form", reason);
			}
		});
	}
	
	private static void startHttpRequest(final RequestObject data) {
		if(RestClient.isDebug()){
			Log.debug("Start new request");
		}
		String requestUrl = data.getURL();
		String method = data.getMethod();
		ArrayList<FilesObject> files = data.getFiles();
		boolean hasPayload = HttpMethodOptions.hasBody(method);
		RequestBuilder builder = new RequestBuilder(requestUrl, method);
		builder.setFollowRedirects(true);
		
		if(hasPayload){
			String payload = data.getPayload();
			if(files != null && files.size() > 0){
				FormData fd = FormData.create();
				if(RestClient.isDebug()){
					Log.debug("Request will use FormData object in order to handle files.");
				}
				
				//check if payload has boudary
				String boudary = RequestPayloadParser.recognizeBoundary(payload);
				boolean extractFromBoundary = false;
				if(boudary != null){
					extractFromBoundary = true;
				}
				
				//set payload
				ArrayList<FormPayloadData> map = RequestPayloadParser.stringToFormArrayList(payload, false, extractFromBoundary);
				for(FormPayloadData _data : map){
					fd.append(_data.getKey(), _data.getValue());
				}
				//set file
				if(RestClient.isDebug()){
					Log.debug("Set " + files.size() + " file(s) in request.");
				}
				for(FilesObject fo : files){
					FileList fls = fo.getFiles();
					String fieldName = fo.getName();
					int len = fls.size();
					for (int i = 0; i < len; i++) {
						File f = fls.get(i);
						fd.append(fieldName, f);
					}
				}
				builder.setRequestFormData(fd);
			} else {
				if (payload != null && !payload.equals("")) {
					if(RestClient.isDebug()){
						Log.debug("Set request data.");
					}
					builder.setRequestData(payload);
				}
			}
		}
		
		ArrayList<RequestHeader> headers = RequestHeadersParser.stringToHeaders(data.getHeaders());
		if (headers == null) {
			headers = new ArrayList<RequestHeader>();
		}
		if (headers.size() > 0) {
			builder.setHeaders(headers);
			if(RestClient.isDebug()){
				if(RestClient.isDebug()){
					Log.debug("Headers","Set request headers:");
					for(RequestHeader item : headers){
						Log.debug("Headers",">>> "+item.getName()+": "+item.getValue());
					}
				}
			}
		} else {
			if(RestClient.isDebug()){
				Log.debug("Headers","No headers to set.");
			}
		}
		
		// builder.setTimeoutMillis(500);
		// builder.setWithCredentials(true);
		
		
		setRequestHandlers(builder);
		
		
		if(RestClient.isDebug()){
			Log.debug("All set. Sending...");
		}
		
		startTime = new Date();
		try {
			builder.send();
		} catch (Throwable e) {
			
			eventBus.fireEvent(new RequestEndEvent(false, null, 0));
			requestInProgress = false;
			ErrorDialogView dialog = RestClient.getClientFactory().getErrorDialogView();
			LogRecord level = new LogRecord(dialog.getHandler().getLevel(), e.getMessage());
			level.setThrown(e);
			level.setLoggerName("request");
			dialog.getHandler().publish(level);
			startTime = null;
		}
	}
	
	private static void onSuccesRequest(final Response response) {
		if(RestClient.isDebug()){
			Log.debug("Request sent successfully. Building response view.");
		}
		requestInProgress = false;
		if(response == null){
			Window.alert("Something goes wrong :(\nResponse is null!");
			return;
		}
		ScheduledCommand sc = new ScheduledCommand() {
			@Override
			public void execute() {
				long loadingTime = new Date().getTime() - startTime.getTime();
				RequestEndEvent event = new RequestEndEvent(true, response, loadingTime);
				eventBus.fireEvent(event);
			}
		};
		Scheduler.get().scheduleDeferred(sc);
	}
	
	
	/**
	 * Set callbacks to request.
	 * @param builder
	 */
	private static void setRequestHandlers(RequestBuilder builder){
		if(RestClient.isDebug()){
			Log.debug("Set request handlers.");
		}
		builder.setAbortHandler(new AbortHandler() {
			@Override
			public void onAbort(ProgressEvent event) {
				requestInProgress = false;
				long loadingTime = 0;
				if(startTime != null)
					loadingTime = new Date().getTime() - startTime.getTime();
				eventBus.fireEvent(new RequestEndEvent(false, null, loadingTime));
				if(RestClient.isDebug()){
					Log.error("Abort request.");
				}
			}
		});
		builder.setErrorHandler(new ErrorHandler() {
			@Override
			public void onError(Response response, RuntimeException exception) {
				if(RestClient.isDebug()){
					Log.error("XMLHttpRequest2 callback::onError", exception);
				}
//				ErrorDialogView dialog = RestClient.getClientFactory().getErrorDialogView();
//				dialog.getHandler().publish(new LogRecord(dialog.getHandler().getLevel(), exception.getMessage()));
				onFailureRequest(response);
			}
		});
		builder.setLoadHandler(new LoadHandler() {
			@Override
			public void onLoaded(Response response, ProgressEvent event) {
				onSuccesRequest(response);
			}

			@Override
			public void onError(Response response, Throwable exception) {
				onFailureRequest(response);
			}
		});
		//
		// Upload data handler
		//
		builder.setUploadProgressHandler(new ProgressHandler() {
			@Override
			public void onProgress(ProgressEvent event) {
				if (event.isLengthComputable()) {
					RequestChangeEvent e = new RequestChangeEvent(RequestChangeEvent.UPLOAD_PROGRESS, event.getTotal(), event.getLoaded());
					eventBus.fireEvent(e);
				}
			}
		});
		//
		// On data upload start.
		//
		builder.setUploadLoadStartHandler(new LoadStartHandler() {
			@Override
			public void onLoadStart(ProgressEvent event) {
				RequestChangeEvent e = new RequestChangeEvent(RequestChangeEvent.UPLOAD_START);
				eventBus.fireEvent(e);
			}
		});
		//
		// When upload is finish
		//
		builder.setUploadLoadHandler(new UploadLoadHandler() {
			@Override
			public void onLoaded(ProgressEvent event) {
				RequestChangeEvent e = new RequestChangeEvent(RequestChangeEvent.UPLOAD_END);
				eventBus.fireEvent(e);
			}
		});
		//
		// download data progress
		//
		builder.setProgressHandler(new ProgressHandler() {
			@Override
			public void onProgress(ProgressEvent event) {
				RequestChangeEvent e = new RequestChangeEvent(RequestChangeEvent.DOWNLOAD_PROGRESS);
				eventBus.fireEvent(e);
			}
		});
		builder.setTimeoutHandler(new TimeoutHandler() {
			@Override
			public void onTimeout(Response response, ProgressEvent event,
					RuntimeException exception) {
				onFailureRequest(response);
			}
		});
	}
	
	private static void onFailureRequest(final Response response) {
		requestInProgress = false;
		ScheduledCommand sc = new ScheduledCommand() {
			@Override
			public void execute() {
				long loadingTime = new Date().getTime() - startTime.getTime();
				RequestEndEvent event = new RequestEndEvent(false, response, loadingTime);
				eventBus.fireEvent(event);
			}
		};
		Scheduler.get().scheduleDeferred(sc);
	}
	/**
	 * Save current form state in local storage.
	 * 
	 * @param data The data to save
	 */
	private static void saveCurrentState(final RequestObject data){
		try{
			Storage store = GWT.create(Storage.class);
			JSONObject jso = new JSONObject();
			jso.put(StoreKeys.LATEST_REQUEST_KEY, data.toJSONObject());
			
			store.getLocal().set(jso.getJavaScriptObject(), new StorageSimpleCallback() {
				
				@Override
				public void onError(String message) {
					Log.warn("Unable to save current form data in local storage. Restore may not be possible on restart: " + message);
				}
				
				@Override
				public void onDone() {
					if(RestClient.isDebug()){
						Log.debug("Current state has been saved to local storage.");
					}
				}
			});
		} catch(Exception e){
			Log.warn("Unable to save current form data in local storage. Restore may not be possible on restart.", e);
		}
	}
	/**
	 * Save current request in history table.
	 * 
	 * @param data
	 */
	private static void saveHistory(RequestObject _data){
		final HistoryObject data = HistoryObject.copyRequestObject(_data);
		
		if(!RestClient.isHistoryEabled()){
			return;
		}
		final String queryUrl = data.getURL();
		final String queryMethod = data.getMethod();
		final String queryHeaders = data.getHeaders();
		final String queryPayload = data.getPayload();
		HistoryRequestStore.queryHistory(queryUrl, -1, -1, new HistoryRequestStore.StoreResultsCallback() {
			@Override
			public void onSuccess(JsArray<JavaScriptObject> result) {
				boolean found = false;
				for (int i = 0; i < result.length(); i++) {
					HistoryObject item = result.get(i).cast();
					
					if(!item.getURL().equals(queryUrl)) {
						continue;
					}
					if(!item.getMethod().equals(queryMethod)) {
						continue;
					}
					String itemHeaders = item.getHeaders();
					if(itemHeaders != null && !itemHeaders.equals(queryHeaders)){
						continue;
					} else if (itemHeaders == null && queryHeaders != null) {
						continue;
					}
					String itemPayload = item.getPayload();
					if(itemPayload != null && !itemPayload.equals("") && !itemPayload.equals(queryPayload)){
						continue;
					} else if(itemPayload != null && queryPayload != null && itemPayload.equals("") && queryPayload.equals("")) {
						
					} else if(itemPayload == null && queryPayload != null) {
						continue;
					}
					found = true;
					break;
				}
				if(!found){
					data.reSetId();
					HistoryRequestStore.insert(data, new HistoryRequestStore.StoreInsertCallback() {
						@Override
						public void onSuccess(int result) {
							if(RestClient.isDebug()){
								Log.debug("Saved new item in history.");
							}
						}
						@Override
						public void onError(Throwable e) {
							if(RestClient.isDebug()){
								Log.error("Unable to save current request data in history table.", e);
							}
						}
					});
				} else {
					if(RestClient.isDebug()){
						Log.debug("Item already exists in history");
					}
				}
			}
			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.error("Unable to save current request data in history table. Error to get history data to compare past data.", e);
				}
			}
		});
		
	}
	/**
	 * Save URL value in database for suggestions.
	 * 
	 * @param url
	 */
	private static void saveUrl(final String url){
		if(url == null || url.isEmpty()){
			return;
		}
		if(RestClient.isDebug()){
			Log.debug("Save URL value into suggestions table.");
		}
		UrlHistoryStore.put(url, (double) new Date().getTime(), new UrlHistoryStore.StoreCallback() {
			
			@Override
			public void onSuccess() {
				if(RestClient.isDebug()){
					Log.debug("Suggestions table updated with new time.");
				}
			}
			
			@Override
			public void onError(Throwable e) {
				Log.warn("IDB url add error", e);
			}
		});
	}
}
