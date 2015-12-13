package com.google.gwt.chrome.runtime;

import com.google.gwt.core.client.GWT;

public class Runtime implements ChromeRuntime {
	
	
	
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

	@Override
	public void openOptionsPage(RuntimeHandler handler) {
		impl.openOptionsPage(handler);
	}

	@Override
	public void setUninstallURL(String url, RuntimeHandler handler) {
		impl.setUninstallURL(url, handler);
	}

	@Override
	public void reload() {
		impl.reload();
	}

	@Override
	public void requestUpdateCheck(RuntimeUpdateCheckHandler handler) {
		impl.requestUpdateCheck(handler);
	}

	/*@Override
	public void sendMessage(String extensionId, Object message, JavaScriptObject options,
			RuntimeJsonObjectHandler handler) {
		impl.sendMessage(extensionId, message, options, handler);
		
	}*/

	@Override
	public void getPlatformInfo(PlatformInfoHandler handler) {
		impl.getPlatformInfo(handler);
	}
}
