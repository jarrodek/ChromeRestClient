package com.restclient.client.chrome;

public interface HistorySearchCallback {
	void onResult(JsArray<HistoryItem> found);
}
