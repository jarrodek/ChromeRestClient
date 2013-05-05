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
package org.rest.client.ui.desktop;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.event.HttpEncodingChangeEvent;
import org.rest.client.event.HttpMethodChangeEvent;
import org.rest.client.event.RequestChangeEvent;
import org.rest.client.event.RequestStartActionEvent;
import org.rest.client.event.SaveRequestEvent;
import org.rest.client.event.SavedRequestEvent;
import org.rest.client.place.RequestPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.request.FilesObject;
import org.rest.client.request.HttpContentTypeHelper;
import org.rest.client.request.HttpMethodOptions;
import org.rest.client.request.RequestHeadersParser;
import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.tutorial.TutorialFactory;
import org.rest.client.ui.EditProjectView;
import org.rest.client.ui.IsHideable;
import org.rest.client.ui.RequestView;
import org.rest.client.ui.TutorialDialog;
import org.rest.client.ui.TutorialDialog.Direction;
import org.rest.client.ui.desktop.widget.RequestBodyWidget;
import org.rest.client.ui.desktop.widget.RequestHeadersWidget;
import org.rest.client.ui.desktop.widget.RequestUrlWidget;
import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.ui.html5.HTML5Progress;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.RadioButton;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xhr2.client.RequestHeader;
import com.google.web.bindery.event.shared.EventBus;

public class RequestViewImpl extends Composite implements RequestView {
	private static RequestViewImplUiBinder uiBinder = GWT
			.create(RequestViewImplUiBinder.class);

	interface RequestViewImplUiBinder extends UiBinder<Widget, RequestViewImpl> {
	}

	private Presenter listener;
	
	@UiField(provided = true) RequestUrlWidget urlWidget;
	@UiField RequestHeadersWidget requestHeaders;
	@UiField RequestBodyWidget requestBody;
	@UiField RadioButton radioGet;
	@UiField RadioButton radioPost;
	@UiField RadioButton radioPut;
	@UiField RadioButton radioDelete;
	@UiField RadioButton radioHead;
	@UiField RadioButton radioOptions;
	@UiField RadioButton radioPatch;
	@UiField RadioButton radioOther;
	@UiField TextBox otherMethodValue;
	@UiField ListBox contentTypeInput;
	@UiField DivElement contentTypeContainer;
	@UiField HTML5Progress progressIndicator;
	@UiField Button sendButton;
	@UiField Button saveButton;
	@UiField Button refreshDriveButton;
	@UiField DivElement projectPanel;
	@UiField DivElement requestNamePanel;
	@UiField InlineLabel projectName;
	@UiField HTMLPanel endpointsContainer;
	@UiField TextBox requestNameField;

	private List<IsHideable> hidableList = new ArrayList<IsHideable>();
	private String currentSelectedMethod = "GET";
	private String latestSelectedContentType = "";

	private ProjectObject openedProject;

	public RequestViewImpl() {

		urlWidget = new RequestUrlWidget();
		initWidget(uiBinder.createAndBindUi(this));
		
		requestNameField.getElement().setAttribute("placeholder", "[Unnamed]");
		
		createContentTypeValues(null);
		hidableList.add(requestBody);
	}
	
	void initializeAppHandlers(){
		//when the user save current request and create a name for it - update name field
		SavedRequestEvent.register(RestClient.getClientFactory().getEventBus(), new SavedRequestEvent.Handler() {
			@Override
			public void onSaved(RequestObject obj) {
				String name = obj.getName();
				if(name == null){
					name = "";
				}
				requestNameField.setValue(name);
			}
		});
	}
	
	private void createContentTypeValues(String[] userValues) {
		String[] ctValues = HttpContentTypeHelper.getAllValues();
		String[] allValues = org.rest.client.util.ArraysUtils.concat(ctValues,
				userValues);
		Arrays.sort(allValues);
		contentTypeInput.clear();
		contentTypeInput.addItem("Add new...", "");

		for (String contentType : allValues) {
			contentTypeInput.addItem(contentType, contentType);
		}
		String defaultSelectedContentTypeValue = HttpContentTypeHelper
				.getDefaulSelected();
		selectContentTypeValue(defaultSelectedContentTypeValue);
	}

	private void selectContentTypeValue(String value) {
		int cnt = contentTypeInput.getItemCount();
		for (int i = 0; i < cnt; i++) {
			String itemValue = contentTypeInput.getItemText(i);
			if (itemValue.equals(value)) {
				contentTypeInput.setSelectedIndex(i);
				latestSelectedContentType = itemValue;
				RestClient.getClientFactory().getEventBus()
						.fireEvent(new HttpEncodingChangeEvent(itemValue));
				break;
			}
		}
	}

	@Override
	public void setPresenter(Presenter listener) {
		this.listener = listener;
		urlWidget.setPresenter(listener);
	}

	/**
	 * Action to call on UI when methods radio buttons change state.
	 * 
	 * @param newValue
	 *            New method value (selected radio button value)
	 * @param checkOther
	 *            True to check "Other" field status and enable/disable control
	 */
	private void methodChangeAction(String newValue, boolean checkOther) {
		if (checkOther) {
			if (newValue.equals("Other")) {
				otherMethodValue.setEnabled(true);
				currentSelectedMethod = otherMethodValue.getValue();
				otherMethodValue.getElement().focus();
				otherMethodValue.selectAll();
			} else {
				otherMethodValue.setEnabled(false);
				currentSelectedMethod = newValue;
			}
		}
		if (HttpMethodOptions.hasBody(newValue)) {
			for (IsHideable _i : hidableList) {
				_i.show();
			}
			contentTypeContainer.removeClassName("hidden");
		} else {
			for (IsHideable _i : hidableList) {
				_i.hide();
			}
			contentTypeContainer.addClassName("hidden");
		}

		RestClient.getClientFactory().getEventBus()
				.fireEvent(new HttpMethodChangeEvent(currentSelectedMethod));
	}

	/**
	 * Content Type change event.
	 * 
	 * @param event
	 */
	@UiHandler("contentTypeInput")
	void oncontentTypeInputChange(ChangeEvent event) {
		if (listener == null) {
			return;
		}
		String currentValue = contentTypeInput.getValue(contentTypeInput
				.getSelectedIndex());
		if (currentValue.equals("")) {
			listener.requestAddEncodingDialog(latestSelectedContentType);
		} else {
			latestSelectedContentType = currentValue;
			listener.fireEncodingChangeEvent(currentValue);
		}
	}

	@UiHandler("clearButton")
	void onClearButton(ClickEvent e) {
		reset();
		listener.fireClearAllEvent();
	}

	
	@Override
	public void reset() {
		projectPanel.addClassName("hidden");
		sendButton.setEnabled(false);
		progressIndicator.setStyleName("hidden");
		progressIndicator.getElement().removeAttribute("value");

		projectName.setText("");
		endpointsContainer.clear();

		urlWidget.clearAll();
		requestHeaders.clear();
		requestBody.clear();
		radioGet.setEnabled(true);
		selectContentTypeValue(HttpContentTypeHelper.getDefaulSelected());
		
		openedProject = null;
		refreshDriveButton.setEnabled(true);
		refreshDriveButton.addStyleName("hidden");
		requestNameField.setEnabled(true);
		requestNameField.setValue("");
	}
	
	
	
	/**
	 * Handler for method radio box state change
	 * 
	 * @param event
	 */
	@UiHandler({ "radioGet", "radioPost", "radioPut", "radioDelete",
			"radioHead", "radioOptions", "radioPatch", "radioOther" })
	void onMethodChangeClick(ValueChangeEvent<Boolean> event) {
		if (!event.getValue().booleanValue()) {
			return;
		}
		
		RadioButton obj = (RadioButton) event.getSource();
		String newValue = obj.getText();
		methodChangeAction(newValue, true);
	}

	/**
	 * Handler for the Other Method input box change
	 * 
	 * @param event
	 */
	@UiHandler("otherMethodValue")
	void onOtherMethodChange(ValueChangeEvent<String> event) {
		currentSelectedMethod = event.getValue();
		if (listener != null) {
			listener.fireMethodChangeEvent(currentSelectedMethod);
		}
	}

	@Override
	public String getUrl() {
		return urlWidget.getText();
	}

	@Override
	public void setUrl(String url) {
		if(url == null) url = "";
		urlWidget.setText(url);
		if (url == null || url.isEmpty()) {
			sendButton.setEnabled(false);
		} else {
			sendButton.setEnabled(true);
		}
	}

	@Override
	public String getMethod() {
		return currentSelectedMethod;
	}

	@Override
	public void setMethod(String method) {
		if (method == null) {
			method = "GET";
		}

		if (!this.currentSelectedMethod.equals(method)) {
			selectMethodRadio(method);
		}

		this.currentSelectedMethod = method;
		methodChangeAction(method, false);
	}

	/**
	 * Change selected method radiobox
	 * 
	 * @param method
	 */
	private void selectMethodRadio(String method) {
		if(method == null) method = "GET";
		if (method.equals("GET")) {
			radioGet.setValue(true, false);
		} else if (method.equals("POST")) {
			radioPost.setValue(true, false);
		} else if (method.equals("PUT")) {
			radioPut.setValue(true, false);
		} else if (method.equals("PATCH")) {
			radioPatch.setValue(true, false);
		} else if (method.equals("DELETE")) {
			radioDelete.setValue(true, false);
		} else if (method.equals("HEAD")) {
			radioHead.setValue(true, false);
		} else if (method.equals("OPTIONS")) {
			radioOptions.setValue(true, false);
		} else {
			radioOther.setValue(true, false);
			otherMethodValue.setValue(method, false);
			otherMethodValue.setEnabled(true);
		}
	}

	@Override
	public String getHeaders() {
		return requestHeaders.getText();
	}

	@Override
	public void setHeaders(String header) {
		if(header == null) header = "";
		requestHeaders.setText(header);
	}

	@Override
	public String getPayload() {
		return requestBody.getText();
	}

	@Override
	public void setPayload(String payload) {
		if(payload == null) payload = "";
		requestBody.setText(payload);
	}

	@Override
	public String getEncoding() {
		return contentTypeInput.getValue(contentTypeInput.getSelectedIndex());
	}

	@Override
	public void setEncoding(String encoding) {
		if (encoding == null) {
			return;
		}
		
		ArrayList<RequestHeader> requerstHeadersList = RequestHeadersParser
				.stringToHeaders(getHeaders());
		boolean headersListchanged = false;
		RequestHeader possiblyToRemoveHeader = null;
		for (RequestHeader h : requerstHeadersList) {
			if (h.getName().toLowerCase().equals("content-type")) {
				possiblyToRemoveHeader = h;
				encoding = h.getValue(); 
				break;
			}
		}
		boolean hasBoudary = false;
		if(encoding.contains("multipart/form-data;")){ //"multipart/form-data" with boudary
			encoding = "multipart/form-data";
			hasBoudary = true;
		}
		
		int cnt = contentTypeInput.getItemCount();
		for (int i = 0; i < cnt; i++) {
			if (contentTypeInput.getValue(i).equals(encoding)) {
				contentTypeInput.setSelectedIndex(i);
				latestSelectedContentType = contentTypeInput.getValue(i);
				RestClient
						.getClientFactory()
						.getEventBus()
						.fireEvent(
								new HttpEncodingChangeEvent(
										latestSelectedContentType));
				if(!hasBoudary){
					requerstHeadersList.remove(possiblyToRemoveHeader);
				}
				headersListchanged = true;
				break;
			}
		}
		if (headersListchanged) {
			setHeaders(RequestHeadersParser.headersListToString(requerstHeadersList));
		}
	}

	@Override
	public ArrayList<FilesObject> getFiles() {
		return requestBody.getInputFiles();
	}

	@Override
	public void appendEncodingValues(String[] values) {
		createContentTypeValues(values);
	}

	@UiHandler("sendButton")
	void onSendClick(ClickEvent e) {
		EventBus eventBus = RestClient.getClientFactory().getEventBus();
		RequestStartActionEvent ev = new RequestStartActionEvent(new Date());
		eventBus.fireEvent(ev);
	}

	@Override
	public void setProjectData(ProjectObject project,
			List<RequestObject> requests, int currentEndpoint) {
		this.openedProject = project;
		projectPanel.removeClassName("hidden");
		requestNamePanel.addClassName("hidden");
		projectName.setText(project.getName());
		
		final ListBox lb = new ListBox();
		lb.setStyleName("selectControl");
		int i = 0;
		int endpointPosition = 0;
		for (final RequestObject r : requests) {
			lb.addItem(r.getName(), r.getId()+"");
			if(r.getId() == currentEndpoint){
				endpointPosition = i;
			}
			i++;
		}
		lb.setSelectedIndex(endpointPosition);
		endpointsContainer.add(lb);
		lb.addChangeHandler(new ChangeHandler() {
			@Override
			public void onChange(ChangeEvent event) {
				int id = Integer.parseInt(lb.getValue(lb.getSelectedIndex()));
				listener.goTo(RequestPlace.Tokenizer.fromProject(id));
			}
		});
		
		
		RestClient.fixChromeLayout();
	}

	

	@Override
	public void setUpTutorial(final TutorialFactory factory) {
		new Timer() {
			@Override
			public void run() {
				setTutorialData(factory);
			}
		}.schedule(500);
	}
	
	
	private void setTutorialData(TutorialFactory factory){
		TutorialDialog url = TutorialFactory.createItem();
		url.setReferencedElement(urlWidget.getElement(), Direction.BOTTOM);
		url.setPositionCorrection(-20, -13);
		url.setHTML("Expand URL panel to see detailed view.");
		url.showArrow(Direction.TOP);
		factory.addItem(url);
		
		
		
		TutorialDialog form = TutorialFactory.createItem();
		form.setReferencedElement(requestHeaders.getElement(), Direction.LEFT);
		form.setPositionCorrection(-4, 660);
		form.setHTML("In headers form panel start typing header name. For example Authorization. <br/>While typing, suggestions will show up.");
		form.showArrow(Direction.LEFT);
		form.setBeforeTutorialShowHandler(new TutorialDialog.BeforeTutorialShowHandler() {
			@Override
			public void beforeShow() {
				urlWidget.setToogleView(false);
				requestHeaders.setTabOpened(RequestHeadersWidget.TABS.FORM);
			}
		});
		factory.addItem(form);
		
		HTML5Element nav = (HTML5Element)DOM.getElementById("appNavigation");
		Element savedElement = nav.querySelector("li[data-place=\"saved\"]");
		
		TutorialDialog saved = TutorialFactory.createItem();
		saved.setReferencedElement(savedElement, Direction.RIGHT);
		saved.setPositionCorrection(-5, -40);
		saved.setHTML("When You press CTRL+S save dialog will appear.<br/>Saved requests are stored in this panel.");
		saved.showArrow(Direction.LEFT);
		factory.addItem(saved);
		
		Element historyElement = nav.querySelector("li[data-place=\"history\"]");
		TutorialDialog history = TutorialFactory.createItem();
		history.setReferencedElement(historyElement, Direction.RIGHT);
		history.setPositionCorrection(-5, -40);
		history.setHTML("When You send the request it will be automatically saved in local store.<br/>Anytime you can restore previous request.");
		history.showArrow(Direction.LEFT);
		factory.addItem(history);
		
		Element projectsElement = nav.querySelector("li[data-place=\"projects\"]");
		TutorialDialog projects = TutorialFactory.createItem();
		projects.setReferencedElement(projectsElement, Direction.RIGHT);
		projects.setPositionCorrection(-5, -40);
		projects.setHTML("You can set a group of saved requests as the project.<br/>Easly switch between the endpoints of your application.");
		projects.showArrow(Direction.LEFT);
		factory.addItem(projects);
		
		Element aboutElement = nav.querySelector("li[data-place=\"about\"]");
		TutorialDialog about = TutorialFactory.createItem();
		about.setReferencedElement(aboutElement, Direction.RIGHT);
		about.setPositionCorrection(-5, -40);
		about.setHTML("For more informations visit the about page.");
		about.showArrow(Direction.LEFT);
		factory.addItem(about);

		factory.start();
	}

	@Override
	public void handleUrlValueChangeEvent(String url) {
		if (url == null || url.isEmpty()) {
			sendButton.setEnabled(false);
		} else {
			sendButton.setEnabled(true);
		}
	}

	/**
	 * When request starts disable UI controls
	 */
	@Override
	public void handleRequestStartActionEvent(Date time) {
		progressIndicator.removeStyleName("hidden");
		sendButton.setEnabled(false);
	}

	@Override
	public void handleRequestEndEvent() {
		progressIndicator.addStyleName("hidden");
		progressIndicator.getElement().removeAttribute("value");
		sendButton.setEnabled(true);
	}

	@Override
	public void handleRequestChangeEvent(RequestChangeEvent event) {
		switch (event.getChangeType()) {
		case RequestChangeEvent.UPLOAD_START:
			progressIndicator.setMax(100);
			progressIndicator.removeStyleName("hidden");
			break;
		case RequestChangeEvent.UPLOAD_PROGRESS:
			progressIndicator.setMax((int) event.getTotal());
			double current = event.getLoaded();
			progressIndicator.setValue((int) current);
			break;
		case RequestChangeEvent.UPLOAD_END:
			progressIndicator.getElement().removeAttribute("value");
			break;
		case RequestChangeEvent.DOWNLOAD_PROGRESS:
			progressIndicator.setMax(100);
			break;
		}
	}
	
	@UiHandler("deleteEndpoint")
	void onDeleteEndpoint(ClickEvent e){
		e.preventDefault();
		final DialogBox dialog = new DialogBox(true);
		dialog.setAnimationEnabled(true);
		dialog.setGlassEnabled(true);
		dialog.setModal(true);
		
		HTMLPanel wrapper = new HTMLPanel("");
		Label message = new Label("Delete selected endpoint?");
		HTMLPanel buttons = new HTMLPanel("");
		buttons.setStyleName("dialogButtons");
		Button confirm = new Button("Confirm");
		confirm.setStyleName("button");
		Button cancel = new Button("Cancel");
		cancel.setStyleName("button");
		buttons.add(confirm);
		buttons.add(cancel);
		wrapper.add(message);
		wrapper.add(buttons);
		dialog.add(wrapper);
		dialog.show();
		dialog.center();
		cancel.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				dialog.hide();
			}
		});
		confirm.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				dialog.hide();
				listener.deleteCurrentEndpoint();
			}
		});
	}
	
	@UiHandler("editProject")
	void onEditProject(ClickEvent e){
		if(openedProject == null){
			return;
		}
		EditProjectView dialog = listener.getEditProjectDialog();
		EventBus eventBus = RestClient.getClientFactory().getEventBus();
		dialog.setEventBus(eventBus);
		dialog.setProjectData(openedProject);
		dialog.show();
	}
	
	
	@Override
	public void updateProjectMetadata(ProjectObject project) {
		this.openedProject = project;
		projectName.setText(project.getName());
	}
	@UiHandler("saveButton")
	void onSaveButtonClick(ClickEvent e){
		e.preventDefault();
		EventBus eventBus = RestClient.getClientFactory().getEventBus();
		SaveRequestEvent saveEvent = new SaveRequestEvent();
		eventBus.fireEvent(saveEvent);
	}
	@UiHandler("openButton")
	void onOpenButtonClick(ClickEvent e){
		e.preventDefault();
		listener.goTo(new SavedPlace("default"));
	}

	@Override
	public void setRequestName(String name) {
		if(name == null || name.isEmpty()){
			name = ""; //[Unnamed]
		}
		requestNameField.getElement().setAttribute("data-name", name);
		requestNameField.setValue(name);
		requestNameField.setEnabled(true);
		requestNamePanel.removeClassName("hidden");
		projectPanel.addClassName("hidden");
	}
	@UiHandler("requestNameField")
	void onRequestNameField(ValueChangeEvent<String> event){
		final String name = event.getValue();
		if(name.isEmpty()){
			String prevName = requestNameField.getElement().getAttribute("data-name");
			requestNameField.setValue(prevName);
			return;
		}
		
		listener.changeSavedName(name, new Callback<Boolean, Throwable>() {
			@Override
			public void onSuccess(Boolean result) {
				if(result.booleanValue()){
					requestNameField.getElement().setAttribute("data-name", name);
				} else {
					StatusNotification.notify("You can't change this item name.",StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
				}
			}
			
			@Override
			public void onFailure(Throwable reason) {
				String prevName = requestNameField.getElement().getAttribute("data-name");
				requestNameField.setValue(prevName);
			}
		});
	}
	
	
	@Override
	public void setGDriveConstrols() {
		refreshDriveButton.setEnabled(true);
		refreshDriveButton.removeStyleName("hidden");
		//disable name change field
		requestNameField.setEnabled(false);
	}
	@UiHandler("refreshDriveButton")
	void onRefreshDriveButton(ClickEvent e){
		e.preventDefault();
		refreshDriveButton.setEnabled(false);
		listener.refreshCurrentDriveItem();
	}

	@Override
	public void setUpDriveTutorial(final TutorialFactory factory) {
		
		new Timer() {
			@Override
			public void run() {
				TutorialDialog tip = TutorialFactory.createItem();
				tip.setAutoCloseTime(7000);
				tip.setReferencedElement(saveButton.getElement(), Direction.LEFT);
				tip.setPositionCorrection(0, -75);
				tip.setHTML("After change save your work on Google Drive™.");
				tip.showArrow(Direction.RIGHT);
				factory.addItem(tip);
				
				factory.start();
			}
		}.schedule(1000);
		
		
	}

	@Override
	public String getRequestName() {
		String value = requestNameField.getValue();
//		if(value != null && value.isEmpty()){
//			value = null;
//		}
		return value;
	}
}
