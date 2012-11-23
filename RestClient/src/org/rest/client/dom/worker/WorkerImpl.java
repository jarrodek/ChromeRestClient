package org.rest.client.dom.worker;

import com.google.gwt.core.client.JavaScriptObject;

class WorkerImpl extends JavaScriptObject {
	
	protected WorkerImpl() {}
	
	static final native WorkerImpl get(String script) /*-{
		var worker = new Worker(script); 
		return worker;
	}-*/;
	
	
	/**
	 * Starts the worker.
	 * @param message Message sent to worker.
	 */
	final native void postMessage(String message) /*-{
		this.postMessage(message);
	}-*/;
	
	final native void postMessage(JavaScriptObject message) /*-{
		this.postMessage(message);
	}-*/;
	
	
	final native void onMessage(WorkerMessageHandler handler) /*-{
		this.addEventListener('message', $entry(function(e) {
		  $wnd._lastWorker = e.data;
		  handler.@org.rest.client.dom.worker.WorkerMessageHandler::onMessage(Ljava/lang/String;)(e.data);
		}), false);
		
		this.addEventListener('error', $entry(function(e){
			$wnd._lastWorkerError = ['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join('');
			handler.@org.rest.client.dom.worker.WorkerMessageHandler::onError(Lorg/rest/client/dom/worker/WebWorkerError;)(e);
		}), false);
	}-*/;
}
