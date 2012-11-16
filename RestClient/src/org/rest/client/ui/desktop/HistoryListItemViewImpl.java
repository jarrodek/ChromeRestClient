package org.rest.client.ui.desktop;

import java.util.Date;

import org.rest.client.storage.store.objects.HistoryObject;
import org.rest.client.ui.HistoryListItemView;
import org.rest.client.ui.HistoryView;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.DateTimeFormat.PredefinedFormat;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.Widget;

public class HistoryListItemViewImpl extends Composite implements HistoryListItemView {
	
	private static HistoryListItemViewImplUiBinder uiBinder = GWT
			.create(HistoryListItemViewImplUiBinder.class);

	interface HistoryListItemViewImplUiBinder extends UiBinder<Widget, HistoryListItemViewImpl> {
	}
	
	@UiField InlineLabel methodLabel;
	@UiField InlineLabel urlValue;
	@UiField InlineLabel dateLabel;
	@UiField SpanElement encoding;
	@UiField SpanElement payload;
	@UiField SpanElement headers;
	@UiField DivElement detailedPanel;
	@UiField HTMLPanel urlLabel;
	@UiField HTMLPanel container;
	
	HistoryView parentList = null;
	private int historyId = -1;
	private boolean fullHistoryObject = false;
	
	public HistoryListItemViewImpl(){
		
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
	public void setPresenter(HistoryView presenter) {
		this.parentList = presenter;
	}	

	@Override
	public void setMethod(String method) {
		this.methodLabel.setText(method);
	}

	@Override
	public void setURL(String url) {
		this.urlValue.setText(url);
	}
	@Override
	public void setItemId(int id) {
		this.historyId = id;
	}
	
	@UiHandler({"methodLabel"})
	void onExpand(ClickEvent e){
		e.preventDefault();
		doOnExpand();
	}
	@UiHandler("delete")
	void onDeleteItem(ClickEvent e){
		e.preventDefault();
		parentList.removeItem(historyId);
		removeFromParent();
	}
	
	private void doOnExpand(){
		if(detailedPanel.getClassName().contains("hidden")){
			expandDetails();
		} else {
			hideDetails();
		}
	}
	
	@UiHandler("select")
	void onSelectItem(ClickEvent e){
		e.preventDefault();
		parentList.onSelectedHistoryItem(historyId);
	}
	
	void expandDetails(){ 
		if(fullHistoryObject == false){
			parentList.getHistoryDetails(historyId, new Callback<HistoryObject, Throwable>() {
				@Override
				public void onSuccess(HistoryObject result) {
					if(result == null){
						StatusNotification.notify("Unable to read history data :(",StatusNotification.TYPE_ERROR);
						return;
					}
					fullHistoryObject = true;
					if(result.getPayload() != null){
						payload.setInnerText(result.getPayload());
					}
					if(result.getHeaders() != null){
						headers.setInnerText(result.getHeaders());
					}
					if(result.getEncoding() != null){
						encoding.setInnerText(result.getEncoding());
					}
				}
				@Override
				public void onFailure(Throwable reason) {
					StatusNotification.notify("Unable to read history data :(",StatusNotification.TYPE_ERROR);
				}
			});
			container.addStyleName("historySelected");
			detailedPanel.removeClassName("hidden");
		} else {
			container.addStyleName("historySelected");
			detailedPanel.removeClassName("hidden");
		}
	}
	
	void hideDetails(){
		container.removeStyleName("historySelected");
		detailedPanel.addClassName("hidden");
	}

	@Override
	public void setDate(Date date) {
		String data = DateTimeFormat.getFormat(PredefinedFormat.DATE_TIME_SHORT).format(date);
		dateLabel.setText(data);
	}	
}
