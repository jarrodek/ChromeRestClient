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

import java.util.ArrayList;
import java.util.Date;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.place.SocketPlace;
import org.rest.client.storage.store.UrlHistoryStoreWebSql;
import org.rest.client.suggestion.UrlsSuggestOracle;
import org.rest.client.tutorial.TutorialFactory;
import org.rest.client.ui.SocketView;
import org.rest.client.ui.desktop.StatusNotification;
import org.rest.client.websocket.SocketCloseHandler;
import org.rest.client.websocket.SocketErrorHandler;
import org.rest.client.websocket.SocketMessage;
import org.rest.client.websocket.SocketMessageHandler;
import org.rest.client.websocket.SocketOpenHandler;
import org.rest.client.websocket.WebSocket;
import org.rest.client.websocket.WebSocketImpl;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.shared.DateTimeFormat.PredefinedFormat;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.web.bindery.event.shared.EventBus;

/**
 * Activities typically restore state ("wake up"), perform initialization
 * ("set up"), and load a corresponding UI ("show up")
 * 
 * @author Paweł Psztyć
 * 
 */
public class SocketActivity extends AppActivity implements
		SocketView.Presenter {

	
	final private SocketPlace place;
	private EventBus eventBus;
	SocketView view = null;
	TutorialFactory tutorialFactory = null;
	private WebSocket socket = null;
	private String socketUrl = null;
	private final ArrayList<SocketMessage> messages = new ArrayList<SocketMessage>();
	private String exportFileObjectUrl = null;
	
	public SocketActivity(SocketPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);
		
		view = clientFactory.getSocketView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());
		restoreLatestSocket();
		activateTutorial();
	}
	
	private void restoreLatestSocket(){
		Storage store = Storage.getLocalStorageIfSupported();
		String socketUrl = store.getItem("latstSocket");
		if(socketUrl != null && !socketUrl.isEmpty()){
			view.setUrl(socketUrl);
		}
	}
	
	
	
	@Override
	public String mayStop() {
		if(tutorialFactory != null){
			tutorialFactory.clear();
		}
		
		if(socketUrl != null){
			Storage store = Storage.getLocalStorageIfSupported();
			store.setItem("latstSocket", socketUrl);
		}
		
		if(socket != null){
			socket.close();
		}
		
		revokeDownloadData();
		
		return null;
	}
	
	
	private void activateTutorial() {
		tutorialFactory = new TutorialFactory("about");
		
		if(!tutorialFactory.canStartTutorial()){
			return;
		}
		view.setUpTutorial(tutorialFactory);
	}

	@Override
	public void sendMessage(String message) {
		if(socket == null){
			StatusNotification.notify("Socket not ready",StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
			return;
		}
		try {
			socket.send(message);
			SocketMessage msg = SocketMessage.create(message);
			messages.add(msg);
		} catch (Exception e) {
			e.printStackTrace();
			Log.error("Unable sent socket message",e);
			StatusNotification.notify("Unable sent socket message.");
		}
	}

	@Override
	public void prepareDownloadData(Callback<String, Throwable> callback) {
		if(exportFileObjectUrl != null){
			revokeDownloadData();
		}
		String body = "";
		for(SocketMessage message : messages){
			long time = (long) message.getCreated();
			Date created = new Date(time);
			String date = DateTimeFormat.getFormat(PredefinedFormat.DATE_TIME_FULL).format(created);
			boolean isSent = message.isMessageIsSent();
			body += "[" + date + "] ";
			body += (isSent) ? "<<< " : ">>> ";
			body += message.getStringMessage() + "\n";
		}
		exportFileObjectUrl = createDownloadDataImpl(body, "text/plain");
		callback.onSuccess(exportFileObjectUrl);
	}
	
	private final native String createDownloadDataImpl(String data, String endoding) /*-{
		var blob = new $wnd.Blob([data], {type: endoding});
		return $wnd.URL.createObjectURL(blob);
	}-*/;

	@Override
	public void revokeDownloadData() {
		if(exportFileObjectUrl != null){
			revokeDownloadDataImpl(exportFileObjectUrl);
			exportFileObjectUrl = null;
		}
	}
	
	private final native void revokeDownloadDataImpl(String url) /*-{
		$wnd.URL.revokeObjectURL(url);
	}-*/;

	@Override
	public void connect(String url) {
		if(socket != null){
			socket.close();
		}
		socket = null;
		socketUrl = url;
		messages.clear();
		
		view.setConnectionStatus(WebSocket.CONNECTING);
		
		socket = WebSocketImpl.open(url);
		setUpSocketHandlers();
	}
	
	private void setUpSocketHandlers(){
		socket.addCloseHandler(new SocketCloseHandler() {
			@Override
			public void onClose() {
				if(RestClient.isDebug()){
					Log.debug("Socket close. " + socketUrl);
				}
				view.setConnectionStatus(WebSocket.CLOSED);
			}
		});
		socket.addErrorHandler(new SocketErrorHandler() {
			@Override
			public void onError() {
				if(RestClient.isDebug()){
					Log.error("Socket error: " + socketUrl);
				}
			}
		});
		socket.addMessageHandler(new SocketMessageHandler() {
			@Override
			public void onMessage(SocketMessage message) {
				messages.add(message);
				view.setResponse(message);
			}
		});
		socket.addOpenHandler(new SocketOpenHandler() {
			@Override
			public void onOpen() {
				if(RestClient.isDebug()){
					Log.debug("Socket opened: " + socketUrl);
				}
				
				view.setConnectionStatus(WebSocket.OPEN);
			}
		});
	}

	@Override
	public void disconnect() {
		view.setConnectionStatus(WebSocket.CLOSING);
		socket.close();
		socket = null;
	}

	@Override
	public UrlsSuggestOracle getUrlsSuggestOracle() {
		UrlHistoryStoreWebSql historyStore = clientFactory.getUrlHistoryStore();
		return new UrlsSuggestOracle(historyStore);
	}

	@Override
	public void clearLog() {
		messages.clear();
	}

	@Override
	public boolean canSendMessage() {
		if(socket == null) return false;
		if(socket.getReadyState() == WebSocket.OPEN) return true;
		return false;
	}
}
