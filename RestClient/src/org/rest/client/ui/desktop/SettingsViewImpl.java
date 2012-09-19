package org.rest.client.ui.desktop;

import org.rest.client.RestClient;
import org.rest.client.place.ImportExportPlace;
import org.rest.client.place.ShortcutPlace;
import org.rest.client.resources.AppCssResource;
import org.rest.client.resources.AppResources;
import org.rest.client.ui.SettingsView;
import org.rest.client.ui.html5.HTML5InputNumber;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
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
	
	
	@UiField CheckBox debug;
	@UiField CheckBox history;
	@UiField(provided=true) HTML5InputNumber historyCount;
	@UiField DivElement historyAmount;
	@UiField DivElement historyClear;
	
	AppCssResource appStyle = AppResources.INSTANCE.appCss();
	Presenter listener = null;
	
	public SettingsViewImpl(){
		historyCount = new HTML5InputNumber(0, 500, 1);
		initWidget(uiBinder.createAndBindUi(this));
		
		history.addValueChangeHandler(new ValueChangeHandler<Boolean>() {
			@Override
			public void onValueChange(ValueChangeEvent<Boolean> event) {
				boolean value = event.getValue();
				
				if(RestClient.isDebug()){
					Log.debug("History value changed. Current value is: " + value);
				}
				if( value ){
					historyAmount.removeClassName(appStyle.hidden());
					historyClear.removeClassName(appStyle.hidden());
					history.setValue(true);
				} else {
					historyAmount.addClassName(appStyle.hidden());
					historyClear.addClassName(appStyle.hidden());
					history.setValue(false);
				}
				listener.changeHistoryValue(value);
			}
		});
		
		
		debug.addValueChangeHandler(new ValueChangeHandler<Boolean>() {
			@Override
			public void onValueChange(ValueChangeEvent<Boolean> event) {
				if(RestClient.isDebug()){
					Log.debug("Debug value changed. Current value is: " + String.valueOf(event.getValue()));
				}
				listener.changeDebugValue(event.getValue());
			}
		});
		historyCount.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				String _v = event.getValue();
				int value = 0;
				if(_v != null && !_v.isEmpty()){
					value = Integer.parseInt(_v);
				}
				if(RestClient.isDebug()){
					Log.debug("History amount value changed. Current value is: " + _v);
				}
				listener.changeHistoryAmmount(value);
			}
		});
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
			historyAmount.removeClassName(appStyle.hidden());
			historyClear.removeClassName(appStyle.hidden());
		} else {
			historyAmount.addClassName(appStyle.hidden());
			historyClear.addClassName(appStyle.hidden());
		}
		history.setValue(historyEnabled);
	}

	@Override
	public boolean isHistoryEnabled() {
		return history.getValue();
	}

	@Override
	public void setHistoryLimit(int historyLimit) {
		historyCount.setValue(String.valueOf(historyLimit));
		
	}

	@Override
	public int getHistoryLimit() {
		try{
			return Integer.parseInt(historyCount.getValue());
		} catch(Exception e){}
		return 0;
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
