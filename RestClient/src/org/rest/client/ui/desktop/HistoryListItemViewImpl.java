package org.rest.client.ui.desktop;

import org.rest.client.resources.AppCssResource;
import org.rest.client.resources.AppResources;
import org.rest.client.storage.store.objects.HistoryObject;
import org.rest.client.ui.HistoryListItemView;
import org.rest.client.ui.HistoryView;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.Widget;

public class HistoryListItemViewImpl extends Composite implements HistoryListItemView {
	
	private static HistoryListItemViewImplUiBinder uiBinder = GWT
			.create(HistoryListItemViewImplUiBinder.class);

	interface HistoryListItemViewImplUiBinder extends UiBinder<Widget, HistoryListItemViewImpl> {
	}
	
	@UiField InlineLabel methodLabel;
	@UiField InlineLabel urlLabel;
	@UiField SpanElement encoding;
	@UiField SpanElement payload;
	@UiField SpanElement headers;
	@UiField DivElement detailedPanel;
	
	
	AppCssResource appStyle = AppResources.INSTANCE.appCss();
	HistoryView parentList = null;
	private int historyId = -1;
	private boolean fullHistoryObject = false;
	
	public HistoryListItemViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
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
		this.urlLabel.setText(url);
	}
	@Override
	public void setItemId(int id) {
		this.historyId = id;
	}
	
	@UiHandler({"methodLabel","urlLabel"})
	void onExpand(ClickEvent e){
		e.preventDefault();
		if(detailedPanel.getClassName().contains(appStyle.hidden())){
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
			detailedPanel.removeClassName(appStyle.hidden());
		} else {
			detailedPanel.removeClassName(appStyle.hidden());
		}
	}
	
	void hideDetails(){
		detailedPanel.addClassName(appStyle.hidden());
	}	
}
