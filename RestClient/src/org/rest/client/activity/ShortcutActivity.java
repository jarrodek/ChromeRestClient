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

import java.util.List;

import org.rest.client.ClientFactory;
import org.rest.client.Shortcut;
import org.rest.client.ShortcutHandlers;
import org.rest.client.place.ShortcutPlace;
import org.rest.client.ui.ShortcutView;
import org.rest.client.ui.desktop.StatusNotification;

import com.google.gwt.core.client.Callback;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.web.bindery.event.shared.EventBus;

/**
 * Activities typically restore state ("wake up"), perform initialization
 * ("set up"), and load a corresponding UI ("show up")
 * 
 * @author Paweł Psztyć
 * 
 */
public class ShortcutActivity extends AppActivity implements
		ShortcutView.Presenter {

	
	@SuppressWarnings("unused")
	final private ShortcutPlace place;
	@SuppressWarnings("unused")
	private EventBus eventBus;

	public ShortcutActivity(ShortcutPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);
		
		final ShortcutView view = clientFactory.getShortcutView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());
		
		ShortcutHandlers.getShortcuts(new Callback<List<Shortcut>, Throwable>() {
			@Override
			public void onSuccess(List<Shortcut> result) {
				view.setShortcuts(result);
			}
			
			@Override
			public void onFailure(Throwable reason) {
				StatusNotification.notify("Unable to find current shorcuts state.", StatusNotification.TYPE_ERROR);
			}
		});
	}
	
}
