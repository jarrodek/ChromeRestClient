package org.rest.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

import org.rest.client.event.RequestChangeEvent;
import org.rest.client.event.RequestEndEvent;
import org.rest.client.event.RequestStartActionEvent;
import org.rest.client.event.RequestStopEvent;
import org.rest.client.request.FilesObject;
import org.rest.client.request.FormPayloadData;
import org.rest.client.request.RequestHeadersParser;
import org.rest.client.request.RequestPayloadParser;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.HistoryRequestStoreWebSql;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.storage.store.UrlHistoryStoreWebSql;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.storage.websql.UrlRow;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.user.client.Window;
import com.google.gwt.xhr2.client.AbortHandler;
import com.google.gwt.xhr2.client.ErrorHandler;
import com.google.gwt.xhr2.client.File;
import com.google.gwt.xhr2.client.FileList;
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
	 * @return true if some request is already in progress.
	 */
	public static boolean isRequestInProgress(){
		return requestInProgress;
	}
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
		StatusNotification.notify(message, StatusNotification.TYPE_CRITICAL, StatusNotification.TIME_LONG, true);
		RequestStopEvent e = new RequestStopEvent(new Date());
		eventBus.fireEvent(e);
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
			public void onSuccess(RequestObject data) {
				saveCurrentState(data);
				saveHistory(data);
				//save URL for suggestion oracle
				saveUrl(data.getURL());
				startHttpRequest(data);
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
		if(requestUrl == null || requestUrl.isEmpty()){
			Throwable t = new Throwable("You must provide URL before request starts.");
			reportFailure("You must provide request URL.", t);
			return;
		}
		requestInProgress = true;
		
		
		String method = data.getMethod();
		String payload = data.getPayload();
		ArrayList<FilesObject> files = data.getFiles();
		ArrayList<RequestHeader> headers = RequestHeadersParser.stringToHeaders(data.getHeaders());
		String encoding = data.getEncoding();
		FormData fd = null;
		boolean isEmptyFormData = true;
		boolean hasFile = false;
		boolean useFormData = false;
		if (files != null && files.size() > 0) {
			//
			// FormData only with files to handle correct payload and
			// headers!!
			//
			useFormData = true;
		}
		
		if(useFormData) {
			fd = FormData.create();
			if(RestClient.isDebug()){
				Log.debug("Request will use FormData class in order to handle files.");
			}
		}
		
		if(RestClient.isDebug()){
			Log.debug("Createing builder object for URL: " + requestUrl + " and method: " + method);
		}
		
		RequestBuilder builder = new RequestBuilder(requestUrl, method);
		builder.setFollowRedirects(true);
		if (payload != null && !payload.equals("")) {
			if(RestClient.isDebug()){
				Log.debug("Set request data:");
				Log.debug(payload);
				Log.debug("=============================");
			}
			if (useFormData) {
				ArrayList<FormPayloadData> map = RequestPayloadParser.stringToFormArrayList(payload);
				for(FormPayloadData _data : map){
					fd.append(_data.getKey(), _data.getValue());
					isEmptyFormData = false;
				}
			} else {
				builder.setRequestData(payload);
			}
		}
		
		if(useFormData) {
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
					isEmptyFormData = false;
					hasFile = true;
				}
			}
		}
		
		if (!isEmptyFormData) {
			builder.setRequestFormData(fd);
		}
		// builder.setTimeoutMillis(500);
		// builder.setWithCredentials(true);
		
		//check if headers list already contains content-type header.
		//if not set one from form.
		if (headers == null) {
			headers = new ArrayList<RequestHeader>();
		}
		if(RestClient.isDebug()){
			Log.debug("Checking if headers list contains Content-Type");
		}
		boolean hasContentTypeHeader = false;
		for(RequestHeader item : headers){
			String key = item.getName();
			if(key.toLowerCase().equals("content-type")){
				encoding = item.getValue();
				hasContentTypeHeader = true;
				if(RestClient.isDebug()){
					Log.debug("Found Content-Type header. Overwrite header value to " + encoding);
				}
				break;
			}
		}
		
		if(!hasContentTypeHeader){
			if(RestClient.isDebug()){
				Log.debug("Content-Type header not found in headers list. Setting one from form value: " + encoding);
			}
			headers.add(new RequestHeader("Content-Type", encoding));
		}
		
		
		if (hasFile) {
			Collections.sort(headers, new RequestHeader.HeadersComparator());
			RequestHeader found = null;
			for(RequestHeader item : headers){
				if(item.getName().toLowerCase().equals("content-type")){
					found = item;
					break;
				}
			}
			
			if(found != null){
				headers.remove(found);
				if(RestClient.isDebug()){
					Log.debug("Remove \"Content-Type\" header in order to handle files.");
				}
			}
		}
		
		
		if (headers != null) {
			builder.setHeaders(headers);
			if(RestClient.isDebug()){
				Log.debug("Set request headers:");
				for(RequestHeader item : headers){
					Log.debug(item.getName()+": "+item.getValue());
				}
			}
		}
		
		if(RestClient.isDebug()){
			Log.debug("Set request handlers.");
		}
		
		
		builder.setAbortHandler(new AbortHandler() {
			@Override
			public void onAbort(ProgressEvent event) {
				requestInProgress = false;
				eventBus.fireEvent(new RequestStopEvent(new Date()));
				if(RestClient.isDebug()){
					Log.error("Abort request.");
				}
			}
		});
		builder.setErrorHandler(new ErrorHandler() {
			@Override
			public void onError(Response response, RuntimeException exception) {
				if(RestClient.isDebug()){
					Log.error("XMLHttpRequest2 callback", "onError", exception);
				}
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
		
		//TODO: cookie capture
		
		
		if(RestClient.isDebug()){
			Log.debug("All set. Sending...");
		}
		
		
		try {
			startTime = new Date();
			builder.send();
		} catch (RequestException e) {
			Log.error("Request send failure.", e);
			
			//TODO: Stop cookie capture
			eventBus.fireEvent(new RequestStopEvent(new Date()));
			requestInProgress = false;
//			ErrorDialog dialog = new ErrorDialog();
//			dialog.getHandler().publish(new LogRecord(dialog.getHandler().getLevel(), e.getMessage())  );
		}
	}
	
	protected static void onSuccesRequest(Response response) {
		if(RestClient.isDebug()){
			Log.debug("Request sent successfully. Building response view.");
		}
		requestInProgress = false;
		eventBus.fireEvent(new RequestStopEvent(new Date()));
		if(response == null){
			Window.alert("Something goes wrong :(\nResponse is null!");
			return;
		}
		long loadingTime = new Date().getTime() - startTime.getTime();
		RequestEndEvent event = new RequestEndEvent(true, response, loadingTime);
		eventBus.fireEvent(event);
	}
	
	protected static void onFailureRequest(Response response) {
		//TODO: Stop cookie capture
		
		requestInProgress = false;
		eventBus.fireEvent(new RequestStopEvent(new Date()));
		long loadingTime = new Date().getTime() - startTime.getTime();
		RequestEndEvent event = new RequestEndEvent(false, response, loadingTime);
		eventBus.fireEvent(event);
	}
	/**
	 * Save current form state in local storage.
	 * 
	 * @param data The data to save
	 */
	private static void saveCurrentState(final RequestObject data){
		try{
			String saveData = data.toJSON();
			RestClient.getClientFactory().getLocalStore().put(saveData, LocalStore.LATEST_REQUEST_KEY, new StoreResultCallback<String>() {
				@Override
				public void onSuccess(String result) {
					if(RestClient.isDebug()){
						Log.debug("Current state has been saved to local storage.");
					}
				}
				@Override
				public void onError(Throwable e) {
					Log.warn("Unable to save current form data in local storage. Restore may not be possible on restart.", e);
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
	private static void saveHistory(final RequestObject data){
		if(!RestClient.isHistoryEabled()){
			return;
		}
		HistoryRequestStoreWebSql store = RestClient.getClientFactory().getHistoryRequestStore();
		store.put(data, null, new StoreResultCallback<Integer>() {
			
			@Override
			public void onSuccess(Integer result) {
				
			}
			
			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.error("Unable to save current request data in history table.", e);
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
		final UrlHistoryStoreWebSql store = RestClient.getClientFactory().getUrlHistoryStore();
		
		store.getByUrl(url, new StoreResultCallback<List<UrlRow>>() {
			@Override
			public void onSuccess(List<UrlRow> result) {
				if(result.size() > 0) {
					store.updateUrlUseTime(result.get(0).getId(), new Date(), new StoreResultCallback<Boolean>(){
						@Override
						public void onSuccess(Boolean result) {}
						@Override
						public void onError(Throwable e) {}
					});
					return;
				}
				UrlRow row = UrlRow.create();
				row.setUrl(url);
				row.setTime(new Date().getTime());
				store.put(row, null, new StoreResultCallback<Integer>() {
					
					@Override
					public void onSuccess(Integer result) {
						
					}
					
					@Override
					public void onError(Throwable e) {
						if(RestClient.isDebug()){
							Log.error("There was a problem inserting URL value (used in request).", e);
						}
					}
				});
			}
			
			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.error("There was a problem inserting URL value (used in request). Unable to read previous URL's data.", e);
				}
			}
		});
	}
}
