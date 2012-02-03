package com.restclient.client;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.GWT.UncaughtExceptionHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.event.shared.SimpleEventBus;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.storage.client.StorageEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.History;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;
import com.restclient.client.event.FormStateRemoveEvent;
import com.restclient.client.event.FormStateSaveEvent;
import com.restclient.client.event.HistoryRestoreEvent;
import com.restclient.client.event.ImportExternalDataAction;
import com.restclient.client.event.OpenRequestEvent;
import com.restclient.client.event.RestoreRequestEvent;
import com.restclient.client.event.SaveRequestEvent;
import com.restclient.client.event.StoreDataAction;
import com.restclient.client.html5.HTML5Element;
import com.restclient.client.request.RequestParameters;
import com.restclient.client.request.ViewParameters;
import com.restclient.client.storage.RestForm;
import com.restclient.client.tasks.InitialConfigTask;
import com.restclient.client.tasks.StateRestoreTask;
import com.restclient.client.tasks.UpdateTask;
import com.restclient.client.widgets.ElementWrapper;
import com.restclient.client.widgets.HistoryListWidget;
import com.restclient.client.widgets.OptionsWidget;
import com.restclient.client.widgets.RequestWidget;
import com.restclient.client.widgets.ResponseWidget;
import com.restclient.client.widgets.RestoreStateWidget;
import com.restclient.client.widgets.SaveStateDialog;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class RestClientApp implements EntryPoint, ResizeHandler, ValueChangeHandler<String> {

	interface Binder extends UiBinder<Widget, RestClientApp> {
	}
	
	interface AppStyle extends CssResource {
		int menuWidth();
		float animationsTime();
		String frozen();
		String mainNav();
		String navBarItem();
		String subpageBackdrop();
		String subpage();
	}

	private static final Logger log = Logger.getLogger(RestClientApp.class
			.getName());

	private static EventBus eventBus = new SimpleEventBus();
	/**
	 * @return app wide event bus.
	 */
	public static EventBus getAppMainEventBus(){
		return eventBus;
	}
	
	@UiField(provided = true) RequestWidget requestWidget;
	@UiField(provided = true) ResponseWidget responseWidget;
	@UiField(provided = true) HistoryListWidget historyList;
	@UiField(provided = true) RestoreStateWidget restoreWidget;
	@UiField(provided = true) OptionsWidget optionsWidget;
	
	@UiField HTMLPanel mainPanel;
	@UiField HTMLPanel bodyPanel;
	@UiField HTMLPanel requestPanel;
	@UiField HTMLPanel savedPanel;
	@UiField HTMLPanel aboutPanel;
	@UiField HTMLPanel historyPanel;
	@UiField HTMLPanel optionsPanel;
	
	@UiField HTML plusButton;
	@UiField AppStyle style;
	
	private SaveStateDialog saveStateDialog;
	private boolean isRestoredRequest = false;
	private int currentRestoredRequestId = -1;
	private String currentRestoredRequestName = null;
	
	/**
	 * This is the entry point method.
	 */
	@Override
	public void onModuleLoad() {
		GWT.setUncaughtExceptionHandler(new UncaughtExceptionHandler() {
			@Override
			public void onUncaughtException(Throwable e) {
				log.log(Level.SEVERE, e.getMessage(), e);
				Log.error("Application error", e);
			}
		});
	    Logger.getLogger("").addHandler(new ErrorDialog().getHandler());
	    Logger.getLogger("").setLevel(Level.WARNING);
		
	    requestWidget = new RequestWidget(eventBus);
		responseWidget = new ResponseWidget(eventBus);
		restoreWidget = new RestoreStateWidget(eventBus);
		historyList = new HistoryListWidget(eventBus);
		optionsWidget = new OptionsWidget(eventBus);
		
		RootPanel.get().add(
		        GWT.<Binder> create(Binder.class).createAndBindUi(this));
	    
		RequestParameters.initialize(eventBus);
		startTasks();
	}
	
	
	private void startTasks() {
		if(RestApp.isDebug()){
			Log.debug("Start initial tasks.");
		}
		InitialConfigTask init = new InitialConfigTask();
		StateRestoreTask restore = new StateRestoreTask();
		UpdateTask update = new UpdateTask();
		
		TasksLoader.addTask(init);
		TasksLoader.addTask(update);
		TasksLoader.addTask(restore);
		
		TasksLoader.runTasks(new Callback<Void, Void>() {
			@Override
			public void onFailure(Void reason) {
				Log.error("Unable to finish initial tasks :(");
			}

			@Override
			public void onSuccess(Void result) {
				afterTaskFinishedHandler();
			}
		});
	}
	
	
	private void afterTaskFinishedHandler(){
		plusButton.setHTML("<g:plusone href=\"https://chrome.google.com/webstore/detail/hgmloofddffdnphfgcellkdfbfbjeloo\"></g:plusone>");
		savedPanel.getParent().getElement().setAttribute("hidden", "");
		setHistoryMenuItemVisible(RestApp.isHistoryEabled());
		
		Window.addResizeHandler(this);
		History.addValueChangeHandler(this);
		handleMenuItems();
		
		ViewParameters.setRestoredState(eventBus);
		ViewParameters.observeChanges(eventBus);
		
		AppRequestFactory.initialize(eventBus);
		
		registerHandlers();
		
		History.fireCurrentHistoryState();
		onResize(null);
		initPlusOneButton();
	}
	
	private void registerHandlers(){
		OpenRequestEvent.register(eventBus, new OpenRequestEvent.Handler() {
			@Override
			public void onOpenAction(Object source) {
				History.newItem("saved");
			}
		});
		SaveRequestEvent.register(eventBus, new SaveRequestEvent.Handler() {
			@Override
			public void onSaveAction(Object source) {
				
				if(isRestoredRequest){
					StringBuilder sb = new StringBuilder();
					sb.append("Overwrite current loaded form \"");
					sb.append(currentRestoredRequestName);
					sb.append("\"?").append("\n");
					sb.append("Press \"cancel\" to show save as dialog.");
					
					if(Window.confirm(sb.toString())){
						final String config = RequestParameters.getInstance().toString();
						final Date current = new Date();
						
						RestApp.FORM_SERVICE.updateFormData(currentRestoredRequestId, config, current, new VoidCallback(){
							@Override
							public void onFailure(DataServiceException error) {
								if(RestApp.isDebug()){
									Log.error("SaveRequestEvent handler: Unable to update data", error);
								}
								StatusNotification.notify(error.getMessage(), StatusNotification.TYPE_ERROR);
							}
							@Override
							public void onSuccess() {
								if(RestApp.isDebug()){
									Log.debug("SaveRequestEvent handler: updated!");
									StatusNotification.notify("Item updated.", StatusNotification.TYPE_NORMAL);
								}
							}
						});
						return;
					}
				}
				createSaveDialog();
			}
		});
		FormStateRemoveEvent.register(eventBus, new FormStateRemoveEvent.Handler() {
			@Override
			public void onRemove(int removedId) {
				if(isRestoredRequest){
					if(currentRestoredRequestId == removedId){
						isRestoredRequest = false;
						currentRestoredRequestId = -1;
						currentRestoredRequestName = null;
					}
				}
			}
		});
		//
		// Registers event to save request form
		//
		FormStateSaveEvent.register(eventBus, new FormStateSaveEvent.Handler() {
			@Override
			public void onSave(final String formName, Object source) {
				if( formName.trim().equals("") ){
					if(RestApp.isDebug()){
						Log.warn("FormStateSaveEvent handler: no name specified!");
					}
					return;
				}
				final String url = RequestParameters.getUrl();
				if(url.equals("")){
					if(RestApp.isDebug()){
						Log.warn("FormStateSaveEvent handler: current URL is empty!");
					}
					return;
				}
				final String config = RequestParameters.getInstance().toString();
				final Date current = new Date();
				
				if(RestApp.isDebug()){
					Log.debug("FormStateSaveEvent handler: Got full data. Try to save in DB.");
				}
				
				RestApp.FORM_SERVICE.insertData(formName, url, config, current, new RowIdListCallback() {
					@Override
					public void onFailure(DataServiceException error) {
						if(RestApp.isDebug()){
							Log.warn("FormStateSaveEvent handler: Error save data!", error);
						}
						ErrorDialog dialog = new ErrorDialog();
						dialog.getHandler().publish(new LogRecord(dialog.getHandler().getLevel(), error.getMessage()));
					}
					@Override
					public void onSuccess(List<Integer> rowIds) {
						
						if( rowIds.size() == 0 ){
							if(RestApp.isDebug()){
								Log.error("FormStateSaveEvent handler: Insert has not return insert ID.");
							}
							ErrorDialog dialog = new ErrorDialog();
							dialog.getHandler().publish(new LogRecord(dialog.getHandler().getLevel(), "Something went wrong while saveing form state. Undefined error."));
							return;
						}
						if(RestApp.isDebug()){
							Log.debug("FormStateSaveEvent handler: saved!");
						}
					}
				});
			}
		});
		RestoreRequestEvent.register(eventBus, new RestoreRequestEvent.Handler() {
			@Override
			public void onRestoreAction(RestForm form, Object source) {
				isRestoredRequest = true;
				currentRestoredRequestId = form.getId();
				currentRestoredRequestName = form.getName();
				
				responseWidget.setVisible(false);
				RequestParameters.restoreFromSavedState(form);
				History.newItem("request");
			}
		});
		HistoryRestoreEvent.register(eventBus, new HistoryRestoreEvent.Handler() {
			@Override
			public void onRestoreAction(RequestHistoryItem form, Object source) {
				RequestParameters.restoreHistory(form);
				History.newItem("request");
			}
		});
		
		Storage storage = Storage.getLocalStorageIfSupported();
		if(storage == null) return;
		Storage.addStorageEventHandler( new StorageEvent.Handler() {
			@Override
			public void onStorageChange(StorageEvent event) {
				String k = event.getKey();
				if( k.equals(RestApp.StorageKeys.HISTORY_KEY) ){
					String historyValue = event.getNewValue();
					if( historyValue == null || historyValue.isEmpty() ){
						historyValue = "true";
					}
					setHistoryMenuItemVisible(historyValue.equals("true"));
				}
			}
		});
		String cookiesValue = storage.getItem( RestApp.StorageKeys.COOKIES_CAPTURE );
		if( cookiesValue == null || cookiesValue.isEmpty() ){
			cookiesValue = "false";
		}
		if( cookiesValue.equals("true") ){
			CookieCapture.initialize();
		}
		
		//
		// Store application data to external server
		//
		StoreDataAction.register(eventBus, new StoreDataAction.Handler() {
			@Override
			public void onAction() {
				DataExportImpl impl = new DataExportImpl();
				impl.setEventBus(eventBus);
				impl.synch();
			}
		});
	}
	
	
	
	/**
	 * History menu item can be turned off. This method access this item visible state.
	 * @param visible
	 */
	private void setHistoryMenuItemVisible(boolean visible){
		HTML5Element root = (HTML5Element) mainPanel.getElement();
		HTML5Element historyMenuItem = root.querySelector("ul."+style.mainNav()+" > li[page=\"history\"]");
		
		if( visible ){
			historyMenuItem.getClassList().remove("hidden");
		} else {
			historyMenuItem.getClassList().add("hidden");
		}
	}
	
	
	private void createSaveDialog(){
		if( saveStateDialog != null && saveStateDialog.isShowing() ){
			return;
		}
		final String url = RequestParameters.getUrl();
		if( url.equals("") ){
			DialogBox dialog = new DialogBox();
			dialog.setAnimationEnabled(true);
			dialog.setAutoHideEnabled(true);
			dialog.setAutoHideOnHistoryEventsEnabled(true);
			dialog.setGlassEnabled(true);
			dialog.setText("First enter request URL.");
			dialog.add( new HTML("You must enter request URL to save form state.") );
			dialog.show();
			dialog.center();
			return;
		}
		saveStateDialog = new SaveStateDialog(eventBus);
		saveStateDialog.show();
	}
	/**
	 * On window resize
	 */
	@Override
	public void onResize(ResizeEvent event) {
		int windowHeight = Window.getClientHeight()-20;
		//
		// Save panel absolute position
		//
		int saved = savedPanel.getOffsetHeight();
		if( saved > 0 && windowHeight >= saved )
			savedPanel.setHeight(windowHeight+"px");
		else
			savedPanel.setHeight("100%");
		//
		// About panel
		//
		int about = aboutPanel.getOffsetHeight();
		if( about > 0 && windowHeight >= about ){
			aboutPanel.setHeight(windowHeight+"px");
		} else {
			aboutPanel.setHeight("100%");
		}
		//
		// History panel
		//
		int history = historyPanel.getOffsetHeight();
		if( history > 0 && windowHeight >= history ){
			historyPanel.setHeight(windowHeight+"px");
		} else {
			historyPanel.setHeight("100%");
		}
		//
		// Options panel
		//
		int options = optionsPanel.getOffsetHeight();
		if( options > 0 && windowHeight >= options ){
			optionsPanel.setHeight(windowHeight+"px");
		} else {
			optionsPanel.setHeight("100%");
		}
	}
	/**
	 * Close current opened tab if any.
	 * It's also remove selection from menu.
	 */
	private void closeCurrentTab(HTML5Element root){
		HTML5Element currentMenu = root.querySelector("ul."+style.mainNav()+" > li.navBarItemSelected");
		if( currentMenu != null ){
			currentMenu.getClassList().remove("navBarItemSelected");
			currentMenu.setAttribute("aria-selected", "false");
			currentMenu.setAttribute("tab-index", "-1");
		}
		final HTML5Element current = root.querySelector("div."+style.subpage()+":not(.hidden)");
		if( current == null ){
			return;
		}
		current.getParentElement().addClassName("transparent");
		current.getClassList().add("hidden");
		requestPanel.getElement().removeClassName(style.frozen());
	}
	/**
	 * Show semi-transparent div on main request panel to lock UI before show sub panel
	 * @param root
	 */
	private void showBackDrop(HTML5Element root){
		final HTML5Element subpageBackdrop = root.querySelector("div."+style.subpageBackdrop()+"[hidden]");
		if( subpageBackdrop != null){ //not shown
			subpageBackdrop.removeAttribute("hidden");
			new Timer() {
				@Override
				public void run() {
					subpageBackdrop.getClassList().remove("transparent");
				}
			}.schedule(10);
		}
	}
	/**
	 * Hide div over main request panel end enable UI after close any subpage.
	 * @param root
	 */
	private void hideBackDrop(HTML5Element root){
		final HTML5Element subpageBackdrop = root.querySelector("div."+style.subpageBackdrop()+":not(.transparent)");
		if( subpageBackdrop != null){
			subpageBackdrop.getClassList().add("transparent");
			int time = (int)(style.animationsTime()*1000);
			new Timer() {
				@Override
				public void run() {
					subpageBackdrop.setAttribute("hidden","");
				}
			}.schedule(time);
		}
	}
	/**
	 * Disable main panel controls.
	 */
	private void hideMainPanel(){
		requestPanel.getElement().addClassName(style.frozen());
	}
	/**
	 * Enable main panel controls.
	 */
	private void showMainPanel(){
		requestPanel.getElement().removeClassName(style.frozen());
	}
	
	@Override
	public void onValueChange(ValueChangeEvent<String> event) {
		
		String token = event.getValue();
		if( token == null || token.equals("") ){
			token = "request";
		}
		String importUID = null;
		//
		// Special Tokens
		// import/{UID} import data from Applications server
		//
		if(token.startsWith("import/")){
			importUID = token.substring(7);
			token = "options";
		}
		
		
		final HTML5Element root = (HTML5Element) mainPanel.getElement();
		closeCurrentTab(root);
		
		HTML5Element toSelect = root.querySelector("ul."+style.mainNav()+" > li[page=\""+token+"\"]");
		if( toSelect != null ){
			toSelect.getClassList().add("navBarItemSelected");
			toSelect.setAttribute("aria-selected", "true");
			toSelect.setAttribute("tab-index", "0");
		}
		
		if( token.equals("saved") ){
			showBackDrop(root);
			hideMainPanel();
			savedPanel.getElement().removeClassName("hidden");
			savedPanel.getParent().getElement().removeAttribute("hidden");
			restoreWidget.onShow();
			onResize(null);
			new Timer() {
				@Override
				public void run() {
					savedPanel.getParent().getElement().removeClassName("transparent");
				}
			}.schedule(10);
		} else if( token.equals("about") ){
			showBackDrop(root);
			hideMainPanel();
			aboutPanel.getElement().removeClassName("hidden");
			aboutPanel.getParent().getElement().removeAttribute("hidden");
			onResize(null);
			new Timer() {
				@Override
				public void run() {
					aboutPanel.getParent().getElement().removeClassName("transparent");
				}
			}.schedule(10);
		} else if( token.equals("request") ){
			showMainPanel();
			hideBackDrop(root);
			requestWidget.onShow();
			int time = (int)(style.animationsTime()*1000);
			new Timer() {
				@Override
				public void run() {
					final HTML5Element current = root.querySelector("div."+style.subpage());
					current.getParentElement().setAttribute("hidden","");
				}
			}.schedule(time);
		} else if( token.equals("history") ){
			showBackDrop(root);
			hideMainPanel();
			historyPanel.getElement().removeClassName("hidden");
			historyPanel.getParent().getElement().removeAttribute("hidden");
			historyList.onShow();
			onResize(null);
			new Timer() {
				@Override
				public void run() {
					historyPanel.getParent().getElement().removeClassName("transparent");
				}
			}.schedule(10);
		} else if( token.equals( "options" ) ){
			showBackDrop(root);
			hideMainPanel();
			optionsPanel.getElement().removeClassName("hidden");
			optionsPanel.getParent().getElement().removeAttribute("hidden");
			optionsWidget.onShow();
			onResize(null);
			if(importUID != null){
				ImportExternalDataAction action = new ImportExternalDataAction(importUID);
				eventBus.fireEvent(action);
			}
			new Timer() {
				@Override
				public void run() {
					optionsPanel.getParent().getElement().removeClassName("transparent");
				}
			}.schedule(10);
		}
	}
	
	
	/**
	 * Add click support to menu items.
	 */
	private void handleMenuItems(){
		final HTML5Element root = (HTML5Element) mainPanel.getElement();
		String browserStateToken = History.getToken();
		if(browserStateToken.equals("")){
			browserStateToken = "request";
		}
		
		ArrayList<HTML5Element> nodes = new ArrayList<HTML5Element>();
		root.querySelectorAll("ul."+style.mainNav()+" > li", nodes);
		int listCnt = nodes.size();
		for( int i=0; i< listCnt; i++ ){
			
			final HTML5Element currentElement = nodes.get(i);
			final String hash = currentElement.getAttribute("page");
			if( hash.equals("") ) continue;
			
			if( hash.equals(browserStateToken) ){
				currentElement.getClassList().add("navBarItemSelected");
			}
			
			ElementWrapper wrapper = new ElementWrapper(currentElement);
			wrapper.addClickHandler(new ClickHandler() {
				@Override
				public void onClick(ClickEvent event) {
					History.newItem(hash);
				}
			});
		}
	}
	
	final native void initPlusOneButton() /*-{
	    var po = document.createElement('script'); 
	    po.type = 'text/javascript'; 
	    po.async = true;
	    po.src = 'https://apis.google.com/js/plusone.js';
	    var s = $doc.getElementsByTagName('script')[0]; 
	    s.parentNode.insertBefore(po, s);
	}-*/;
}
