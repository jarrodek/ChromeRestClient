package org.rest.client.headerssupport;

import com.google.gwt.core.client.Callback;

public class ContentTypeDialog implements HeaderSupport {
	
	private String value;
	private Callback<String, String> callback;
	
	@Override
	public void setValue(String value) {
		this.value = value;
	}

	@Override
	public void openDialog() {
		addDialog();
	}

	@Override
	public void setOnResultHandler(Callback<String, String> callback) {
		this.callback = callback;
	}
	
	private void callCallback(String result) {
		if(callback != null){
			callback.onSuccess(result);
		}
	}
	
	private final native void addDialog() /*-{
		var dialog = $doc.querySelector('app-contenttype-headers-support');
		if(!dialog){
			dialog = $doc.createElement('app-contenttype-headers-support');
			$doc.body.appendChild(dialog);
			var context = this;
			var fn = $entry(function(e){
				var value = e.detail.value;
				context.@org.rest.client.headerssupport.ContentTypeDialog::callCallback(Ljava/lang/String;)(value);
			});
			dialog.addEventListener('value-selected', fn);
		}
		var value = this.@org.rest.client.headerssupport.ContentTypeDialog::value;
		dialog.value = value;
		dialog.open();
	}-*/;
	
	private final native void nativeSetValue() /*-{
		var dialog = $doc.querySelector('app-contenttype-headers-support');
		if(!dialog){
			return;
		}
		dialog.value = value;
	}-*/;
}
