package com.restclient.client.widgets;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.ParagraphElement;
import com.google.gwt.dom.client.PreElement;
import com.google.gwt.dom.client.Style.Display;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.http.client.URL;
import com.google.gwt.storage.client.StorageEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.Widget;
import com.restclient.client.RestApp;
import com.restclient.client.StatusNotification;
import com.restclient.client.chrome.Extension;
import com.restclient.client.chrome.Tab;
import com.restclient.client.chrome.TabCallback;
import com.restclient.client.chrome.Tabs;
import com.restclient.client.event.StoreDataAction;
import com.restclient.client.event.StoreDataEvent;
import com.restclient.client.html5.SectionElement;
import com.restclient.client.request.ApplicationRequest;
import com.restclient.client.request.ApplicationSession;
import com.restclient.client.request.ApplicationSessionCallback;
import com.restclient.client.request.ImportDataCallback;
import com.restclient.client.request.ImportRequest;
import com.restclient.client.request.ImportSuggestionsCallback;
import com.restclient.client.request.PingRequest;
import com.restclient.client.request.SuggestionImportItem;
import com.restclient.client.storage.ExportedDataInsertItem;
import com.restclient.client.storage.RestForm;
import com.restclient.client.widgets.JSONHeadersOptions.CloseJsonHeadersOptionsWidgetEvent;

/**
 * Request POST/PUT entity body form row.
 * 
 * @author Paweł Psztyć
 *
 */
public class ImportExportOptions extends Composite {
	/**
	 * Event fired on widget close.
	 * @author Paweł Psztyć
	 */
	public static class CloseImportExportOptionsEvent extends GwtEvent<CloseImportExportOptionsEvent.Handler>{
		public static final Type<Handler> TYPE = new Type<Handler>();
		/**
		 * Handles {@link CloseJsonHeadersOptionsWidgetEvent}.
		 */
		public interface Handler extends EventHandler {
			void onClose();
		}
		/**
		 * Register an handler for this event.
		 * @param eventBus
		 * @param handler
		 * @return
		 */
		public static HandlerRegistration register(EventBus eventBus,
				Handler handler) {
			return eventBus.addHandler(TYPE, handler);
		}
		@Override
		public com.google.gwt.event.shared.GwtEvent.Type<Handler> getAssociatedType() {
			return TYPE;
		}
		@Override
		protected void dispatch(CloseImportExportOptionsEvent.Handler handler) {
			handler.onClose();
		}
	}
	
	
	interface Binder extends UiBinder<Widget, ImportExportOptions> {
	}

	private final EventBus eventBus;
	private String applicationUserId = null;
	
	@UiField Button closeButton;
	@UiField Button connectButton;
	@UiField Button storeData;
	@UiField Button restoreData;
	
	@UiField InlineLabel loggedInInfo;
	@UiField InlineLabel statusInfo;
	@UiField SectionElement storeDataPanel;
	@UiField SectionElement shareUrlPanel;
	@UiField ParagraphElement connectNote;
	@UiField PreElement shareLink;
	
	public ImportExportOptions(EventBus eventBus) {
		this.eventBus = eventBus;
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		handleSessionChange();
		
		StoreDataEvent.register(eventBus, new StoreDataEvent.Handler() {
			@Override
			public void onSuccess() {
				storeData.setEnabled(true);
				restoreData.setEnabled(true);
			}
			
			@Override
			public void onFailure() {
				storeData.setEnabled(true);
				restoreData.setEnabled(true);
			}
		});
	}
	
	@UiHandler("closeButton")
	void onClose(ClickEvent e){
		eventBus.fireEvent(new CloseImportExportOptionsEvent());
	}
	
	/**
	 * Actions to perform when view is show.
	 * @param uid
	 */
	public void onShow(final String importUid, boolean checkSession) {
		if(checkSession){
			checkUserSession();
		}
		if(importUid != null){
			storeData.setEnabled(false);
			restoreData.setEnabled(false);
			importData(importUid);
		} else {
			storeData.setEnabled(true);
			restoreData.setEnabled(true);
		}
	}
	
	
	private void checkUserSession(){
		if(RestApp.isDebug()){
			Log.debug("Checking session status on applications server.");
		}
		statusInfo.setText("Checking connection status...");
		PingRequest.getSession(new ApplicationSessionCallback() {
			
			@Override
			public void onSuccess(ApplicationSession session) {
				statusInfo.setText("");
				if(session.getState() == ApplicationSession.CONNECTED){
					applicationUserId = session.getUserId();
					hideConnectControls();
					showShareLink();
				}
			}
			
			@Override
			public void onFailure(String message, Throwable exception) {
				statusInfo.setText("Unable to check connection status...");
				Timer t = new Timer() {
					@Override
					public void run() {
						statusInfo.setText("");
					}
				};
				t.schedule(3000);
			}
		});
	}
	
	
	/**
	 * Start import data process.
	 * 
	 * @param importUid
	 */
	private void importData(final String importUid){
		//Show dialog
		final LoaderDialog dialog = new LoaderDialog("Preparing data to download. Please wait.", false);
		dialog.show();
		
		//Make request
		ImportRequest.getImportSuggestions(importUid, new ImportSuggestionsCallback() {
			
			@Override
			public void onSuccess(List<SuggestionImportItem> result) {
				dialog.hide();
				if(result == null){
					StatusNotification.notify("Server returns empty data", StatusNotification.TYPE_ERROR);
					storeData.setEnabled(true);
					restoreData.setEnabled(true);
					return;
				}
				final ImportListingDialog importDialog = new ImportListingDialog(eventBus);
				importDialog.append(result);
				//
				// delay show dialog for data providers to refresh the list
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
				if(RestApp.isDebug()){
					if(exception != null){
						Log.error(message, exception);
					} else {
						Log.error(message);
					}
				}
				StatusNotification.notify(message, StatusNotification.TYPE_ERROR);
				dialog.hide();
				storeData.setEnabled(true);
				restoreData.setEnabled(true);
			}
		});
		
	}
	
	/**
	 * Import selected by user data
	 * @param keys Keys values to import
	 */
	public void importSelectedData(final String[] keys){
		if(keys.length == 0){
			StatusNotification.notify("No items to import.", StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
			return;
		}
		final LoaderDialog dialog = new LoaderDialog("Downloading data. Please wait.", false);
		dialog.show();
		
		ImportRequest.importData(keys, new ImportDataCallback() {
			
			@Override
			public void onSuccess(final List<RestForm> result) {
				if(result.size()==0){
					StatusNotification.notify("Something went wrong. There is no data to save :(", StatusNotification.TYPE_ERROR);
					dialog.hide();
					return;
				}
				
				RestApp.FORM_SERVICE.insertImportData(result, new Date(), new RowIdListCallback() {
					@Override
					public void onFailure(DataServiceException error) {
						StatusNotification.notify("Unable to vave data to local database :(", StatusNotification.TYPE_ERROR);
						if(RestApp.isDebug()){
							Log.error("Unable to vave data to local database :(",error);
						}
						dialog.hide();
					}
					
					@Override
					public void onSuccess(List<Integer> rowIds) {
						//
						// Insert into exported list to prevent duplicates on server side.
						//
						List<ExportedDataInsertItem> exported = new ArrayList<ExportedDataInsertItem>();
						int len = result.size();
						for(int i=0; i<len; i++){
							RestForm form = result.get(i);
							int dbId = rowIds.get(i);
							ExportedDataInsertItem item = new ExportedDataInsertItem(form.key);
							item.setReferenceId(dbId);
							item.setType("form");
							exported.add(item);
						}
						RestApp.EXPORT_DATA_SERVICE.insertExported(exported, new VoidCallback() {
							@Override
							public void onFailure(DataServiceException error) {
								if(RestApp.isDebug()){
									Log.error("Unable to insert imported references. During export duplicates may occur.", error);
								}
							}
							
							@Override
							public void onSuccess() {}
						});
						
						
						StatusNotification.notify("Saved import data.", StatusNotification.TYPE_NORMAL, StatusNotification.TIME_MEDIUM);
						dialog.hide();
					}
				});
			}
			
			@Override
			public void onFailure(String message, Throwable exception) {
				if(RestApp.isDebug()){
					if(exception != null){
						Log.error(message, exception);
					} else {
						Log.error(message);
					}
				}
				StatusNotification.notify(message, StatusNotification.TYPE_ERROR);
				dialog.hide();
			}
		});
		
	}
	
	
	
	@UiHandler("connectButton")
	void onConnectButton(ClickEvent e){
		String signInUrl = ApplicationRequest.AUTH_URL + "/signin?ret=";
		Extension ext = Extension.getExtensionIfSupported();
		String returnPath = "";
		if(ext == null){ //DEV MODE
			returnPath = "http://127.0.0.1:8888/auth.html#auth";
		} else {
			returnPath = ext.getURL("/auth.html#auth");
		}
		signInUrl = signInUrl + URL.encodeQueryString(returnPath);
		Tabs tabs = Tabs.getTabsIfSupported();
		if(tabs == null){ //DEV MODE
			Window.open(signInUrl, "_blank", "");
		} else {
			tabs.create(Tabs.CreateProperties.create().setUrl(signInUrl), new TabCallback() {
				@Override
				public void onResult(Tab tab) {}
			});
		}
	}
	/**
	 * When clicking to "Connect" button application creates new window 
	 * to login to application. When returning it will redirect user to 
	 * auth.html page. This page sets localStorage "applogin" value to current time.
	 * When it done this handler should hide connect controls and show other options.
	 * 
	 */
	private void handleSessionChange(){
		addNativeStorageEventHandlerandler(new StorageEvent.Handler() {
			@Override
			public void onStorageChange(StorageEvent event) {
				checkUserSession();
			}
		});
	}
	/**
	 * Fixed storage event handler...
	 * @param handler
	 */
	private final native void addNativeStorageEventHandlerandler(StorageEvent.Handler handler) /*-{
		var clb = $entry(function(event) {
			handler.@com.google.gwt.storage.client.StorageEvent.Handler::onStorageChange(Lcom/google/gwt/storage/client/StorageEvent;)(event);
		});
		$wnd.addEventListener('storage',clb,true);
	}-*/;
	
	/**
	 * Hide controls like "connect to application"
	 */
	private void hideConnectControls(){
		loggedInInfo.setVisible(true);
		connectButton.setVisible(false);
		connectNote.getStyle().setDisplay(Display.NONE);
		storeDataPanel.getStyle().setDisplay(Display.BLOCK);
	}
	
	private void showShareLink(){
		if(applicationUserId == null) return;
		
		shareUrlPanel.getStyle().setDisplay(Display.BLOCK);
		Extension ext = Extension.getExtensionIfSupported();
		String url = "";
		if(ext == null){ //DEV mode
			url = "http://127.0.0.1:8888/RestClientApp.html?gwt.codesvr=127.0.0.1:9997";
		} else {
			url = ext.getURL("/RestClientApp.html");
		}
		url += "#import/" + applicationUserId;
		shareLink.setInnerText(url);
	}
	
	@UiHandler("storeData")
	void onStoreDataClick(ClickEvent e){
		if(applicationUserId == null){
			StatusNotification.notify("Connect to application first (not logged in)",StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
			return;
		}
		storeData.setEnabled(false);
		restoreData.setEnabled(false);
		eventBus.fireEvent(new StoreDataAction());
	}
	
	@UiHandler("restoreData")
	void onRestoreDataClick(ClickEvent e){
		if(applicationUserId == null){
			StatusNotification.notify("Connect to application first (not logged in)",StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
			return;
		}
		storeData.setEnabled(false);
		restoreData.setEnabled(false);
		
		//Show dialog
		final LoaderDialog dialog = new LoaderDialog("Preparing data to download. Please wait.", false);
		dialog.show();
		
		//Make request
		ImportRequest.getImportSuggestions("me", new ImportSuggestionsCallback() {
			
			@Override
			public void onSuccess(List<SuggestionImportItem> result) {
				dialog.hide();
				if(result == null){
					StatusNotification.notify("Server returns empty data", StatusNotification.TYPE_ERROR);
					restoreData.setEnabled(true);
					return;
				}
				final ImportListingDialog importDialog = new ImportListingDialog(eventBus);
				importDialog.append(result);
				//
				// delay show dialog for data providers to refresh the list
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
				if(RestApp.isDebug()){
					if(exception != null){
						Log.error(message, exception);
					} else {
						Log.error(message);
					}
				}
				StatusNotification.notify(message, StatusNotification.TYPE_ERROR);
				dialog.hide();
				storeData.setEnabled(true);
				restoreData.setEnabled(true);
			}
		});
	}
}
