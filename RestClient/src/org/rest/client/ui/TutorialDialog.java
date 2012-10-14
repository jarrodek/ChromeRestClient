package org.rest.client.ui;

import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.HasHTML;
import com.google.gwt.user.client.ui.HasWidgets;
import com.google.gwt.user.client.ui.IsWidget;

public interface TutorialDialog extends HasWidgets, HasHTML, IsWidget {
	
	public class Direction {
		public final static int LEFT = 0;
		public final static int TOP = 1;
		public final static int BOTTOM = 2;
		public final static int RIGHT = 3;
	}
	
	public class Controls {
		public final static int NEXT_ONLY = 0;
		public final static int PREV_ONLY = 1;
		public final static int PREV_NEXT = 2;
		public final static int PREV_CLOSE = 3;
	}
	
	public class UserAction {
		public final static int NEXT = 0;
		public final static int PREV = 1;
		public final static int CLOSE = 2;
	}
	
	public interface CloseTutorialHandler {
		void onClose(int lastUserAction);
	}
	
	public interface BeforeTutorialShowHandler {
		void beforeShow();
	}
	
	/**
	 * Set referenced element that tutorial item will appear next to.
	 * @param element referenced element
	 * @param direction in what side of element it should be displayed. See {@link Direction} for constants.
	 */
	void setReferencedElement(Element element, int direction);
	/**
	 * Set panel absolute position
	 * @param left
	 * @param top
	 */
	void setAbsolutePosition(int left, int top);
	/**
	 * Show the popup.
	 */
	void show();
	/**
	 * Enable arrow
	 * @param direction See {@link Direction} for constants.
	 */
	void showArrow(int direction);
	/**
	 * Show tutorial dialog controls. See {@link Controls} for constants.
	 * @param controlsType
	 */
	void showControls(int controlsType);
	/**
	 * User action living a tutorial. See {@link UserAction} for constants.
	 * @param userAction
	 * @return
	 */
	int getLastUserAction(int userAction);
	
	void setCloseHandler(CloseTutorialHandler handler);
	
	void setBeforeTutorialShowHandler(BeforeTutorialShowHandler handler);
}
