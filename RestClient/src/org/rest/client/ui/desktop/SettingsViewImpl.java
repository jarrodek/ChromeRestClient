package org.rest.client.ui.desktop;

import org.rest.client.RestClient;
import org.rest.client.place.ImportExportPlace;
import org.rest.client.place.ShortcutPlace;
import org.rest.client.ui.SettingsView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.CheckBox;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class SettingsViewImpl extends Composite implements SettingsView {
	
	private static SettingsViewImplUiBinder uiBinder = GWT
			.create(SettingsViewImplUiBinder.class);

	interface SettingsViewImplUiBinder extends UiBinder<Widget, SettingsViewImpl> {
	}
	
	@UiField CheckBox notifications;
	@UiField CheckBox debug;
	@UiField CheckBox history;
	@UiField CheckBox magicVars;
	@UiField CheckBox codeMirrorHeaders;
	@UiField DivElement historyClear;
	
	
	Presenter listener = null;
	
	public SettingsViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
	}
	
	@Override
	public void setPresenter(Presenter listener) {
		this.listener = listener;
	}

	@Override
	public void setDebugEnabled(boolean debugEnabled) {
		debug.setValue(debugEnabled);
	}

	@Override
	public boolean isDebugEnabled() {
		return debug.getValue();
	}

	@Override
	public void setHistoryEnabled(boolean historyEnabled) {
		if(historyEnabled){
			historyClear.removeClassName("hidden");
		} else {			
			historyClear.addClassName("hidden");
		}
		history.setValue(historyEnabled);
	}

	@Override
	public boolean isHistoryEnabled() {
		return history.getValue();
	}
	
	@Override
	public void setNotificationsEnabled(boolean notificationsEnabled) {
		notifications.setValue(notificationsEnabled);
	}

	@Override
	public boolean isNotificationsEnabled() {
		return notifications.getValue().booleanValue();
	}
	
	@Override
	public void setMagicVarsEnabled(boolean magicVarsEnabled) {
		magicVars.setValue(magicVarsEnabled);
	}

	@Override
	public boolean isMagicVarsEnabled() {
		return magicVars.getValue().booleanValue();
	}
	@Override
	public void setCodeMirrorHeadersEnabled(boolean codeMirrorHeadersEnabled) {
		codeMirrorHeaders.setValue(codeMirrorHeadersEnabled);
	}
	
	@UiHandler("history")
	void onHistoryChange(ValueChangeEvent<Boolean> event){
		boolean value = event.getValue();
		
		if(RestClient.isDebug()){
			Log.debug("History value changed. Current value is: " + value);
		}
		if(value){
			historyClear.removeClassName("hidden");
			history.setValue(true);
		} else {
			historyClear.addClassName("hidden");
			history.setValue(false);
		}
		listener.changeHistoryValue(value);
	}
	
	@UiHandler("debug")
	void onDebugChange(ValueChangeEvent<Boolean> event){
		if(RestClient.isDebug()){
			Log.debug("Debug value changed. Current value is: " + String.valueOf(event.getValue()));
		}
		listener.changeDebugValue(event.getValue());
	}
	
	@UiHandler("notifications")
	void onNotificationsChange(ValueChangeEvent<Boolean> event){
		if(RestClient.isDebug()){
			Log.debug("Notifications value changed. Current value is: " + String.valueOf(event.getValue()));
		}
		listener.changeNotificationsValue(event.getValue());
	}
	@UiHandler("magicVars")
	void onMagicVarsChange(ValueChangeEvent<Boolean> event){
		if(RestClient.isDebug()){
			Log.debug("Magic vars value changed. Current value is: " + String.valueOf(event.getValue()));
		}
		listener.changeMagicVarsValue(event.getValue());
	}
	
	@UiHandler("codeMirrorHeaders")
	void onCodeMirrorHeadersChange(ValueChangeEvent<Boolean> event){
		if(RestClient.isDebug()){
			Log.debug("CodeMirror for headers value changed. Current value is: " + String.valueOf(event.getValue()));
		}
		listener.changeCodeMirrirHeadersValue(event.getValue());
	}
	
	
	@UiHandler("clearHistory")
	void onClearHistory(ClickEvent e){
		listener.clearHistory();
	}
	
	@UiHandler("shortCutsButton")
	void onShortcutsEdit(ClickEvent e){
		listener.goTo(new ShortcutPlace("edit"));
	}
	@UiHandler("importExportWidget")
	void onImportExportEdit(ClickEvent e){
		listener.goTo(new ImportExportPlace("default"));
	}

	

	

	
}
