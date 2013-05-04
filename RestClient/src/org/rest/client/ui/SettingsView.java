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

import com.google.gwt.place.shared.Place;
import com.google.gwt.user.client.ui.IsWidget;
/**
 * View for "Settings" place
 * @author jarrod
 *
 */
public interface SettingsView extends IsWidget {
	/**
	 * Presenter interface
	 * @author Paweł Psztyć
	 *
	 */
	public interface Presenter {
		/**
		 * Change place
		 * @param place
		 */
		void goTo(Place place);
		/**
		 * Clears application requests history
		 */
		void clearHistory();
		
		void changeDebugValue(boolean newValue);
		void changeHistoryValue(boolean newValue);
		void changeNotificationsValue(boolean notificationsEnabled);
		void changeMagicVarsValue(boolean magicVarsEnabled);
		void changeCodeMirrorHeadersValue(boolean codeMirrorHeadersEnabled);
		void changeCodeMirrorPayloadValue(boolean codeMirrorPayloadEnabled);
	}
	/**
	 * Sets presenter for this view
	 * @param listener
	 */
	void setPresenter(Presenter listener);
	void setDebugEnabled(boolean debugEnabled);
	boolean isDebugEnabled();
	void setHistoryEnabled(boolean historyEnabled);
	boolean isHistoryEnabled();
	void setNotificationsEnabled(boolean notificationsEnabled);
	boolean isNotificationsEnabled();
	void setMagicVarsEnabled(boolean magicVarsEnabled);
	boolean isMagicVarsEnabled();
	void setCodeMirrorHeadersEnabled(boolean codeMirrorHeadersEnabled);
	void setCodeMirrorPayloadEnabled(boolean codeMirrorPayloadEnabled);
}
