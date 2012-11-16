package org.rest.client.ui.desktop;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.rest.client.RestClient;
import org.rest.client.request.RequestParameters;
import org.rest.client.request.URLParser;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.ProjectStoreWebSql;
import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.ui.SaveRequestDialogView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.History;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.CheckBox;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;

public class SaveRequestDialogViewImpl implements CloseHandler<PopupPanel>, KeyDownHandler, SaveRequestDialogView {
	
	interface Binder extends UiBinder<DialogBox, SaveRequestDialogViewImpl> {
		Binder BINDER = GWT.create(Binder.class);
	}
	
	@UiField DialogBox dialog;
	@UiField TextBox name;
	@UiField TextBox prevUrlTextBox;
	@UiField TextBox projectName;
	@UiField CheckBox addToProject;
	@UiField ListBox projectList;
	@UiField DivElement projectNameContainer;
	@UiField DivElement requestOverwriteContainer;
	@UiField Button save;
	@UiField Button overwrite;
	
	@UiField CheckBox protocolStatus;
	@UiField CheckBox serverStatus;
	@UiField CheckBox pathStatus;
	@UiField CheckBox parametersStatus;
	@UiField CheckBox tokenStatus;
	@UiField CheckBox methodStatus;
	@UiField CheckBox payloadStatus;
	@UiField CheckBox headersStatus;
	
	private String requestOrygURL = "";
	private int overwriteId = -1;
	private boolean forceOverwrite = false;
	
	public SaveRequestDialogViewImpl(){
		setPreviewURL();
		Binder.BINDER.createAndBindUi(this);
		if(requestOrygURL == null || requestOrygURL.isEmpty()){
			return;
		}
		dialog.addDomHandler(this, KeyDownEvent.getType());
		dialog.addCloseHandler(this);
		
		name.getElement().setAttribute("placeholder", "name...");
		projectName.getElement().setAttribute("placeholder", "project name...");
		
		addToProject.addValueChangeHandler(new ValueChangeHandler<Boolean>() {
			@Override
			public void onValueChange(ValueChangeEvent<Boolean> event) {
				if(event.getValue()){
					projectList.setEnabled(true);
				} else {
					projectList.setEnabled(false);
				}
				projectListValueChange();
			}
		});
		
		projectList.addChangeHandler(new ChangeHandler() {
			@Override
			public void onChange(ChangeEvent event) {
				projectListValueChange();
			}
		});
		
		ValueChangeHandler<Boolean> optionStatusChange = new ValueChangeHandler<Boolean>() {
			@Override
			public void onValueChange(ValueChangeEvent<Boolean> event) {
				updatePreviewURL();
			}
		};
		
		protocolStatus.addValueChangeHandler(optionStatusChange);
		serverStatus.addValueChangeHandler(optionStatusChange);
		pathStatus.addValueChangeHandler(optionStatusChange);
		parametersStatus.addValueChangeHandler(optionStatusChange);
		tokenStatus.addValueChangeHandler(optionStatusChange);
//		methodStatus.addValueChangeHandler(optionStatusChange);
//		payloadStatus.addValueChangeHandler(optionStatusChange);
		
		prevUrlTextBox.setText(requestOrygURL);
		updatePreviewURL();
		setProjectsList();
		
		//
		//check if it is a restored request. The user may want to overwrite existing request.
		//
		Storage store = Storage.getSessionStorageIfSupported();
		String restored = store.getItem("restoredRequest");
		if(restored != null && !restored.isEmpty()){
			int restoredId = -1;
			try{
				restoredId = Integer.parseInt(restored);
			} catch(Exception e){}
			if(restoredId > 0){
				overwriteId = restoredId;
				RestClient.getClientFactory().getRequestDataStore().getByKey(restoredId, new StoreResultCallback<RequestObject>(){
					@Override
					public void onSuccess(RequestObject result) {
						if (result == null) {
							overwriteId = -1;
							return;
						}
						
						name.setValue(result.getName());
						overwrite.setVisible(true);
						save.setText("Save as new");
					}

					@Override
					public void onError(Throwable e) {
						overwriteId = -1;
						Log.error("Unable read stored data :(", e);
					}});
			}
		}
	}
	
	
	private void setProjectsList(){
		final ProjectStoreWebSql store = RestClient.getClientFactory().getProjectsStore();
		store.all(new StoreResultCallback<Map<Integer,ProjectObject>>() {
			@Override
			public void onSuccess(Map<Integer, ProjectObject> result) {
				Log.debug("Result project list");
				Iterator<Entry<Integer, ProjectObject>> it = result.entrySet().iterator();
				while(it.hasNext()){
					Entry<Integer, ProjectObject> set = it.next();
					ProjectObject project = set.getValue();
					if(project == null){
						continue;
					}
					String name = project.getName();
					if(name == null || name.isEmpty()){
						continue;
					}
					int id = project.getId();
					projectList.addItem(name, String.valueOf(id));
				}
			}
			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.error("Unable to read stored projects. Error during read operation.", e);
				}
				StatusNotification.notify("Unable to set projects data..", StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
			}
		});
			
		
	}
	
	private void setPreviewURL(){
		if(History.getToken().startsWith("RequestPlace")){
			requestOrygURL = RestClient.getClientFactory().getRequestView().getUrl();
		} else {
			RequestParameters
			.restoreLatest(new Callback<RequestParameters, Throwable>() {
				@Override
				public void onSuccess(RequestParameters result) {
					requestOrygURL = result.getRequestUrl();
				}
	
				@Override
				public void onFailure(Throwable caught) {
				}
			});
		}
	}
	private void updatePreviewURL(){
		if(requestOrygURL == null || requestOrygURL.isEmpty()){
			return;
		}
		
		URLParser data = new URLParser().parse(requestOrygURL);
		String url = "";
		if(protocolStatus.getValue()){
			url += "[FUTURE]";
		} else {
			url += data.getProtocol();
		}
		url += "://";
		
		if(serverStatus.getValue()){
			url += "[FUTURE]";
		} else {
			url += data.getAuthority();
		}
		
		if(pathStatus.getValue()){
			url += "/[FUTURE]/";
		} else {
			if(data.getPath() != null && !data.getPath().isEmpty()){
				url += data.getPath();
			}
		}
		if(parametersStatus.getValue()){
			url += "?[FUTURE]";
		} else {
			if(data.getQuery() != null && !data.getQuery().isEmpty()){
				url += "?" + data.getQuery();
			}
		}
		if(tokenStatus.getValue()){
			url += "#[FUTURE]";
		} else {
			if(data.getAnchor() != null && !data.getAnchor().isEmpty()){
				url += "#" + data.getAnchor();
			}
		}
		prevUrlTextBox.setText(url);
	}
	
	private void projectListValueChange(){
		if(!addToProject.getValue()){
			requestOverwriteContainer.addClassName("hidden");
			projectNameContainer.addClassName("hidden");
			return;
		}
		
		
		String _projectName = projectList.getValue(projectList.getSelectedIndex());
		if(_projectName.equals("")){
			requestOverwriteContainer.addClassName("hidden");
			projectNameContainer.addClassName("hidden");
			return;
		}
		
		requestOverwriteContainer.removeClassName("hidden");
		
		if(_projectName.equals("__new__")){
			projectNameContainer.removeClassName("hidden");
			requestOverwriteContainer.addClassName("hidden");
		} else {
			int parojectId = -1;
			projectNameContainer.addClassName("hidden");
			try{
				parojectId = Integer.parseInt(_projectName);
			} catch(Exception e){}
			if(parojectId == -1){
				StatusNotification.notify("This is not a valid project!", StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
			}
		}
		
		
		dialog.center();
	}
	
	@Override
	public void show() {
		if(requestOrygURL == null || requestOrygURL.isEmpty()){
			StatusNotification.notify("Current request has no URL value :/",StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
			return;
		}
		dialog.show();
		dialog.center();
	}
	
	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		dialog.hide();
	}
	@UiHandler("save")
	void onSave(ClickEvent event) {
		save.setEnabled(false);
		forceOverwrite = false;
		doSaveRequest();
	}
	@UiHandler("overwrite")
	void onOverwrite(ClickEvent event){
		save.setEnabled(false);
		overwrite.setEnabled(false);
		forceOverwrite = true;
		doSaveRequest();
	}
	
	
	
	@Override
	public void onClose(CloseEvent<PopupPanel> event) {
		
	}
	
	
	@Override
	public void onKeyDown(KeyDownEvent event) {
		
		int keyCode = event.getNativeKeyCode();
		if (keyCode == KeyCodes.KEY_ENTER) {
			onSave(null);
		} else if (keyCode == KeyCodes.KEY_ESCAPE) {
			onDismiss(null);
		}
	}

	@Override
	public Widget asWidget() {
		return dialog.asWidget();
	}
	
	private void doSaveRequest(){
		if(name.getValue().isEmpty()){
			StatusNotification.notify("Name can't be empty.", StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
			save.setEnabled(true);
			return;
		}
		
		RestClient.collectRequestData(new Callback<RequestObject, Throwable>() {
			
			@Override
			public void onSuccess(final RequestObject result) {
				result.setName(name.getValue());
				result.setSkipHeaders(headersStatus.getValue());
				result.setSkipHistory(tokenStatus.getValue());
				result.setSkipMethod(methodStatus.getValue());
				result.setSkipParams(parametersStatus.getValue());
				result.setSkipPayload(payloadStatus.getValue());
				result.setSkipProtocol(protocolStatus.getValue());
				result.setSkipServer(serverStatus.getValue());
				result.setSkipPath(pathStatus.getValue());
				if(forceOverwrite && overwriteId > 0){
					result.setId(overwriteId);
				}
				//
				//check project data
				//
				String _projectName = projectList.getValue(projectList.getSelectedIndex());
				if(_projectName.equals("__new__")){
					String newProjectName = projectName.getValue();
					//add new project
					RestClient.saveRequestData(result, newProjectName, new Callback<RequestObject, Throwable>() {
						@Override
						public void onSuccess(RequestObject result) {
							save.setEnabled(true);
							dialog.hide();
						}
						@Override
						public void onFailure(Throwable reason) {
							save.setEnabled(true);
							StatusNotification.notify("Unable to save request data!", StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
						}
					});
					return;
				} else if (!_projectName.equals("")){
					int projectId = -1;
					projectNameContainer.addClassName("hidden");
					try{
						projectId = Integer.parseInt(_projectName);
					} catch(Exception e){}
					
					if(projectId == -1){
						save.setEnabled(true);
						StatusNotification.notify("This is not a valid project!", StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
						if(RestClient.isDebug()){
							Log.error("Unable to save request data. Selected project has no numeric value.");
						}
						return;
					}
					result.setProject(projectId);
				}
				RestClient.saveRequestData(result, new Callback<RequestObject, Throwable>() {
					@Override
					public void onSuccess(RequestObject result) {
						save.setEnabled(true);
						dialog.hide();
					}
					@Override
					public void onFailure(Throwable reason) {
						save.setEnabled(true);
						StatusNotification.notify("Unable to save request data!", StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
					}
				});
			}
			
			@Override
			public void onFailure(Throwable reason) {
				save.setEnabled(true);
				if(RestClient.isDebug()){
					Log.error("Unable to save request data. Can't collect current request data.", reason);
				}
				StatusNotification.notify("Unable to save request data!", StatusNotification.TYPE_ERROR, StatusNotification.TIME_MEDIUM);
			}
		});
	}
}
