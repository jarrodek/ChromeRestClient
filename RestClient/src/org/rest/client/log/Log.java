package org.rest.client.log;

import com.google.gwt.core.client.JavaScriptObject;

public final class Log extends JavaScriptObject {
	protected Log() {
	}
	
	private static boolean trace = false;
	
	public static final native void exportSetTrace() /*-{
		$wnd.RestClient = $wnd.RestClient || {};
		$wnd.RestClient.setTrace = function(value){
			@org.rest.client.log.Log::trace = value;
		};
	}-*/;

	/**
	 * Clears the console.
	 */
	public static native void clear() /*-{
		$wnd.console.clear();
	}-*/;

	/**
	 * Writes the the number of times that count() has been invoked at the same
	 * line and with the same label.
	 * 
	 * @param label
	 */
	public static native void count(String label) /*-{
		$wnd.console.count(label);
	}-*/;

	/**
	 * Prints a JavaScript representation of the specified object. If the object
	 * being logged is an HTML element, then the properties of its DOM
	 * representation are printed.
	 * 
	 * Example:
	 * 
	 * <pre>
	 * <code>
	 * var list = document.querySelector("#myList");
	 * console.dirxml(list);
	 * </code>
	 * </pre>
	 * 
	 * @param obj
	 */
	public static native void dir(Object obj) /*-{
		$wnd.console.dir(obj);
	}-*/;

	/**
	 * Prints an XML representation of the specified object as it would appear
	 * in the Elements panel. For HTML elements, calling this method is
	 * equivalent to calling console.log().
	 * 
	 * @param obj
	 */
	public static native void dirxml(Object obj) /*-{
		$wnd.console.dirxml(obj);
	}-*/;

	/**
	 * Similar to console.log(), console.error() additionally includes a stack
	 * trace from where the method was called and is styled like an error.
	 * 
	 * @param obj
	 */
	public static native void error(Object... obj) /*-{
		$wnd.console.error.apply($wnd.console, obj);
		if(@org.rest.client.log.Log::trace){
			console.log('caller: ', arguments.callee.caller.displayName);
			console.trace();
		}
	}-*/;

	/**
	 * Starts a new logging group with an optional title. All console output
	 * that occurs after calling this method and calling console.groupEnd()
	 * appears in the same visual group.
	 * 
	 * @param obj
	 */
	public static native void group(Object... obj) /*-{
		$wnd.console.group.apply($wnd.console, obj);
	}-*/;

	/**
	 * reates a new logging group that is initially collapsed instead of open,
	 * as with console.group().
	 * 
	 * @param obj
	 */
	public static native void groupCollapsed(Object... obj) /*-{
		$wnd.console.groupCollapsed.apply($wnd.console, obj);
	}-*/;

	/**
	 * Closes the logging group that was most recently created with
	 * console.group() or console.groupCollapsed(). See
	 * [console.group()](#consolegroupobject-object) and
	 * [console.groupCollapsed()](#consolegroupcollapsedobject-object)
	 */
	public static native void groupEnd() /*-{
		$wnd.console.groupEnd();
	}-*/;

	/**
	 * This method is identical in function to console.log(), but additionally
	 * shows an info icon next to the output.
	 * 
	 * @param obj
	 */
	public static native void info(Object... obj) /*-{
		$wnd.console.info.apply($wnd.console, obj);
		if(@org.rest.client.log.Log::trace){
			console.trace();
		}
	}-*/;

	/**
	 * Displays a message in the console. You pass one or more objects to this
	 * method, each of which are evaluated and concatenated into a
	 * space-delimited string.<br>
	 * <br>
	 * The first parameter you pass to log() may contain format specifiers, a
	 * string token composed of the percent sign (%) followed by a letter that
	 * indicates the formatting to be applied:
	 * 
	 * <pre>
	 * Specifier	Output
	 * %s		Formats the value as a string
	 * %i or %d	Formats the value as an integer
	 * %f		Formats the value as a floating point value
	 * %o		Formats the value as an expandable DOM element. As seen in the Elements panel
	 * %O		Formats the value as an expandable JavaScript object
	 * %c		Applies CSS style rules to the output string as specified by the second parameter
	 * </pre>
	 * 
	 * @param obj
	 *            List of objects to pass to the console.
	 */
	public static native void log(Object... obj) /*-{
		$wnd.console.log.apply($wnd.console, obj);
		if(@org.rest.client.log.Log::trace){
			console.log('caller: ', arguments.callee.caller.displayName);
			console.trace();
		}
	}-*/;

	/**
	 * Starts a JavaScript CPU profile. To complete the profile, call
	 * console.profileEnd(). Each profile is added to the Profiles tab.
	 * 
	 * @param label
	 */
	public static native void profile(String label) /*-{
		$wnd.console.profile(label);
	}-*/;

	/**
	 * Stops the current JavaScript CPU profiling session if one is in progress
	 * and prints the report to the Profiles panel.
	 */
	public static native void profileEnd() /*-{
		$wnd.console.profileEnd(label);
	}-*/;

	/**
	 * Starts a new timer with an associated label. When console.timeEnd() is
	 * called with the same label, the timer is stopped and the elapsed time
	 * displayed in the console. Timer values are accurate to the
	 * sub-millisecond.
	 * 
	 * @param label
	 */
	public static native void time(String label) /*-{
		$wnd.console.time(label);
	}-*/;

	/**
	 * Stops the timer with the specified label and prints the elapsed time.
	 * 
	 * @param label
	 */
	public static native void timeEnd(String label) /*-{
		$wnd.console.timeEnd(label);
	}-*/;

	/**
	 * Adds an event to the Timeline during a recording session. This lets you
	 * visually correlate your code-generated time stamp to events that are
	 * automatically added to the Timeline, like layout and point, for example.
	 * 
	 * @see https://developers.google.com/web/tools/chrome-devtools/debug/
	 *      console/track-executions#marking-the-timeline
	 * @param label
	 */
	public static native void timeStamp(String label) /*-{
		$wnd.console.timeStamp(label);
	}-*/;

	/**
	 * Prints a stack trace from the point where the method was called,
	 * including links to the specific lines in the JavaScript source. A counter
	 * indicates the number of times that trace() method was invoked at that
	 * point
	 * 
	 * @param obj
	 */
	public static native void trace(Object obj) /*-{
		$wnd.console.trace(obj);
	}-*/;

	/**
	 * This method is like console.log() but also displays a yellow warning icon
	 * next to the logged message.
	 * 
	 * @param obj
	 */
	public static native void warn(Object... obj) /*-{
		$wnd.console.warn.apply($wnd.console, obj);
		if(@org.rest.client.log.Log::trace){
			console.log('caller: ', arguments.callee.caller.displayName);
			console.trace();
		}
	}-*/;

	public static native void debug(Object... obj) /*-{
		$wnd.console.debug.apply($wnd.console, obj);
		if(@org.rest.client.log.Log::trace){
			console.log('caller: ', arguments.callee.caller.displayName);
			console.trace();
		}
	}-*/;
}
