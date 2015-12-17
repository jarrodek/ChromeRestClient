package com.google.gwt.chrome.history;

import com.google.gwt.core.client.JsArray;


public interface HistorySearchCallback {
	void onResult(JsArray<HistoryItem> found);
}
