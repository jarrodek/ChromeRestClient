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
package org.rest.client.ui;

import org.rest.client.suggestion.SocketSuggestOracle;
import org.rest.client.tutorial.TutorialFactory;
import com.google.gwt.core.client.Callback;
import com.google.gwt.user.client.ui.IsWidget;
import com.google.gwt.websocket.client.SocketMessage;
/**
 * View for "About application" place
 * @author jarrod
 *
 */
public interface SocketView extends IsWidget {
	/**
	 * Presenter interface
	 * @author Paweł Psztyć
	 *
	 */
	public interface Presenter {
		/**
		 * Send socket message
		 * @param message The message to send
		 */
		void sendMessage(String message);
		/**
		 * Prepare collected socket messages to download. 
		 * @param callback Called after data prepare
		 */
		void prepareDownloadData(Callback<String, Throwable> callback);
		/**
		 * Revoke collected data to dwonload.
		 */
		void revokeDownloadData();
		/**
		 * Connect to the socket
		 */
		void connect(String url);
		/**
		 * Disconnect socket.
		 */
		void disconnect();
		
		SocketSuggestOracle getUrlsSuggestOracle();
		/**
		 * clear all received and sent data
		 */
		void clearLog();
		/**
		 * @return true if message can be send
		 */
		boolean canSendMessage();
	}
	/**
	 * Sets presenter for this view
	 * @param listener
	 */
	void setPresenter(Presenter listener);
	/**
	 * Set up tutorial.
	 * @param tutorialFactory
	 */
	void setUpTutorial(TutorialFactory tutorialFactory);
	/**
	 * Set socket URL
	 * @param url
	 */
	void setUrl(String url);
	/**
	 * 
	 * @return Curret socket URL
	 */
	String getUrl();
	/**
	 * Set socket response body
	 * @param message Received message
	 */
	void setResponse(SocketMessage message);
	/**
	 * Set connection status
	 * @param status Current connection status.
	 */
	void setConnectionStatus(int status);
}
