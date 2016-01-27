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
import org.rest.client.StatusNotification;
import org.rest.client.jso.WebSocketObject;
import org.rest.client.log.Log;
import org.rest.client.place.SocketPlace;
import org.rest.client.storage.StoreKeys;
import org.rest.client.storage.store.WebSocketDataStoreWebSql;
import org.rest.client.suggestion.SocketSuggestOracle;
import org.rest.client.tutorial.TutorialFactory;
import org.rest.client.ui.SocketView;

import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageResult;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.shared.DateTimeFormat.PredefinedFormat;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.gwt.websocket.client.SocketCloseHandler;
import com.google.gwt.websocket.client.SocketErrorHandler;
import com.google.gwt.websocket.client.SocketMessage;
import com.google.gwt.websocket.client.SocketMessageHandler;
import com.google.gwt.websocket.client.SocketOpenHandler;
import com.google.gwt.websocket.client.WebSocket;
import com.google.gwt.websocket.client.WebSocketImpl;
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
	private SocketView view = null;
	private TutorialFactory tutorialFactory = null;
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
		Storage store = GWT.create(Storage.class);
		JSONObject jo = new JSONObject();
		jo.put(StoreKeys.LATEST_SOCKET_URL, new JSONObject(null));
		store.getSync().get(jo.getJavaScriptObject(), new StorageArea.StorageItemsCallback() {

			@Override
			public void onError(String message) {
				if(RestClient.isDebug()){
					Log.error("SocketActivity::restoreLatestSocket - " + message);
				}
			}

			@Override
			public void onResult(JavaScriptObject result) {
				StorageResult<String> data = result.cast();
				if(data == null){
					return;
				}
				String latest = data.get(StoreKeys.LATEST_SOCKET_URL);
				if(latest != null){
					view.setUrl(latest);
				}
			}
		});
		
	}
	
	
	
	@Override
	public String mayStop() {
		if(tutorialFactory != null){
			tutorialFactory.clear();
		}
		
		if(socketUrl != null){
			JSONObject jo = new JSONObject();
			jo.put(StoreKeys.LATEST_SOCKET_URL, new JSONString(socketUrl));
			Storage store = GWT.create(Storage.class);
			store.getSync().set(jo.getJavaScriptObject(), new StorageSimpleCallback() {
				
				@Override
				public void onError(String message) {
					if(RestClient.isDebug()){
						Log.error("SocketActivity::mayStop - " + message);
					}
				}
				
				@Override
				public void onDone() {}
			});
		}
		
		if(socket != null){
			socket.close();
		}
		
		revokeDownloadData();
		
		return null;
	}
	
	
	private void activateTutorial() {
		tutorialFactory = new TutorialFactory("socket");
		
		tutorialFactory.canStartTutorial(new Callback<Boolean, Throwable>() {
			
			@Override
			public void onSuccess(Boolean result) {
				if(result){
					view.setUpTutorial(tutorialFactory);
				}
			}
			
			@Override
			public void onFailure(Throwable reason) {}
		});
	}

	@Override
	public void sendMessage(String message) {
		if(socket == null){
			StatusNotification.notify("Socket not ready", StatusNotification.TIME_SHORT);
			return;
		}
		SocketMessage msg = SocketMessage.create(message);
		messages.add(msg);
		try {
			socket.send(message);
		} catch (Exception e) {
			messages.remove(msg);
			Log.error("Unable sent socket message",e);
			StatusNotification.notify("Unable sent socket message.", StatusNotification.TIME_SHORT);
		}
	}

	@Override
	public void prepareDownloadData(Callback<String, Throwable> callback) {
		if(exportFileObjectUrl != null){
			revokeDownloadData();
		}
		StringBuilder out = new StringBuilder();
		for(SocketMessage message : messages){
			long time = (long) message.getCreated();
			Date created = new Date(time);
			String date = DateTimeFormat.getFormat(PredefinedFormat.DATE_TIME_MEDIUM).format(created);
			boolean isSent = message.isMessageIsSent();
			out.append("[").append(date).append("]");
			out.append(isSent ? " <<< " : " >>> ");
			out.append(message.getStringMessage());
			out.append("\n");
		}
		exportFileObjectUrl = createDownloadDataImpl(out.toString(), "text/plain");
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
		saveHistory();
		view.setConnectionStatus(WebSocket.CONNECTING);
		
		socket = WebSocketImpl.open(url);
		setUpSocketHandlers();
		
	}
	
	private void saveHistory(){
		final WebSocketObject data = WebSocketObject.create(socketUrl);
		final WebSocketDataStoreWebSql store = clientFactory.getWebSocketsStore();
		store.query(socketUrl, new WebSocketDataStoreWebSql.StoreResultsCallback() {
			@Override
			public void onError(Throwable error) {}
			
			@Override
			public void onSuccess(JsArray<WebSocketObject> result) {
				if(result != null && result.length() == 1){
					return;
				}
				store.add(data, new WebSocketDataStoreWebSql.StoreInsertCallback() {
					@Override
					public void onSuccess(int inserId) {}
					@Override
					public void onError(Throwable e) {}
				});
			}
		});
		
	}
	
	private void setUpSocketHandlers(){
		if(socket == null) return;
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
		if(socket == null) return;
		view.setConnectionStatus(WebSocket.CLOSING);
		socket.close();
		socket = null;
	}

	@Override
	public SocketSuggestOracle getUrlsSuggestOracle() {
		WebSocketDataStoreWebSql store = clientFactory.getWebSocketsStore();
		return new SocketSuggestOracle(store);
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
