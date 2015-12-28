package org.rest.client.ui.desktop;

import com.google.gwt.user.client.ui.Composite;

public abstract class NativeCallbacks extends Composite {
	@Override
	protected void onDetach() {
		super.onDetach();
		nativeDetach(this);
	}
	/**
	 * Detach all function that has been attached to the DOM objects via JSNI.
	 * @param context
	 */
	private final native void nativeDetach(NativeCallbacks context) /*-{
		var listeners = context._detachListeners;
		if (!listeners) {
			return;
		}
		listeners.forEach(function(value) {
			value.element.removeEventListener(value.event, value.fn);
		});
		context._detachListeners = null;
	}-*/;
}
