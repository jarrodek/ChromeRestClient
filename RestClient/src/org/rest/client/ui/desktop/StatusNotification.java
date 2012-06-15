package org.rest.client.ui.desktop;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;

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
 */
public class StatusNotification extends Composite {
	interface Binder extends UiBinder<Widget, StatusNotification> {
	}

	/**
	 * Normal notification bar. Value: common
	 */
	public static final String TYPE_NORMAL = "common";
	/**
	 * Error notification bar. Value: error
	 */
	public static final String TYPE_ERROR = "error";
	/**
	 * Critical error notification bar. Value: critical
	 */
	public static final String TYPE_CRITICAL = "critical";
	/**
	 * Notification display time: 1sec.
	 */
	public static final int TIME_ULTRA_SHORT = 1000;
	/**
	 * Notification display time: 2sec.
	 */
	public static final int TIME_SHORT = 2000;
	/**
	 * Notification display time: 5sec.
	 */
	public static final int TIME_MEDIUM = 5000;
	/**
	 * Notification display time: 8sec.
	 */
	public static final int TIME_LONG = 8000;
	/**
	 * Notification display time: Infinity (value 0)
	 */
	public static final int TIME_INFINITY = 0;

	interface WidgetStyle extends CssResource {
		/**
		 * @return class name for error
		 */
		String error();
		/**
		 * @return class name for critical error
		 */
		String critical();
		/**
		 * @return class name for regular message
		 */
		String common();
		/**
		 * @return class name for hidden container
		 */
		String hidden();
	}

	/**
	 * Single notification.
	 * 
	 * @author Paweł Psztyć
	 */
	private static class NotificationObject {
		private final String message;
		private String type;
		private int timeout;

		public NotificationObject(String message) {
			this.message = message;
		}

		/**
		 * @return the type
		 */
		public final String getType() {
			return type;
		}

		/**
		 * @param type
		 *            the type to set
		 */
		public final void setType(String type) {
			this.type = type;
		}

		/**
		 * @return the timeout
		 */
		public final int getTimeout() {
			return timeout;
		}

		/**
		 * @param timeout
		 *            the timeout to set
		 */
		public final void setTimeout(int timeout) {
			this.timeout = timeout;
		}
		
		/**
		 * @return the message
		 */
		public final String getMessage() {
			return message;
		}

	}

	private static List<NotificationObject> messages = new ArrayList<NotificationObject>();
	private static NotificationObject current = null;
	private static StatusNotification INSTANCE = GWT
			.create(StatusNotification.class);
	private static Timer messageTimer = new Timer() {
		@Override
		public void run() {
			if(current != null){
				dismissMessage();
			}
		}
	};

	@UiField HTMLPanel mainPanel;
	@UiField Anchor flashDismiss;
	@UiField InlineLabel message;
	@UiField WidgetStyle style;

	private StatusNotification() {
		RootPanel.get().add(
				GWT.<Binder> create(Binder.class).createAndBindUi(this));
		flashDismiss.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				dismissMessage();
			}
		});
	}	

	/**
	 * Notify user.
	 * 
	 * @param message
	 *            Message to display
	 */
	public static void notify(String message) {
		notify(message, TYPE_NORMAL, 0, false);
	}

	/**
	 * Notify user.
	 * 
	 * @param message
	 *            Message to display
	 * @param type
	 *            {@link #TYPE_NORMAL} (default), {@link #TYPE_ERROR} or
	 *            {@link #TYPE_CRITICAL}.
	 */
	public static void notify(String message, String type) {
		notify(message, type, 0, false);
	}

	/**
	 * Notify user.
	 * 
	 * @param message
	 *            Message to display
	 * @param type
	 *            {@link #TYPE_NORMAL} (default), {@link #TYPE_ERROR} or
	 *            {@link #TYPE_CRITICAL}.
	 * @param timeout
	 *            number of milliseconds after message will gone. Presets:
	 *            {@link #TIME_SHORT}, {@link #TIME_MEDIUM},
	 *            {@link #TIME_MEDIUM}, {@link #TIME_LONG},
	 *            {@link #TIME_INFINITY}
	 */
	public static void notify(String message, String type, int timeout) {
		notify(message, type, timeout, false);
	}

	/**
	 * Notify user.
	 * 
	 * @param message
	 *            Message to display
	 * @param type
	 *            {@link #TYPE_NORMAL} (default), {@link #TYPE_ERROR} or
	 *            {@link #TYPE_CRITICAL}.
	 * @param timeout
	 *            number of milliseconds after message will gone. Presets:
	 *            {@link #TIME_SHORT}, {@link #TIME_MEDIUM},
	 *            {@link #TIME_MEDIUM}, {@link #TIME_LONG},
	 *            {@link #TIME_INFINITY}. If message has timeout set to zero it
	 *            will not disappear until user click dismiss button or other
	 *            notification income.
	 * @param overwrite
	 *            If true message will purge messages list and display message
	 *            immediately
	 */
	public static void notify(String message, String type, int timeout,
			boolean overwrite) {
		NotificationObject no = new NotificationObject(message);
		no.setTimeout(timeout);
		no.setType(type);

		if (overwrite) {
			messages.clear();
		}

		messages.add(no);
		if (!overwrite && (current != null && current.getTimeout() > 0)) {
			return;
		}
		if (current != null){
			dismissMessage();
		} else {
			next();
		}
	}
	/**
	 * Remove current message and cleanup.
	 */
	private static void dismissMessage() {
		messageTimer.cancel();
		current = null;
		cleanupContainer();
		next();
	}
	/**
	 * Display next notification.
	 */
	private static void next(){
		if(messages.size() == 0){
			return;
		}
		current = messages.remove(0);
		if(current == null) return;
		INSTANCE.message.setText(current.getMessage());
		
		if(current.getType().equals(TYPE_CRITICAL)){
			INSTANCE.mainPanel.addStyleName(INSTANCE.style.critical());
		} else if(current.getType().equals(TYPE_ERROR)){
			INSTANCE.mainPanel.addStyleName(INSTANCE.style.error());
		} else {
			INSTANCE.mainPanel.addStyleName(INSTANCE.style.common());
		}
		INSTANCE.mainPanel.removeStyleName(INSTANCE.style.hidden());
		
		if(current.getTimeout() > 0){
			messageTimer.schedule(current.getTimeout());
		}
	}
	
	/**
	 * Clear all current data, clean notification.
     * <ul style="list-style-type:decimal">
     *  <li>Purge messages list</li>
     *  <li>Clear current timeout</li>
     *  <li>Set current to null</li>
     *  <li>Clear and hide notification bar</li>
     * </ul>
	 */
	public static void clear() {
		messages = new ArrayList<StatusNotification.NotificationObject>();
		messageTimer.cancel();
		current = null;
		cleanupContainer();
	}
	/**
	 * Clear and hide notification bar
	 */
	private static void cleanupContainer(){
		INSTANCE.message.setText("");
		INSTANCE.mainPanel.addStyleName(INSTANCE.style.hidden());
		INSTANCE.mainPanel.removeStyleName(INSTANCE.style.critical());
		INSTANCE.mainPanel.removeStyleName(INSTANCE.style.common());
		INSTANCE.mainPanel.removeStyleName(INSTANCE.style.error());
	}
}