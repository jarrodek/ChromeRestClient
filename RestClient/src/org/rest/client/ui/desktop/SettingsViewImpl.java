package org.rest.client.ui.desktop;

import org.rest.client.place.ImportExportPlace;
import org.rest.client.ui.SettingsView;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class SettingsViewImpl extends Composite implements SettingsView {
	
	private static SettingsViewImplUiBinder uiBinder = GWT
			.create(SettingsViewImplUiBinder.class);

	interface SettingsViewImplUiBinder extends UiBinder<Widget, SettingsViewImpl> {
	}
	
	@UiField Element appSettings;
	
	Presenter listener = null;
	
	public SettingsViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
		addComponentEventHandlers(this);
	}
	
	@Override
	public void setPresenter(Presenter listener) {
		this.listener = listener;
	}
	
	/**
	 * Called when the user click on "Clear hostroy button"
	 */
	void onClearHistory(){
		listener.clearHistory();
	}
	
	/**
	 * Called when the user click on manage import / export button.
	 */
	void onImportExportEdit(){
		listener.goTo(new ImportExportPlace("default"));
	}
	
	void onSettingsSavedEvent(String key, boolean value){
		listener.notifySettingChange(key, value);
	}
	@Override
	protected void onDetach() {
		super.onDetach();
		nativeDetach(this);
	}
	/**
	 * Detach all function that has been attached to the DOM objects via JSNI.
	 * @param context
	 */
	private final native void nativeDetach(SettingsViewImpl context) /*-{
		var listeners = context._detachListeners;
		if (!listeners) {
			return;
		}
		listeners.forEach(function(value) {
			value.element.removeEventListener(value.event, value.fn);
		});
		context._detachListeners = null;
	}-*/;
	/**
	 * Add file drop element listeners. This events must be removed on detach.
	 * 
	 * @param element
	 * @param context
	 */
	private final native void addComponentEventHandlers(SettingsViewImpl context) /*-{
		var elm = this.@org.rest.client.ui.desktop.SettingsViewImpl::appSettings;
		var settingsSaved = $entry(function(e, detail) {
			if (e.detail && e.detail.key) {
				context.@org.rest.client.ui.desktop.SettingsViewImpl::onSettingsSavedEvent(Ljava/lang/String;Z)(e.detail.key, e.detail.value)
			}
		});
		var settingsAction = $entry(function(e, detail) {
			if (e.detail && e.detail.action) {
				if(e.detail.action === 'manage-import-export') {
					context.@org.rest.client.ui.desktop.SettingsViewImpl::onImportExportEdit()();
				} else if(e.detail.action === 'clear-history') {
					context.@org.rest.client.ui.desktop.SettingsViewImpl::onClearHistory()();
				}
			}
		});
		
		var listeners = context._detachListeners;
		if (!listeners) {
			listeners = new Map();
		}
		listeners.set('settings-saved', {
			element : elm,
			fn : settingsSaved,
			event : 'settings-saved'
		});
		listeners.set('settings-action', {
			element : elm,
			fn : settingsAction,
			event : 'settings-action'
		});
		context._detachListeners = listeners;
		elm.addEventListener('settings-saved', settingsSaved);
		elm.addEventListener('settings-action', settingsAction);
	}-*/;
}
