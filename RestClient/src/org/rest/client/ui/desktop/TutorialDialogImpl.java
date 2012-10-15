package org.rest.client.ui.desktop;

import java.util.Iterator;

import org.rest.client.resources.AppCssResource;
import org.rest.client.resources.AppResources;
import org.rest.client.ui.TutorialDialog;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Style;
import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Widget;

public class TutorialDialogImpl extends Composite implements TutorialDialog {

	private static TutorialDialogImplUiBinder uiBinder = GWT
			.create(TutorialDialogImplUiBinder.class);

	interface TutorialDialogImplUiBinder extends
			UiBinder<Widget, TutorialDialogImpl> {
	}
	
	interface WidgetStyle extends CssResource{
		String hidden();
		String arrowLeft();
		String arrowBottom();
		String arrowTop();
		String arrowRight();
	}
	
	@UiField HTMLPanel wrapper;
	@UiField HTMLPanel content;
	@UiField HTMLPanel controls;
	@UiField DivElement arrow;
	@UiField WidgetStyle style;
	@UiField Anchor prev;
	@UiField Anchor next;
	@UiField Anchor finish;
	
	private int userResult = UserAction.CLOSE;
	private AppCssResource appStyle = AppResources.INSTANCE.appCss();
	private CloseTutorialHandler closeHandler = null;
	private BeforeTutorialShowHandler beforeShowHandler = null;
	private int left = 0;
	private int top = 0;
	private int correctionLeft = 0;
	private int correctionTop = 0;
	private Element referenceElement = null;
	private int referenceDirection = -1;
	
	public TutorialDialogImpl() {
		initWidget(uiBinder.createAndBindUi(this));
	}

	@Override
	public void add(Widget w) {
		content.add(w);
	}

	@Override
	public void clear() {
		content.clear();
	}

	@Override
	public Iterator<Widget> iterator() {
		return content.iterator();
	}

	@Override
	public boolean remove(Widget w) {
		
		return content.remove(w);
	}

	@Override
	public String getHTML() {
		return content.getElement().getInnerHTML();
	}

	@Override
	public void setHTML(String html) {
		content.clear();
		content.getElement().setInnerHTML(html);
	}

	@Override
	public String getText() {
		return content.getElement().getInnerText();
	}

	@Override
	public void setText(String text) {
		content.getElement().setInnerText(text);
	}

	@Override
	public void setReferencedElement(Element element, int direction) {
		if(element == null) {
			return;
		}
		referenceElement = element;
		referenceDirection = direction;
		setDialogPosition();
	}

	@Override
	public void setAbsolutePosition(int left, int top) {
		this.left = left;
		this.top = top;
	}
	
	private void setDialogPosition(){
		Element wrap = wrapper.getElement();
		
		//ensure that reference element is still in DOM.
		if(referenceElement != null 
				&& referenceElement.getParentElement() != null){
			
			switch(referenceDirection){
			case Direction.TOP:
				top = referenceElement.getAbsoluteTop() - wrap.getClientHeight();
				left = referenceElement.getAbsoluteLeft();
				break;
			case Direction.BOTTOM:
				top = referenceElement.getAbsoluteTop() + referenceElement.getClientHeight();
				left = referenceElement.getAbsoluteLeft();
				break;
			case Direction.LEFT:
				top = referenceElement.getAbsoluteTop();
				left = referenceElement.getAbsoluteLeft() - wrap.getClientWidth();
				break;
			case Direction.RIGHT:
				top = referenceElement.getAbsoluteTop();
				left = referenceElement.getAbsoluteLeft() + referenceElement.getClientWidth();
				break;
			}
		}
		
		top += correctionTop;
		left += correctionLeft;
		Style style = wrap.getStyle();
		style.setTop(top, Unit.PX);
		style.setLeft(left, Unit.PX);
	}

	@Override
	public void show() {
		if(beforeShowHandler != null){
			beforeShowHandler.beforeShow();
		}
		setDialogPosition();
		new Timer() {
			
			@Override
			public void run() {
				wrapper.getElement().setAttribute("visible", "true");
			}
		}.schedule(100);
		
	}

	@Override
	public void showArrow(int direction) {
		switch(direction){
		case Direction.TOP: 
			arrow.addClassName(appStyle.trialngleTop());
			wrapper.addStyleName(style.arrowTop());
			break;
		case Direction.BOTTOM: 
			arrow.addClassName(appStyle.trialngleBottom());
			wrapper.addStyleName(style.arrowBottom());
			break;
		case Direction.LEFT: 
			arrow.addClassName(appStyle.trialngleLeft());
			wrapper.addStyleName(style.arrowLeft());
			break;
		case Direction.RIGHT: 
			arrow.addClassName(appStyle.trialngleRight());
			wrapper.addStyleName(style.arrowRight());
			break;
		}
		arrow.removeClassName(style.hidden());
	}

	@Override
	public void showControls(int controlsType) {
		switch(controlsType){
		case Controls.NEXT_ONLY:
			prev.setVisible(false);
			finish.setVisible(false);
			break;
		case Controls.PREV_CLOSE:
			next.setVisible(false);
			break;
		case Controls.PREV_NEXT:
			finish.setVisible(false);
			break;
		case Controls.PREV_ONLY:
			finish.setVisible(false);
			next.setVisible(false);
			break;
		}
		controls.removeStyleName(style.hidden());
	}

	@Override
	public int getLastUserAction(int userAction) {
		return userResult;
	}
	
	
	@UiHandler({"close","finish"})
	void onClose(ClickEvent e){
		e.preventDefault();
		userResult = UserAction.CLOSE;
		closeDialog();
	}
	@UiHandler("prev")
	void onPrev(ClickEvent e){
		e.preventDefault();
		userResult = UserAction.PREV;
		closeDialog();
	}
	@UiHandler("next")
	void onNext(ClickEvent e){
		e.preventDefault();
		userResult = UserAction.NEXT;
		closeDialog();
	}
	
	
	void closeDialog(){
		wrapper.getElement().removeAttribute("visible");
		new Timer(){
			@Override
			public void run() {
				if(closeHandler != null){
					closeHandler.onClose(userResult);
				}
			}			
		}.schedule(300);
	}
	

	@Override
	public void setCloseHandler(CloseTutorialHandler handler) {
		closeHandler = handler;
	}

	@Override
	public void setBeforeTutorialShowHandler(BeforeTutorialShowHandler handler) {
		beforeShowHandler = handler;
	}

	@Override
	public void setPositionCorrection(int top, int left) {
		correctionLeft = left;
		correctionTop = top;
		setDialogPosition();
	}
}