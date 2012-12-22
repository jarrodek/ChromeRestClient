package com.google.gwt.chrome.def;

import com.google.gwt.core.client.JavaScriptObject;

public interface BackgroundJsCallback {
	void onSuccess(JavaScriptObject message);
	void onError(String message);
}
