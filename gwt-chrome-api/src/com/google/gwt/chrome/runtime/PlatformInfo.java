package com.google.gwt.chrome.runtime;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * An object containing information about the current platform.
 * @author Pawel Psztyc
 *
 */
public class PlatformInfo extends JavaScriptObject {
	protected PlatformInfo(){};
	/**
	 * The operating system chrome is running on.
	 * @return one of "mac", "win", "android", "cros", "linux", or "openbsd"
	 */
	public final native String getPlatformOs() /*-{ return this.os; }-*/;
	/**
	 * The machine's processor architecture.
	 * @return One of "arm", "x86-32", or "x86-64"
	 */
	public final native String getPlatformArch() /*-{ return this.arch; }-*/;
	/**
	 * The native client architecture. This may be different from arch on some platforms.
	 * @return One of "arm", "x86-32", or "x86-64"
	 */
	public final native String getPlatformNaclArch() /*-{ return this.nacl_arch; }-*/;
}
