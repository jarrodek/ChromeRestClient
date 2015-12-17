package com.google.gwt.chrome.runtime;

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;

public class Runtime implements ChromeRuntime {

	protected Runtime() {
	}

	@Override
	public final native void getId(final RuntimeStringHandler handler) throws JavaScriptException /*-{
		handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeStringHandler::onResult(Ljava/lang/String;)($wnd.chrome.runtime.id);
	}-*/;

	@Override
	public final native void getManifest(ManifestHandler handler) throws JavaScriptException /*-{
		handler.@com.google.gwt.chrome.runtime.ChromeRuntime.ManifestHandler::onManifest(Lcom/google/gwt/chrome/runtime/ManifestDetails;)($wnd.chrome.runtime.getManifest());
	}-*/;

	@Override
	public final native void getURL(String path, RuntimeStringHandler handler) throws JavaScriptException /*-{
		throw new Error("Not yet implemented.");
	}-*/;

	@Override
	public final native void addOnInstalledHandler(RuntimeHandler handler) throws JavaScriptException /*-{
		var clb = $entry(function() {
			handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeHandler::onActionPerformed()();
		});
		$wnd.chrome.runtime.onInstalled.addListener(clb);
	}-*/;

	@Override
	public final native void addOnSuspendHandler(RuntimeHandler handler) throws JavaScriptException /*-{
		var clb = $entry(function() {
			handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeHandler::onActionPerformed()();
		});
		$wnd.chrome.runtime.onSuspend.addListener(clb);
	}-*/;

	@Override
	public final native void addOnSuspendCanceledHandler(RuntimeHandler handler) throws JavaScriptException /*-{
		var clb = $entry(function() {
			handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeHandler::onActionPerformed()();
		});
		$wnd.chrome.runtime.onSuspendCanceled.addListener(clb);
	}-*/;

	@Override
	public final native void openOptionsPage(RuntimeHandler handler) /*-{
		var callback = $entry(function() {
			if ($wnd.chrome.runtime.lastError) {
				handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeHandler::onError(Ljava/lang/String;)($wnd.chrome.runtime.lastError);
			} else {
				handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeHandler::onActionPerformed()();
			}
		});
		$wnd.chrome.runtime.openOptionsPage(callback);
	}-*/;

	@Override
	public final native void setUninstallURL(String url, RuntimeHandler handler) /*-{
		var callback = $entry(function() {
			if ($wnd.chrome.runtime.lastError) {
				handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeHandler::onError(Ljava/lang/String;)($wnd.chrome.runtime.lastError);
			} else {
				handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeHandler::onActionPerformed()();
			}
		});
		$wnd.chrome.runtime.setUninstallURL(callback);
	}-*/;

	@Override
	public final native void reload() /*-{
		$wnd.chrome.runtime.reload();
	}-*/;

	@Override
	public final native void requestUpdateCheck(RuntimeUpdateCheckHandler handler) /*-{
		var callback = $entry(function(status, details) {
			var version = null;
			if (details && details.version) {
				version = details.version;
			}
			handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeUpdateCheckHandler::onResult(Ljava/lang/String;Ljava/lang/String;)(status, version);
		});
		$wnd.chrome.runtime.requestUpdateCheck(callback);
	}-*/;

	@Override
	public final native void getPlatformInfo(PlatformInfoHandler handler) /*-{
		var callback = $entry(function(response) {
			handler.@com.google.gwt.chrome.runtime.ChromeRuntime.PlatformInfoHandler::onInfo(Lcom/google/gwt/chrome/runtime/PlatformInfo;)(response);
		});
		$wnd.chrome.runtime.getPlatformInfo(callback);
	}-*/;

	@Override
	public final native void sendMessage(String extensionId, Object message, JavaScriptObject options,
			RuntimeJsonObjectHandler handler) /*-{
		var callback = $entry(function(response) {
			if ($wnd.chrome.runtime.lastError) {
				handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeJsonObjectHandler::onError(Ljava/lang/String;)($wnd.chrome.runtime.lastError);
			} else {
				if (!response) {
					response = {};
				}
				handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeJsonObjectHandler::onResult(Lcom/google/gwt/json/client/JSONObject;)(response);
			}
		});
		if (!extensionId) {
			$wnd.chrome.runtime.sendMessage(message, options, callback);
		} else {
			$wnd.chrome.runtime.sendMessage(extensionId, message, options,
					callback);
		}
	}-*/;

	@Override
	public final native void restart() /*-{
		$wnd.chrome.runtime.restart();
	}-*/;

	@Override
	public final native void sendNativeMessage(String application, Object message, RuntimeObjectHandler handler) /*-{
		var callback = $entry(function(response) {
			if ($wnd.chrome.runtime.lastError) {
				handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeJsonObjectHandler::onError(Ljava/lang/String;)($wnd.chrome.runtime.lastError);
			} else {
				handler.@com.google.gwt.chrome.runtime.ChromeRuntime.RuntimeObjectHandler::onResult(Ljava/lang/Object;)(response);
			}
		});
		$wnd.chrome.runtime.sendMessage(application, message, callback);
	}-*/;
}
