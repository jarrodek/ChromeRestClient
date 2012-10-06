package com.google.gwt.chrome.runtime;

import com.google.gwt.core.client.GWT;

public class Runtime implements ChromeRuntime {
	
	public interface RuntimeHandler {
		void onActionPerformed();
	}
	
	public interface RuntimeStringHandler {
		void onResult(String result);
	}
	
	public interface ManifestHandler {
		void onManifest(ManifestDetails manifest);
	}
	
	private final ChromeRuntime impl;
	public Runtime(){
		if(isApiAvailable()){
			impl = GWT.create(RuntimeImpl.class);
		} else {
			impl = GWT.create(RuntimeCsImpl.class);
		}
	}
	
	private final native boolean isApiAvailable() /*-{
		return !!(chrome.runtime);
	}-*/;

	@Override
	public void getLastError(RuntimeStringHandler handler) {
		impl.getLastError(handler);
	}

	@Override
	public void getId(RuntimeStringHandler handler) {
		impl.getId(handler);
	}

	@Override
	public void getManifest(ManifestHandler handler) {
		impl.getManifest(handler);
	}

	@Override
	public void getURL(String path, RuntimeStringHandler handler) {
		impl.getURL(path, handler);
	}

	@Override
	public void addOnInstalledHandler(RuntimeHandler handler) {
		impl.addOnInstalledHandler(handler);
	}

	@Override
	public void addOnSuspendHandler(RuntimeHandler handler) {
		impl.addOnSuspendHandler(handler);
	}

	@Override
	public void addOnSuspendCanceledHandler(RuntimeHandler handler) {
		impl.addOnSuspendCanceledHandler(handler);
	}
}
