package com.restclient.client;

import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;
import java.util.logging.LogRecord;

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
import com.google.gwt.xhr2.client.Response;
import com.google.gwt.xhr2.client.TimeoutHandler;
import com.google.gwt.xhr2.client.UploadLoadHandler;
import com.restclient.client.event.RequestEndEvent;
import com.restclient.client.event.RequestUiChangeEvent;
import com.restclient.client.event.RequestStartEvent;
import com.restclient.client.request.RequestDataFormatter;
import com.restclient.client.request.RequestParameters;
import com.restclient.client.storage.FilesObject;

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
	
	public static boolean isRequestInProgress(){
		return requestInProgress;
	}
	
	public static void initialize(EventBus ev) {
		eventBus = ev;
		startObservers();
	}

	private static void startObservers() {
		RequestStartEvent.register(eventBus, new RequestStartEvent.Handler() {
			@Override
			public void onRequestStart() {
				getInstance().startHttpRequest();
			}
		});

	}

	private Date startTime = new Date();

	private void startHttpRequest() {
		if( requestInProgress ){
			return;
		}
		requestInProgress = true;
		eventBus.fireEvent(new RequestUiChangeEvent(
				RequestUiChangeEvent.ACTION_DISABLE_BUTTONS, null));
		try{
			RequestParameters.store();
			RequestHistory.addCurentParametersMap();
			RequestHistory.store();
		}catch(Exception e){
			e.printStackTrace();
			Log.error("Error save form state or history list. ", e);
			
		}
		String method = RequestParameters.getMethod();
		String data = RequestParameters.getData();
		String requestUrl = RequestParameters.getUrl();
		List<FilesObject> files = RequestParameters.getFilesList();
		LinkedHashMap<String, String> headers = RequestParameters.getHeaders();
		String enc = RequestParameters.getFormEncoding();
		FormData fd = null;
		boolean isEmptyFormData = true;
		boolean hasFile = false;
		boolean useFormData = false;
		//
		//save URL for suggestion oracle
		//
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
		}

		RequestBuilder builder = new RequestBuilder(requestUrl, method);
		builder.setFollowRedirects(true);

		if (data != null && !data.equals("")) {
			if (useFormData) {
				LinkedHashMap<String, String> map = RequestDataFormatter
						.parseDataToHashMap(data);
				if (map.size() > 0) {
					Set<String> keys = map.keySet();
					Iterator<String> it = keys.iterator();
					while (it.hasNext()) {
						String key = it.next();
						String value = map.get(key);
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
					headers = new LinkedHashMap<String, String>();
				}
				headers.put("Content-Type", enc);
			}
		}

		if (hasFile) {
			// remove Content-Type header for file upload.
			if (headers.containsKey("Content-Type")) {
				headers.remove("Content-Type");
			}
		}

		if (headers != null) {
			builder.setHeaders(headers);
		}

		builder.setAbortHandler(new AbortHandler() {
			@Override
			public void onAbort(ProgressEvent event) {
				requestInProgress = false;
				eventBus.fireEvent(new RequestUiChangeEvent(
						RequestUiChangeEvent.ACTION_ENABLE_BUTTONS, null));
			}
		});
		builder.setErrorHandler(new ErrorHandler() {
			@Override
			public void onError(Response response, RuntimeException exception) {
				Log.error("XMLHttpRequest2 callback", "onError", exception);
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

		try {
			startTime.setTime(new Date().getTime());
			builder.send();
		} catch (RequestException e) {
			requestInProgress = false;
			ErrorDialog dialog = new ErrorDialog();
			dialog.getHandler().publish(new LogRecord(dialog.getHandler().getLevel(), e.getMessage())  );
			eventBus.fireEvent(new RequestUiChangeEvent(
					RequestUiChangeEvent.ACTION_ENABLE_BUTTONS, null));
		}

	}

	protected void onSuccesRequest(Response response) {
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
		requestInProgress = false;
		eventBus.fireEvent(new RequestUiChangeEvent(
				RequestUiChangeEvent.ACTION_ENABLE_BUTTONS, null));
		long loadingTime = new Date().getTime() - startTime.getTime();
		RequestEndEvent event = new RequestEndEvent(false, response, loadingTime);
		eventBus.fireEvent(event);
	}
}
