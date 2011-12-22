package com.restclient.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.event.shared.EventBus;
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
import com.restclient.client.event.RequestEndEvent;
import com.restclient.client.event.RequestStartEvent;
import com.restclient.client.event.RequestUiChangeEvent;
import com.restclient.client.request.RequestDataFormatter;
import com.restclient.client.request.RequestParameters;
import com.restclient.client.storage.FilesObject;
import com.restclient.client.widgets.BodyFormWidget;

@SuppressWarnings("javadoc")
public class AppRequestFactory {

	private static AppRequestFactory INSTANCE;
	public static AppRequestFactory getInstance() {
		if (INSTANCE == null) {
			INSTANCE = new AppRequestFactory();
		}
		return INSTANCE;
	}

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
		RequestStartEvent.register(eventBus, new RequestStartEvent.Handler() {
			@Override
			public void onRequestStart() {
				try{
					getInstance().startHttpRequest();
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

	private Date startTime = new Date();

	private void startHttpRequest() {
		
		if( RestApp.isDebug() ){
			Log.debug("Start new request");
		}
		
		if( requestInProgress ){
			if( RestApp.isDebug() ){
				Log.warn("Request already in progress. Wait until end.");
			}
			return;
		}
		
		requestInProgress = true;
		if( RestApp.isDebug() ){
			Log.debug("Change controls state.");
		}
		eventBus.fireEvent(new RequestUiChangeEvent(
				RequestUiChangeEvent.ACTION_DISABLE_BUTTONS, null));
		try{
			if( RestApp.isDebug() ){
				Log.debug("Request form state snapshot.");
			}
			//
			// Store current state
			//
			RequestParameters.store();
			
			if( RestApp.isHistoryEabled() ){
				if( RestApp.isDebug() ){
					Log.debug("Adding state to history.");
				}
				RequestHistory.addCurentParametersMap();
				RequestHistory.store();
			}
		}catch(Exception e){
			e.printStackTrace();
			if( RestApp.isDebug() ){
				Log.error("Error save form state or history list. ", e);
			}
		}
		if( RestApp.isDebug() ){
			Log.debug("Prepare variables.");
		}
		String method = RequestParameters.getMethod();
		String data = RequestParameters.getData();
		String requestUrl = RequestParameters.getUrl();
		List<FilesObject> files = RequestParameters.getFilesList();
		List<RequestHeader> headers = RequestParameters.getHeaders();
		String enc = RequestParameters.getFormEncoding();
		FormData fd = null;
		boolean isEmptyFormData = true;
		boolean hasFile = false;
		boolean useFormData = false;
		//
		//save URL for suggestion oracle
		//
		if( RestApp.isDebug() ){
			Log.debug("Save URL value into suggestions.");
		}
		RestApp.addOracleURL(requestUrl);
		
		if (files != null && files.size() > 0) {
			//
			// FormData only with files to handle correct data body and
			// headers!!
			//
			useFormData = true;
		}
		if (useFormData) {
			fd = FormData.create();
			if( RestApp.isDebug() ){
				Log.debug("Request will use FormData class in order to handle files.");
			}
		} else {
			if( RestApp.isDebug() ){
				Log.debug("Request will not use FormData class. Sendind traditional form");
			}
		}
		
		if( RestApp.isDebug() ){
			Log.debug("Createing builder object for URL: " + requestUrl + " and method: " + method);
		}
		
		RequestBuilder builder = new RequestBuilder(requestUrl, method);
		builder.setFollowRedirects(true);

		if (data != null && !data.equals("")) {
			
			if( RestApp.isDebug() ){
				Log.debug("Set request data:");
				Log.debug(data);
				Log.debug("=============================");
			}
			
			if (useFormData) {
				List<BodyFormWidget.BodyFormValue> map = RequestDataFormatter
						.bodyToListValues(data);
				if (map.size() > 0) {
					for(BodyFormWidget.BodyFormValue item : map){
						String key = item.getName();
						String value = item.getValue();
						fd.append(key, value);
						isEmptyFormData = false;
					}
				}
			} else {
				//
				// OK, lets user decide how to send data in request: as encoded string or not.
				//
//				if( enc.contains("x-www-form-urlencoded") ){
//					Log.debug("Before parse: "+data);
//					Log.debug("After parse: "+RequestDataFormatter.parseUrlencodedEntiti(data));
//					builder.setRequestData( RequestDataFormatter.parseUrlencodedEntiti(data) );
//				} else {
//					builder.setRequestData(data);
//				}
				builder.setRequestData(data);
			}
		}
		if (useFormData && files != null && files.size() > 0) {
			
			if( RestApp.isDebug() ){
				Log.debug("Set " + files.size() + " file(s) in request.");
			}
			
			Iterator<FilesObject> fit = files.iterator();
			while (fit.hasNext()) {
				FilesObject fobj = fit.next();
				FileList fls = fobj.getFiles();
				String fieldName = fobj.getName();
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
		
		if (method.equals("POST") || method.equals("PUT")
				|| method.equals("DELETE")) {
			
			if (!hasFile) {
				if (headers == null) {
					headers = new ArrayList<RequestHeader>();
				}
				
				//check if headers list already contains content-type header.
				//if not set one from form.
				boolean hasContentTypeHeader = false;
				for(RequestHeader item : headers){
					String key = item.getName();
					if(key.toLowerCase().equals("content-type")){
						enc = item.getValue();
						hasContentTypeHeader = true;
						break;
					}
				}
				
				if(!hasContentTypeHeader){
					headers.add(new RequestHeader("Content-Type", enc));
				}
				if( RestApp.isDebug() ){
					Log.debug("Add \"Content-Type\" header to headers list with value="+enc);
				}
			}
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
				if( RestApp.isDebug() ){
					Log.debug("Remove \"Content-Type\" header in order to handle files.");
				}
			}
		}

		if (headers != null) {
			builder.setHeaders(headers);
			if( RestApp.isDebug() ){
				Log.debug("Set request headers:");
				for(RequestHeader item : headers){
					Log.debug(item.getName()+": "+item.getValue());
				}
			}
		}
		
		if( RestApp.isDebug() ){
			Log.debug("Set request handlers.");
		}
		
		builder.setAbortHandler(new AbortHandler() {
			@Override
			public void onAbort(ProgressEvent event) {
				CookieCapture.stop();
				CookieCapture.clear();
				requestInProgress = false;
				eventBus.fireEvent(new RequestUiChangeEvent(
						RequestUiChangeEvent.ACTION_ENABLE_BUTTONS, null));
			}
		});
		builder.setErrorHandler(new ErrorHandler() {
			@Override
			public void onError(Response response, RuntimeException exception) {
				if( RestApp.isDebug() ){
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
					RequestUiChangeEvent e = new RequestUiChangeEvent(
							RequestUiChangeEvent.ACTION_SET_UPLOAD_CONTROLS,
							event);
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
//				Log.debug("onLoadStart");
				RequestUiChangeEvent e = new RequestUiChangeEvent(
						RequestUiChangeEvent.ACTION_SET_UPLOAD_START, event);
				eventBus.fireEvent(e);
			}
		});
		//
		// When upload is finish
		//
		builder.setUploadLoadHandler(new UploadLoadHandler() {
			@Override
			public void onLoaded(ProgressEvent event) {
//				Log.debug("onUpLoaded");
				RequestUiChangeEvent e = new RequestUiChangeEvent(
						RequestUiChangeEvent.ACTION_SET_UPLOAD_END, null);
				eventBus.fireEvent(e);
			}
		});
		//
		// download data progress
		//
		builder.setProgressHandler(new ProgressHandler() {
			@Override
			public void onProgress(ProgressEvent event) {
				RequestUiChangeEvent e = new RequestUiChangeEvent(
						RequestUiChangeEvent.ACTION_SET_DOWNLOAD_CONTROLS,
						event);
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

		if( RestApp.isDebug() ){
			Log.debug("Starting cookie cature (if enabled)");
		}
		CookieCapture.start();
		
		if( RestApp.isDebug() ){
			Log.debug("All set. Sending...");
		}
		
		try {
			startTime.setTime(new Date().getTime());
			builder.send();
		} catch (RequestException e) {
			if( RestApp.isDebug() ){
				Log.error("Request send failure.", e);
			}
			CookieCapture.stop();
			CookieCapture.clear();
			eventBus.fireEvent(new RequestUiChangeEvent(
					RequestUiChangeEvent.ACTION_ENABLE_BUTTONS, null));
			requestInProgress = false;
			ErrorDialog dialog = new ErrorDialog();
			dialog.getHandler().publish(new LogRecord(dialog.getHandler().getLevel(), e.getMessage())  );
		}

	}

	protected void onSuccesRequest(Response response) {
		
		if( RestApp.isDebug() ){
			Log.debug("Request sent successfully. Building response view.");
		}
		requestInProgress = false;
		eventBus.fireEvent(new RequestUiChangeEvent(
				RequestUiChangeEvent.ACTION_ENABLE_BUTTONS, null));
		
		if( response == null ){
			Window.alert("Something goes wrong :(\nResponse is null!");
			return;
		}
		
		long loadingTime = new Date().getTime() - startTime.getTime();
		RequestEndEvent event = new RequestEndEvent(true, response, loadingTime);
		eventBus.fireEvent(event);
	}

	protected void onFailureRequest(Response response) {
		CookieCapture.stop();
		CookieCapture.clear();
		
		requestInProgress = false;
		eventBus.fireEvent(new RequestUiChangeEvent(
				RequestUiChangeEvent.ACTION_ENABLE_BUTTONS, null));
		long loadingTime = new Date().getTime() - startTime.getTime();
		RequestEndEvent event = new RequestEndEvent(false, response, loadingTime);
		eventBus.fireEvent(event);
	}
}
