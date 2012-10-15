package org.rest.client.dom.worker;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * FEATURES AVAILABLE TO WORKERS
 * Due to their multi-threaded behavior, web workers only has access to a subset of JavaScript's features:
 * <ul>
 * <li>The navigator object</li>
 * <li>The location object (read-only)</li>
 * <li>XMLHttpRequest</li>
 * <li>setTimeout()/clearTimeout() and setInterval()/clearInterval()</li>
 * <li>The Application Cache</li>
 * <li>Importing external scripts using the importScripts() method</li>
 * <li>Spawning other web workers</li>
 * </ul>
 * Workers do NOT have access to:
 * <ul>
 * <li>The DOM (it's not thread-safe)</li>
 * <li>The window object</li>
 * <li>The document object</li>
 * <li>The parent object</li>
 * </ul>
 * @author jarrod
 *
 */
public class Worker {
	
	WorkerImpl worker = null;
	public Worker(String script){
		worker = WorkerImpl.get(script);
	}
	
	public void postMessage(String message){
		worker.postMessage(message);
	}
	
	public void postMessage(JavaScriptObject message){
		worker.postMessage(message);
	}
	
	public void onMessage(WorkerMessageHandler handler){
		worker.onMessage(handler);
	}
}
