package com.google.gwt.chrome.runtime;

import com.google.gwt.chrome.def.BackgroundJsCallback;
import com.google.gwt.chrome.def.NotImplementedException;
import com.google.gwt.chrome.message.ChromeCSmessagePassingImpl;

public class RuntimeCsImpl implements ChromeRuntime {
	
	private final ChromeCSmessagePassingImpl impl = new ChromeCSmessagePassingImpl();
	
	protected RuntimeCsImpl(){}

	@Override
	public void getId(final RuntimeStringHandler handler) {
		impl.postMessage("runtime.id", new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {
				handler.onResult((String) message);
			}
			
			@Override
			public void onError(String message) {
				handler.onError(message);
			}
		});
	}

	@Override
	public void getManifest(final ManifestHandler handler) {
		impl.postMessage("runtime.getManifest", new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {
				handler.onManifest((ManifestDetails) message);
			}
			
			@Override
			public void onError(String message) {
				handler.onError(message);
			}
		});
	}

	@Override
	public void getURL(String path, final RuntimeStringHandler handler) {
		path = path.replace("\"", "\\\"");
		impl.postMessage("runtime.getURL", path, new BackgroundJsCallback() {
			
			@Override
			public void onSuccess(Object message) {
				handler.onResult((String) message);
			}
			
			@Override
			public void onError(String message) {
				handler.onError(message);
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

	@Override
	public void openOptionsPage(final RuntimeHandler handler) {
		impl.postMessage("runtime.openOptionsPage", new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {
				handler.onActionPerformed();
			}
			@Override
			public void onError(String message) {
				handler.onError(message);
			}
		});
	}

	@Override
	public void setUninstallURL(String url, final RuntimeHandler handler) {
		impl.postMessage("runtime.setUninstallURL", url, new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {
				handler.onActionPerformed();
			}
			@Override
			public void onError(String message) {
				handler.onError(message);
			}
		});
	}

	@Override
	public void reload() {
		impl.postMessage("runtime.reload", new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {}
			@Override
			public void onError(String message) {}
		});
	}

	@Override
	public void requestUpdateCheck(final RuntimeUpdateCheckHandler handler) {
		impl.postMessage("runtime.requestUpdateCheck", new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {
				handler.onResult((String) message, null);
			}
			@Override
			public void onError(String message) {
				handler.onError(message);
			}
		});
	}

	@Override
	public void getPlatformInfo(final PlatformInfoHandler handler) {
		impl.postMessage("runtime.getPlatformInfo", new BackgroundJsCallback() {
			@Override
			public void onSuccess(Object message) {
				handler.onInfo((PlatformInfo) message);
			}
			@Override
			public void onError(String message) {}
		});
	}
}
