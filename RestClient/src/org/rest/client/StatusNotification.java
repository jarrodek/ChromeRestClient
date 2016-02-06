package org.rest.client;

/**
 * Notifications system. Create and display User notification as response to
 * some action.
 * <p>
 * Example:
 * 
 * <pre>
 *  StatusNotifications.notify('An error occurred. Please, try again later',
 *      StatusNotification.TYPE_ERROR, 10000, true
 *  );
 * </pre>
 * 
 * Example above displays error message for 10 seconds. If any other message is
 * already displayed it will be overwritten.<br/>
 * Normally when creating new message it's display 2 elements in one time. Every
 * next messages wait in list until message timeout. Exception for this
 * rule is when previous message has no timeout set. This message will be
 * removed as soon as new message arrive.
 * </p>
 * 
 * TODO: this class should be moved to more like activity classes area.
 */
public class StatusNotification {
	/**
	 * Notification display time: 3sec.
	 */
	public static final int TIME_SHORT = 3000;
	/**
	 * Notification display time: 5sec.
	 */
	public static final int TIME_MEDIUM = 7000;
	/**
	 * Notification display time: 8sec.
	 */
	static final int TIME_LONG = 12000;
	

	public interface NotificationCallback {
		void onActionPerformed(); // NO_UCD (unused code)
	}
	
	/**
	 * Notify user.
	 * 
	 * @param message
	 *            Message to display
	 * @param type
	 *            {@link #TYPE_NORMAL} (default), {@link #TYPE_ERROR}, 
	 *            {@link #TYPE_CRITICAL} or {@link #TYPE_HTML}.
	 */
	public static void notify(String message) {
		notify(message, 0);
	}

	/**
	 * Notify user.
	 * 
	 * @param message
	 *            Message to display
	 * @param type
	 *            {@link #TYPE_NORMAL} (default), {@link #TYPE_ERROR},
	 *            {@link #TYPE_CRITICAL} or {@link #TYPE_HTML}.
	 * @param timeout
	 *            number of milliseconds after message will gone. Presets:
	 *            {@link #TIME_SHORT}, {@link #TIME_MEDIUM},
	 *            {@link #TIME_MEDIUM}, {@link #TIME_LONG},
	 *            {@link #TIME_INFINITY}
	 */
	public static void notify(String message, int timeout) {
		notify(message, timeout, null);
	}
	/**
	 * Special type of notification when the user see a message and have more than one option to click.
	 * Status bar will always include "dismiss" message. 
	 * @param message
	 * @param type
	 * @param callback
	 */
	public static void notify(String message, int timeout, NotificationAction callback) {
		appendToast(message, timeout, callback);
	}
	/**
	 * Create a `paper-toast` element if such element don't exists yet and activate it.
	 * If callbacks are available it should handle click action on the toast.
	 * After click action is performed the toast should be removed from the DOM.
	 * @param message Message to display.
	 * @param timeout Timeout in milliseconds. Set 0 to not use timeout.  
	 * @param callback Callback function to be set on tap.
	 */
	private final native static void appendToast(String message, int timeout, NotificationAction callback) /*-{
		var toast = $doc.querySelector('paper-toast[text="'+message+'"]');
		var isCallback = (!!callback);
		if(!toast){
			var toast = $doc.createElement('paper-toast');
			toast.text = message;
			toast.duration = timeout;
			var label = $doc.createElement('paper-button');
			label.innerText = isCallback ? callback.@org.rest.client.NotificationAction::name : 'Close';
			//label.className = 'paper-toast-action-label';
			//label.tabindex = 0;
			var fn = function(e){
				label.removeEventListener('click', fn);
				toast.close();
				if(isCallback) {
					var origCallback = callback.@org.rest.client.NotificationAction::callback;
					origCallback.@org.rest.client.StatusNotification.NotificationCallback::onActionPerformed()();
				}
			};
			label.addEventListener('tap', fn);
			toast.appendChild(label);
			$doc.body.appendChild(toast);
		} else {
			//replace action
			var label = Polymer.dom(toast.root).querySelector('paper-button');
			var fn = function(e){
				label.removeEventListener('click', fn);
				toast.close();
				if(isCallback) {
					var origCallback = callback.@org.rest.client.NotificationAction::callback;
					origCallback.@org.rest.client.StatusNotification.NotificationCallback::onActionPerformed()();
				}
			};
			label.addEventListener('tap', fn);
		}
		toast.show();
	}-*/;
}