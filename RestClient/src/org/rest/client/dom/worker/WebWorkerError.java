package org.rest.client.dom.worker;

import com.google.gwt.core.client.JavaScriptObject;

public class WebWorkerError extends JavaScriptObject {
	protected WebWorkerError(){}
	
	public final native int getLine() /*-{ return this.lineno; }-*/;
	public final native String getMessage() /*-{ return this.message; }-*/;
	public final native String getFilename() /*-{ return this.filename; }-*/;
	
}
