package org.rest.client.ui.desktop;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
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
	 * Normal notification bar with HTML value. Value: html
	 */
	public static final String TYPE_HTML = "html";
	
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

	class WidgetStyle {
		/**
		 * @return class name for error
		 */
		String error = "Status_Notification_error";
		/**
		 * @return class name for critical error
		 */
		String critical = "Status_Notification_critical";
		/**
		 * @return class name for regular message
		 */
		String common = "Status_Notification_common";
		/**
		 * @return class name for hidden container
		 */
		String hidden = "Status_Notification_hidden";
		/**
		 * @return class name for regular message with HTML content
		 */
		String html = "Status_Notification_html";
		/**
		 * @return class name for text transition to fade out 
		 */
		String textHidden = "Status_Notification_textHidden";
		
		String dismissAnchor = "Status_Notification_dismissAnchor";
		String actionMessage = "Status_Notification_actionMessage";
	}
	
	public interface NotificationCallback {
		void onActionPerformed();
	}
	
	/**
	 * Single notification.
	 * 
	 * @author Paweł Psztyć
	 */
	private static class NotificationObject {
		public final String message;
		public String type;
		public int timeout;
		public NotificationAction[] callbacks;

		public NotificationObject(String message) {
			this.message = message;
		}
	}

	private static List<NotificationObject> messages = new ArrayList<NotificationObject>();
	private static NotificationObject current = null;
	private static boolean showing = false;
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
	@UiField HTMLPanel actions;
	@UiField InlineLabel message;
	WidgetStyle style = new WidgetStyle();

	private StatusNotification() {
		RootPanel.get().add(
				GWT.<Binder> create(Binder.class).createAndBindUi(this));
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
	 *            {@link #TYPE_NORMAL} (default), {@link #TYPE_ERROR}, 
	 *            {@link #TYPE_CRITICAL} or {@link #TYPE_HTML}.
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
	 *            {@link #TYPE_NORMAL} (default), {@link #TYPE_ERROR},
	 *            {@link #TYPE_CRITICAL} or {@link #TYPE_HTML}.
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
	 *            {@link #TYPE_NORMAL} (default), {@link #TYPE_ERROR},
	 *            {@link #TYPE_CRITICAL} or {@link #TYPE_HTML}.
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
		no.timeout = timeout;
		no.type = type;

		if (overwrite) {
			messages.clear();
		}

		messages.add(no);
		if (!overwrite && current != null) {
			return;
		}
		if (current != null){
			dismissMessage();
		} else {
			INSTANCE.next();
		}
	}
	/**
	 * Special type of notification when the user see a message and have more than one option to click.
	 * Status bar will always include "dismiss" message. 
	 * @param message
	 * @param type
	 * @param callback
	 */
	public static void notify(String message, String type, int timeout, boolean overwrite, NotificationAction... callback) {
		NotificationObject no = new NotificationObject(message);
		no.timeout = timeout;
		no.type = type;
		no.callbacks = callback;
		if (overwrite) {
			messages.clear();
		}
		messages.add(no);
		if (!overwrite && current != null) {
			return;
		}
		if (current != null){
			dismissMessage();
		} else {
			INSTANCE.next();
		}
	}
	
	
	/**
	 * Remove current message and cleanup.
	 */
	private static void dismissMessage() {
		messageTimer.cancel();
		current = null;
		showing = false;
		if(messages.size() > 0){
			INSTANCE.message.addStyleName(INSTANCE.style.textHidden);
			new Timer() {
				@Override
				public void run() {
					INSTANCE.next();
				}
			}.schedule(300);
		} else {
			INSTANCE.cleanupContainer();
		}
	}
	/**
	 * Display next notification.
	 */
	private void next(){
		if(messages.size() == 0){
			cleanupContainer();
			showing = false;
			current = null;
			return;
		}
		current = messages.remove(0);
		
		
		if(current == null) return;
		boolean isHTML = false;
		
		if(current.type.equals(TYPE_CRITICAL)){
			mainPanel.addStyleName(style.critical);
		} else if(current.type.equals(TYPE_ERROR)){
			mainPanel.addStyleName(style.error);
		} else if(current.type.equals(TYPE_HTML)){
			mainPanel.addStyleName(style.html);
			isHTML = true;
		} else {
			mainPanel.addStyleName(style.common);
		}
		
		if(isHTML){
			message.getElement().setInnerHTML(current.message);
		} else {
			message.setText(current.message);
		}
		
		//remove any additional actions from previous notifications.
		while(actions.getWidgetCount()>1){
			actions.getWidget(1).removeFromParent();
		}
		
		if(current.callbacks != null && current.callbacks.length > 0){
			for(int i=0; i<current.callbacks.length; i++){
				final NotificationAction callbackAction = current.callbacks[i];
				if(callbackAction.callback == null){
					continue;
				}
				if(callbackAction.name == null) callbackAction.name = "[undefined]";
				Anchor action = new Anchor(callbackAction.name);
				action.setHref("about:blank");
				action.addClickHandler(new ClickHandler() {
					@Override
					public void onClick(ClickEvent event) {
						event.preventDefault();
						callbackAction.callback.onActionPerformed();
						dismissMessage();
					}
				});
				action.setStyleName(style.dismissAnchor+" " +style.actionMessage);
				actions.add(action);
			}
		}
		
		if(showing){
			message.removeStyleName(style.textHidden);
		} else {
			mainPanel.removeStyleName(style.hidden);
			showing = true;
		}
		if(current.timeout > 0){
			messageTimer.schedule(current.timeout);
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
		INSTANCE.cleanupContainer();
	}
	/**
	 * Clear and hide notification bar
	 */
	private void cleanupContainer(){
		message.setText("");
		message.removeStyleName(style.textHidden);
		mainPanel.addStyleName(style.hidden);
		mainPanel.removeStyleName(style.critical);
		mainPanel.removeStyleName(style.common);
		mainPanel.removeStyleName(style.html);
		mainPanel.removeStyleName(style.error);
	}
	@UiHandler("flashDismiss")
	void onDissmiss(ClickEvent e){
		e.preventDefault();
		dismissMessage();
	}
}