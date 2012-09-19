package org.rest.client.activity;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.place.ImportExportPlace;
import org.rest.client.request.ApplicationSession;
import org.rest.client.request.ApplicationSessionCallback;
import org.rest.client.request.PingRequest;
import org.rest.client.ui.ImportExportView;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.ParagraphElement;
import com.google.gwt.dom.client.PreElement;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.web.bindery.event.shared.EventBus;

public class ImportExportActivity extends AppActivity implements
		ImportExportView.Presenter {
	
	final private ImportExportPlace place;
	private EventBus eventBus;
	private ImportExportView view;
	
	public ImportExportActivity(ImportExportPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}
	
	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);
		
		view = clientFactory.getImportExportView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());
		
		
		
		
		//Old system setup
		checkUserSession();
		
	}
	
	
	
	//
	// OLD SYSTEM
	//
	private String applicationUserId = null;
	
	
	private void checkUserSession(){
		if(RestClient.isDebug()){
			Log.debug("Checking session status on applications server.");
		}
		
		PingRequest.getSession(new ApplicationSessionCallback() {
			
			@Override
			public void onSuccess(ApplicationSession session) {
				if(session.getState() == ApplicationSession.CONNECTED){
					applicationUserId = session.getUserId();
					view.setIsUserView();
				}
			}
			
			@Override
			public void onFailure(String message, Throwable exception) {
				if(RestClient.isDebug()){
					Log.error(message, exception);
				}
				StatusNotification.notify(message, StatusNotification.TYPE_CRITICAL);
			}
		});
	}

	@Override
	public String getApplicationUserId() {
		return applicationUserId;
	}
	
}
