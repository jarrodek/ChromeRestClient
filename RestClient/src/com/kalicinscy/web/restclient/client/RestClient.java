package com.kalicinscy.web.restclient.client;

import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.dom.client.Document;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.user.client.History;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.xhr2.client.AbortHandler;
import com.google.gwt.xhr2.client.ErrorHandler;
import com.google.gwt.xhr2.client.File;
import com.google.gwt.xhr2.client.FileList;
import com.google.gwt.xhr2.client.FormData;
import com.google.gwt.xhr2.client.Header;
import com.google.gwt.xhr2.client.LoadHandler;
import com.google.gwt.xhr2.client.LoadStartHandler;
import com.google.gwt.xhr2.client.ProgressEvent;
import com.google.gwt.xhr2.client.ProgressHandler;
import com.google.gwt.xhr2.client.RequestBuilder;
import com.google.gwt.xhr2.client.Response;
import com.google.gwt.xhr2.client.TimeoutHandler;
import com.google.gwt.xhr2.client.UploadLoadHandler;
import com.kalicinscy.web.restclient.client.events.SaveAndRestoreFormHandler;
import com.kalicinscy.web.restclient.client.request.RequestDataFormatter;
import com.kalicinscy.web.restclient.client.request.RequestParameters;
import com.kalicinscy.web.restclient.client.request.ViewParameters;
import com.kalicinscy.web.restclient.client.ui.ActionButtons;
import com.kalicinscy.web.restclient.client.ui.FilesForm.FilesObject;
import com.kalicinscy.web.restclient.client.ui.MainForm;
import com.kalicinscy.web.restclient.client.ui.ResponseView;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class RestClient implements EntryPoint {
	
	public static final RequestParameters REST_PARAMS = new RequestParameters();
	public static final ViewParameters VIEW_PARAMS = new ViewParameters();
	private static RestClient INSTANCE;
	private static boolean requestInProgress = false;
	private MainForm requestView;
	private ResponseView responseView = null;
	private final Date startTime = new Date();
	
	public static final String CONTAINER_ID = "container";
	
	private boolean inited = false;
	
	public static RestClient getInstance(){
		return INSTANCE;
	}
	
	/**
	 * Main Module entry point
	 */
	public void onModuleLoad() {
		INSTANCE = this;
		
		//
		// Load initial configuration.
		//
		ConfigInit init = new ConfigInit();
		if( !init.isCreated() ){
			init.create();
		} else {
			init.init();
		}
		
		History.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				String token = event.getValue();
				if( token.equals("") || token.equals("app") ){
					runApp();
				} else if( token.equals("config") ){
					runAppConfig();
				}
			}
		});
		History.fireCurrentHistoryState();
	}
	
	public void runAppConfig(){
		//really nothing?
		Window.alert("not yet implemented");
		History.newItem("app");
	}
	
	public void runApp(){
		if( !inited || requestView == null ){
			REST_PARAMS.restoreFromStorage();
			VIEW_PARAMS.restore();
			
			requestView = new MainForm();
			RootPanel root = RootPanel.get(CONTAINER_ID);
			root.add(requestView);
			
			SaveAndRestoreForm handler = new SaveAndRestoreForm();
			this.observeSaveAndRestore(handler);
			
			
			REST_PARAMS.addEncodingChangeHandler(requestView);
			REST_PARAMS.addHeadersChangeHandler(requestView);
			REST_PARAMS.addMethodChangeHandler(requestView);
			REST_PARAMS.addPostChangeHandler(requestView);
			REST_PARAMS.addUrlChangeHandler(requestView);
		} else {
			if( requestView != null ){
				requestView.setVisible(true);
			}
		}
		inited = true;
	}
	
	public void startRequest(){
		
		if( requestInProgress ){
			return;
		}
		requestInProgress = true;
		
		REST_PARAMS.store();
		VIEW_PARAMS.store();
		
		String method = REST_PARAMS.getMethod();
		FormData fd = null;
		boolean isEmptyFormData = true;
		boolean hasFile = false;
		boolean useFormData = false;
		
		String data = REST_PARAMS.getData();
		List<FilesObject> files = REST_PARAMS.getFilesList();
		if( files != null && files.size() > 0 ){ //FormData only with files to handle correct data body and headers!!
			useFormData = true;
		}
		
		if( useFormData ){
			fd = FormData.create();
		}
		
		RequestBuilder builder = new RequestBuilder(REST_PARAMS.getUrl(), method);
		builder.setFollowRedirects(true);
		
		if( data != null && !data.equals("") ){
			if( useFormData ){
				LinkedHashMap<String, String> map = RequestDataFormatter.parseDataToHashMap(data);
				if( map.size() > 0 ){
					Set<String> keys = map.keySet();
					Iterator<String> it = keys.iterator();
					while(it.hasNext()){
						String key = it.next();
						String value = map.get(key);
						fd.append(key, value);
						isEmptyFormData = false;
					}
				}
			} else {
				builder.setRequestData(data);
			}
		}
		
		if( useFormData && files != null && files.size() > 0 ){
			
			Iterator<FilesObject> fit = files.iterator();
			while( fit.hasNext() ){
				FilesObject fobj = fit.next();
				FileList fls = fobj.getFiles();
				String fieldName = fobj.getName();
				int len = fls.size();
				for( int i = 0; i < len; i++ ){
					File f = fls.get(i);
					fd.append(fieldName, f);
					isEmptyFormData = false;
					hasFile = true;
				}
			}
		}
		
		if( !isEmptyFormData ){
			builder.setRequestFormData(fd);
		}
		//builder.setTimeoutMillis(500);
		//builder.setWithCredentials(true);
		
		LinkedHashMap<String, String> headers = REST_PARAMS.getHeaders();
		if( method.equals("POST") || method.equals("PUT") ){
			if( !hasFile ){
				String enc = REST_PARAMS.getFormEncoding();
				if( headers == null ){
					headers = new LinkedHashMap<String, String>();
				}
				headers.put("Content-Type", enc);
			}
		}
		
		if( hasFile ){//remove Content-Type header for file upload.
			if( headers.containsKey("Content-Type") ){
				headers.remove("Content-Type");
			}
		}
		
		if( headers != null ){
			builder.setHeaders(headers);
		}
		
		//builder.setUploadAbortHandler( )
		
		builder.setAbortHandler(new AbortHandler() {
			@Override
			public void onAbort(ProgressEvent event) {
//				Log.debug("XMLHttpRequest2 callback","onAbort");
				requestInProgress = false;
				requestView.restoreButtonsState();
			}
		});
		builder.setErrorHandler(new ErrorHandler() {
			@Override
			public void onError(Response response, RuntimeException exception) {
				Log.debug("XMLHttpRequest2 callback","onError",exception);
				
				requestInProgress = false;
				onFailureRequest(response);
			}
		});
		builder.setLoadHandler(new LoadHandler() {
						@Override
			public void onLoaded(Response response,ProgressEvent event) {
//				Log.debug("setLoadHandler: onLoaded");
				onSuccesRequest(response);
			}

			@Override
			public void onError(Response response, Throwable exception) {
				requestInProgress = false;
				onFailureRequest(response);
			}
		});
		builder.setUploadProgressHandler( new ProgressHandler() {
			@Override
			public void onProgress(ProgressEvent event) {
//				Log.debug("onProgress");
				if( event.isLengthComputable() ){
					requestView.getButtons().setUploadMax( (long) event.getTotal() );
					requestView.getButtons().setUploadCurrent( (long) event.getLoaded() );
				}
			}
		});
		builder.setUploadLoadStartHandler( new LoadStartHandler() {
			@Override
			public void onLoadStart(ProgressEvent event) {
//				Log.debug("onLoadStart");
				ActionButtons buttons = requestView.getButtons();
				if( event.isLengthComputable() ){
					buttons.setUploadMax( (long) event.getTotal() );
				}
				buttons.setUploadCurrent(0);
				buttons.showUpload();
			}
		});
		builder.setUploadLoadHandler( new UploadLoadHandler() {
			
			@Override
			public void onLoaded(ProgressEvent event) {
//				Log.debug("onLoaded");
				ActionButtons buttons = requestView.getButtons();
				buttons.hideUpload();
				buttons.showProgress();
			}
		});
		
		//download data progress
		builder.setProgressHandler(new ProgressHandler() {
			@Override
			public void onProgress(ProgressEvent event) {
//				Log.debug("setProgressHandler: "+event.getLoaded()+", "+event.getTotal()+", "+event.isLengthComputable() );
				ActionButtons buttons = requestView.getButtons();
				buttons.hideUpload();
//				if( event.isLengthComputable() ){
//					buttons.setUploadMax( (long) event.getTotal() );
//					Log.debug("Download: "+event.getTotal());
//				}
//				buttons.setUploadCurrent(0);
				buttons.showProgress();
			}
		});
		
		builder.setTimeoutHandler(new TimeoutHandler() {
						@Override
			public void onTimeout(Response response, ProgressEvent event,
					RuntimeException exception) {
				//Log.debug("XMLHttpRequest2 callback","onTimeout",exception);
				requestInProgress = false;
				onFailureRequest(response);
			}
		});
		
		
		
		try {
			startTime.setTime(new Date().getTime());
			builder.send();
		} catch (RequestException e) {
			//e.printStackTrace();
			requestInProgress = false;
			Window.alert("An error occured: "+e.getMessage());
			requestView.restoreButtonsState();
		}
		
	}
	
	

	private void onSuccesRequest(Response response){
		
		if( response == null ){
			Window.alert("Something goes wrong :(\nResponse is null!");
			return;
		}
		
		
		
		long dimm = new Date().getTime() - startTime.getTime();
		
		requestInProgress = false;
		requestView.restoreButtonsState();
		
		initResponseView();
		
		
		responseView.setStatusCode(response.getStatus(), response.getStatusText());
		
		Header[] headers = response.getHeaders();
		responseView.setResponseTime(dimm);
		responseView.setHeaders(headers);
		RootPanel root = RootPanel.get(CONTAINER_ID);
		root.add(responseView);
		String body = response.getResponseText();
		responseView.setResponseBody( body );
		
		Document xml = response.getResponseXML();
		if( xml != null ){
			responseView.setResponseXml( xml );
		}
		
		responseView.setSize("100%", "100%");
		
		//check if response has JSON header:
		boolean isJSON = false;
		for (Header header : headers) {
			if (header == null) {
				continue;
			}
			String name = header.getName();
			if( name.toLowerCase().equals("content-type") ){
				String value = header.getValue().toLowerCase();
				if( value.contains("application/json") //RFC 4627
					|| value.contains("text/json") //historical
						)
				isJSON = true;
				break;
			}
		}
		if( isJSON ){
			responseView.setResponseJSON(body);
		}
		
//		
//		NOT SUPPORTED BY BROWSER YET :(
//		
//		Blob a = response.getResponseBlob();
//		FileReader reader = FileReader.create();
//		reader.addProgressHandler( new FileReaderProgressEvent() {
//			
//			@Override
//			public void onProgress(File file, Double loaded, Double total) {
//				// TODO Auto-generated method stub
//				
//			}
//			
//			@Override
//			public void onLoad(File file) {
//				// TODO Auto-generated method stub
//				String res = file.getResult();
//				Log.debug(res);
//			}
//			
//			@Override
//			public void onError(File file, FileError error) {
//				Log.debug("Error :(");
//			}
//			
//			@Override
//			public void onAbort(File file) {
//				// TODO Auto-generated method stub
//				
//			}
//		});
//		reader.readAsDataURL(a);
	}
	
	private void onFailureRequest(Response response){
		long dimm = new Date().getTime() - startTime.getTime();
		requestInProgress = false;
		requestView.restoreButtonsState();
		initResponseView();
		responseView.setErrorView();
		responseView.setStatusCode(response.getStatus(), response.getStatusText());
		Header[] headers = response.getHeaders();
		responseView.setResponseTime(dimm);
		responseView.setHeaders(headers);
		RootPanel root = RootPanel.get(CONTAINER_ID);
		root.add(responseView);
	}
	
	private void initResponseView(){
		if( responseView == null ){
			responseView = new ResponseView();
		} else {
			responseView.removeFromParent();
			responseView = new ResponseView();
		}
	}
	
	private final native void observeSaveAndRestore(SaveAndRestoreFormHandler handler)/*-{
		
		if( $wnd.ctrlSinited ){return;}
		
		$wnd.addEventListener("load", function(){
			$doc.querySelector("#container > table").style.height = "100%";
			$doc.querySelector("#container > table").style.width = "100%";
		}, false);
		
		$wnd.ctrlSinited = true;
		$doc.addEventListener('keydown',$entry(function(e) {
			if(!e.ctrlKey){return;}
			switch( e.keyCode ){
				case 83: //S
					handler.@com.kalicinscy.web.restclient.client.events.SaveAndRestoreFormHandler::onSaveAction()();
					e.preventDefault();
				break;
				case 79: //O
					handler.@com.kalicinscy.web.restclient.client.events.SaveAndRestoreFormHandler::onRestoreAction()();
					e.preventDefault();
				break;
			}
		}),true);
	}-*/;
}
