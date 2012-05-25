package org.rest.client.chrome;

public interface HistorySearchCallback {
	void onResult(JsArray<HistoryItem> found);
}
