package org.rest.client.ui.desktop;

import java.sql.Date;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.event.ClearHistoryEvent;
import org.rest.client.place.RequestPlace;
import org.rest.client.storage.store.objects.HistoryObject;
import org.rest.client.ui.HistoryListItemView;
import org.rest.client.ui.HistoryView;
import org.rest.client.ui.html5.SearchBox;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.Window.ScrollEvent;
import com.google.gwt.user.client.Window.ScrollHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.Widget;

public class HistoryViewImpl extends Composite implements HistoryView {
	
	private static HistoryViewImplUiBinder uiBinder = GWT
			.create(HistoryViewImplUiBinder.class);

	interface HistoryViewImplUiBinder extends UiBinder<Widget, HistoryViewImpl> {
	}
	class WidgetStyle {
		final String emptyInfo = "History_View_emptyInfo";
		String searchBox = "History_View_searchBox";
	}
	private Presenter listener = null;
	private boolean loadingNext = false;
	InlineLabel infoLabel = null;
	WidgetStyle style = new WidgetStyle();
	
	@UiField DivElement loaderInfo;
	@UiField HTMLPanel root;
	@UiField HTMLPanel list;
	@UiField HTMLPanel loaderContainer;
	
	@UiField InlineLabel loader;
	@UiField InlineLabel clearHistory;
	@UiField SearchBox searchInput;
	
	public HistoryViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
		
		searchInput.addStyleName(style.searchBox);
		searchInput.getElement().setAttribute("placeholder", "search history...");
		
		ClearHistoryEvent.register(RestClient.getClientFactory().getEventBus(), new ClearHistoryEvent.Handler() {
			@Override
			public void onClearForm() {
				list.clear();
				emptyInfo();
			}
		});
		
		observeScroll();
		observeSearch(searchInput.getElement());
	}
	
	@Override
	public void setPresenter(Presenter listener) {
		this.listener = listener;
	}
	
	private void observeScroll(){
		Window.addWindowScrollHandler(new ScrollHandler() {
			@Override
			public void onWindowScroll(ScrollEvent event) {
				if(loadingNext){
					return;
				}
				int bottom = event.getScrollTop() + Window.getClientHeight();
				int referenceTop = loaderContainer.getAbsoluteTop();
				if(bottom >= referenceTop){
					loadingNext = true;
					loader.setVisible(true);
					listener.getNextItemsPage();
				}
			}
		});
	}
	
	
	/**
	 * Create info message when no data available
	 */
	private void emptyInfo(){
		if(loaderInfo.hasParentElement()){
			loaderInfo.removeFromParent();
		}
		infoLabel = new InlineLabel();
		infoLabel.setText("You do not have any saved history :(");
		infoLabel.addStyleName(style.emptyInfo);
		root.add(infoLabel);
	}
	
	private void emptyQueryResults(){
		infoLabel = new InlineLabel();
		infoLabel.setText("No history for query \""+searchInput.getValue()+"\" found.");
		infoLabel.addStyleName(style.emptyInfo);
		root.add(infoLabel);
	}
	
	
	@UiHandler("clearHistory")
	void onClearHistory(ClickEvent e){
		e.preventDefault();
		listener.onClearHistory();
	}
	
	void startSearch(String query){ 
		loader.setVisible(true);
		listener.serach(query);
	}
	
	final native void observeSearch(Element element) /*-{
		var context = this;
		var callback = $entry(function(e){
			var value = e.target.value;
			context.@org.rest.client.ui.desktop.HistoryViewImpl::startSearch(Ljava/lang/String;)(value);
		});
		element.addEventListener('search',callback,false);
	}-*/;
	
	
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

	@Override
	public void setNoMoreItems() {
		if(infoLabel != null){
			infoLabel.removeFromParent();
			infoLabel = null;
		}
		loader.setVisible(false);
		if(list.getWidgetCount() == 0 && searchInput.getValue().isEmpty()){
			emptyInfo();
		} else if(list.getWidgetCount() == 0 && !searchInput.getValue().isEmpty()){
			emptyQueryResults();
		}
	}

	
	
	@Override
	public void appendResults(List<HistoryObject> data) {
		if(infoLabel != null){
			infoLabel.removeFromParent();
			infoLabel = null;
		}
		loadingNext = false;
		loader.setVisible(false);
		if(loaderInfo.hasParentElement()){
			loaderInfo.removeFromParent();
		}
		if((data == null || data.isEmpty()) && list.getWidgetCount() == 0){
			emptyInfo();
			return;
		}
		//disable repainting
		list.setVisible(false);
		for(HistoryObject history : data){
			HistoryListItemView item = RestClient.getClientFactory().getHistoryListItemView();
			item.setPresenter(this);
			item.setMethod(history.getMethod());
			item.setURL(history.getURL());
			item.setItemId(history.getId());
			long time = (long) history.getTime();
			Date d = new Date(time);
			item.setDate(d);
			list.add(item);
		}
		list.setVisible(true);
		ensureScrollItems();
	}
	
	public void removeItem(int historyId){
		listener.removeFromeHistory(historyId);
	}
	
	private void ensureScrollItems(){
		int bottom = Window.getScrollTop() + Window.getClientHeight();
		int referenceTop = loaderContainer.getAbsoluteTop();
		if(bottom >= referenceTop){
			loadingNext = true;
			loader.setVisible(true);
			listener.getNextItemsPage();
		}
	}
	
	@Override
	public void clearResultList() {
		list.clear();
	}
}
