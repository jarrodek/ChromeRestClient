package com.google.gwt.chrome.runtime;

import com.google.gwt.chrome.def.BackgroundPageCallback;
import com.google.gwt.chrome.def.NotImplementedException;
import com.google.gwt.chrome.message.ChromeCSmessagePassingImpl;
import com.google.gwt.chrome.runtime.Runtime.ManifestHandler;
import com.google.gwt.chrome.runtime.Runtime.RuntimeHandler;
import com.google.gwt.chrome.runtime.Runtime.RuntimeStringHandler;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONValue;

public class RuntimeCsImpl implements ChromeRuntime {
	
	private final ChromeCSmessagePassingImpl impl = new ChromeCSmessagePassingImpl();

	@Override
	public void getLastError(final RuntimeStringHandler handler) {
		impl.postMessage("runtime.lastError", "{_inline:true,_property:true}", new BackgroundPageCallback() {
			@Override
			public void onSuccess(String message) {
				String result = null;
				if(!(message == null || message.isEmpty())){
					try{
						JSONValue v = JSONParser.parseStrict(message);
						JSONObject o = v.isObject();
						if(o != null && o.containsKey("message")){
							result = o.get("messgae").isString().stringValue();
						}
					} catch(Exception e){}
				}
				handler.onResult(result);
			}
		});
	}

	@Override
	public void getId(final RuntimeStringHandler handler) {
		impl.postMessage("runtime.id", "{_inline:true,_property:true}", new BackgroundPageCallback() {
			@Override
			public void onSuccess(String message) {
				handler.onResult(message);
			}
		});
	}

	@Override
	public void getManifest(final ManifestHandler handler) {
		impl.postMessage("runtime.id", "{_inline:true}", new BackgroundPageCallback() {
			@Override
			public void onSuccess(String message) {
				try{
					JSONValue value = JSONParser.parseStrict(message);
					ManifestDetails manifest = value.isObject().getJavaScriptObject().cast();
					handler.onManifest(manifest);
				} catch(Exception e){
					handler.onManifest(null);
				}
			}
		});
	}

	@Override
	public void getURL(String path, final RuntimeStringHandler handler) {
		path = path.replace("\"", "\\\"");
		impl.postMessage("runtime.getManifest", "{_inline:true,_inlineArguments:true,args:\""+path+"\"}", new BackgroundPageCallback() {
			@Override
			public void onSuccess(String message) {
				handler.onResult(message);
			}
		});
	}

	@Override
	public void addOnInstalledHandler(RuntimeHandler handler) {
		throw new NotImplementedException();
	}

	@Override
	public void addOnSuspendHandler(RuntimeHandler handler) {
		throw new NotImplementedException();
	}

	@Override
	public void addOnSuspendCanceledHandler(RuntimeHandler handler) {
		throw new NotImplementedException();
	}
}
