package org.rest.client.ui.desktop;

import java.sql.Date;

import org.rest.client.jso.RequestObject;
import org.rest.client.place.RequestPlace;
import org.rest.client.ui.SavedView.Presenter;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.DateTimeFormat.PredefinedFormat;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;

public class SavedListItemViewImpl extends Composite {

	private static SavedListItemViewImplUiBinder uiBinder = GWT
			.create(SavedListItemViewImplUiBinder.class);

	interface SavedListItemViewImplUiBinder extends
			UiBinder<Widget, SavedListItemViewImpl> {
	}
	
	final private Presenter listener;
	final private RequestObject requestObject;
	
	@UiField InlineLabel dateLabel;
	@UiField InlineLabel methodLabel;
	@UiField InlineLabel urlValue;
	@UiField TextBox nameInput;
	@UiField DivElement detailedPanel;
	@UiField HTMLPanel urlLabel;
	@UiField SpanElement payload;
	@UiField SpanElement headers;
	@UiField HTMLPanel container;
	@UiField Button select;
	@UiField Button delete;
	
	public SavedListItemViewImpl(Presenter listener, RequestObject requestObject) {
		this.listener = listener;
		this.requestObject = requestObject;
		initWidget(uiBinder.createAndBindUi(this));
		
		urlLabel.addDomHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent e) {
				e.preventDefault();
				doOnExpand();
			}
		}, ClickEvent.getType());
		
		
	}
	
	@Override
	protected void onAttach() {
		super.onAttach();
		
		setViewValues();
	}
	
	private void setViewValues() {
		
		long time = (long) requestObject.getTime();
		Date date = new Date(time);
		String data = DateTimeFormat.getFormat(PredefinedFormat.DATE_TIME_SHORT).format(date);
		dateLabel.setText(data);
		
		nameInput.setValue(requestObject.getName());
		nameInput.getElement().setAttribute("data-name", requestObject.getName());
		this.methodLabel.setText(requestObject.getMethod());
		this.urlValue.setText(requestObject.getURL());
		
		String payloadValue = requestObject.getPayload();
		String headersValue = requestObject.getHeaders();
		if (payloadValue != null && !payloadValue.isEmpty()) {
			payload.setInnerText(payloadValue);
		} else {
			payload.setInnerHTML("<span class=\"empty-info\">No saved payload</span>");
		}
		if (headersValue != null && !headersValue.isEmpty()) {
			headers.setInnerText(headersValue);
		} else {
			headers.setInnerHTML("<span class=\"empty-info\">No saved headers</span>");
		}
		
		container.getElement().setAttribute("data-request-id", ""+requestObject.getId());
		delete.getElement().setAttribute("data-request-id", ""+requestObject.getId());
		select.getElement().setAttribute("data-request-id", ""+requestObject.getId());
	}
	
	@UiHandler({"methodLabel"})
	void onExpand(ClickEvent e){
		e.preventDefault();
		doOnExpand();
	}
	@UiHandler("select")
	void onSelectItem(ClickEvent e){
		e.preventDefault();
		listener.goTo(RequestPlace.Tokenizer.fromSaved(requestObject.getId()));
	}
	
	@UiHandler("delete")
	void onDeleteItem(ClickEvent e){
		e.preventDefault();
		listener.removeFromSaved(requestObject);
		removeFromParent();
	}
	@UiHandler("nameInput")
	void onNameInputChange(ValueChangeEvent<String> event){
		String name = event.getValue();
		if(name.isEmpty()){
			String prevName = nameInput.getElement().getAttribute("data-name");
			nameInput.setValue(prevName);
			return;
		}
		listener.changeSavedName(name, requestObject.getId());
		nameInput.getElement().setAttribute("data-name", name);
	}
	
	private void doOnExpand(){
		if(detailedPanel.getClassName().contains("hidden")){
			expandDetails();
		} else {
			hideDetails();
		}
	}
	void hideDetails(){
		container.removeStyleName("historySelected");
		detailedPanel.addClassName("hidden");
	}
	void expandDetails(){ 
		container.addStyleName("historySelected");
		detailedPanel.removeClassName("hidden");
	}
}
