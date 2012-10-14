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

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.place.AboutPlace;
import org.rest.client.tutorial.TutorialFactory;
import org.rest.client.ui.AboutView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.chrome.def.BackgroundPageCallback;
import com.google.gwt.chrome.runtime.ManifestDetails;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.web.bindery.event.shared.EventBus;

/**
 * Activities typically restore state ("wake up"), perform initialization
 * ("set up"), and load a corresponding UI ("show up")
 * 
 * @author Paweł Psztyć
 * 
 */
public class AboutActivity extends AppActivity implements
		AboutView.Presenter {

	
	final private AboutPlace place;
	private EventBus eventBus;
	AboutView view = null;
	TutorialFactory tutorialFactory = null;

	public AboutActivity(AboutPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);
		
		view = clientFactory.getAboutView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());
		getAppVersion();
		initPlusOne();
		activateTutorial();
	}
	
	@Override
	public String mayStop() {
		if(tutorialFactory != null){
			tutorialFactory.clear();
		}
		return null;
	}
	
	
	private void getAppVersion(){
		clientFactory.getChromeMessagePassing().postMessage("getManifest", "", new BackgroundPageCallback() {
			
			@Override
			public void onSuccess(String result) {
				try{
				JSONValue value = JSONParser.parseStrict(result);
				ManifestDetails manifest = value.isObject().getJavaScriptObject().cast();
				if(view != null){
					view.setManifest(manifest);
				}
				} catch(Exception e){
					if(RestClient.isDebug()){
						Log.warn("Can't parse manifest info",e);
					}
				}
				
			}
		});
	}
	
	
	private void activateTutorial() {
		tutorialFactory = new TutorialFactory("about");
		
		if(!tutorialFactory.canStartTutorial()){
			return;
		}
		view.setUpTutorial(tutorialFactory);
	}
	
	private final native void initPlusOne()/*-{
		try{
			$wnd.gapi.plusone.go();
		} catch(e){
			window.console.error(e);
		}
	}-*/;
}
