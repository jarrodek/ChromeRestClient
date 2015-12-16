package com.google.gwt.chrome.tabs;

import com.google.gwt.core.client.JsArray;

public interface TabsCallback {
	void onResult(JsArray<Tab> tab);
}
