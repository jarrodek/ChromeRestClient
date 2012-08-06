package org.rest.client.ui.desktop;

import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.event.ClearHistoryEvent;
import org.rest.client.place.RequestPlace;
import org.rest.client.storage.store.objects.HistoryObject;
import org.rest.client.ui.HistoryListItemView;
import org.rest.client.ui.HistoryView;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.Widget;

public class HistoryViewImpl extends Composite implements HistoryView {
	
	private static HistoryViewImplUiBinder uiBinder = GWT
			.create(HistoryViewImplUiBinder.class);

	interface HistoryViewImplUiBinder extends UiBinder<Widget, HistoryViewImpl> {
	}
	interface WidgetStyle extends CssResource {
		String emptyInfo();
	}
	private Presenter listener = null;
	
	@UiField DivElement loaderInfo;
	@UiField HTMLPanel root;
	@UiField WidgetStyle style;
	
	public HistoryViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
		
		ClearHistoryEvent.register(RestClient.getClientFactory().getEventBus(), new ClearHistoryEvent.Handler() {
			@Override
			public void onClearForm() {
				root.clear();
				emptyInfo();
			}
		});
	}
	
	@Override
	public void setPresenter(Presenter listener) {
		this.listener = listener;
	}
	/**
	 * @todo Create info message for empty data
	 */
	private void emptyInfo(){
		InlineLabel label = new InlineLabel();
		label.setText("You do not have any saved history :(");
		label.addStyleName(style.emptyInfo());
		root.add(label);
	}
	
	
	@Override
	public void setHistory(List<HistoryObject> data) {
		loaderInfo.removeFromParent();
		if(data == null || data.isEmpty()){
			emptyInfo();
			return;
		}
		for(HistoryObject history : data){
			HistoryListItemView item = RestClient.getClientFactory().getHistoryListItemView();
			item.setPresenter(this);
			item.setMethod(history.getMethod());
			item.setURL(history.getURL());
			item.setItemId(history.getId());
			root.add(item);
		}
		
		
	}
	@UiHandler("clearHistory")
	void onClearHistory(ClickEvent e){
		e.preventDefault();
		listener.onClearHistory();
	}

	@Override
	public void getHistoryDetails(int historyId, final Callback<HistoryObject, Throwable> callback) {
		listener.onHistoryItemSelect(historyId, new Callback<HistoryObject, Throwable>() {
			
			@Override
			public void onSuccess(HistoryObject result) {
				callback.onSuccess(result);
			}
			
			@Override
			public void onFailure(Throwable reason) {
				callback.onFailure(reason);
			}
		});
	}

	@Override
	public void onSelectedHistoryItem(int historyId) {
		listener.goTo(RequestPlace.Tokenizer.fromHistory(historyId));
	}
}
