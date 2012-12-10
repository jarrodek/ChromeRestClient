package org.rest.client.ui.desktop;

import java.util.List;

import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.ui.SavedView;
import org.rest.client.ui.html5.SearchBox;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.Window.ScrollEvent;
import com.google.gwt.user.client.Window.ScrollHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.Widget;

public class SavedViewImpl extends Composite implements SavedView {
	
	private static SavedViewImplUiBinder uiBinder = GWT
			.create(SavedViewImplUiBinder.class);

	interface SavedViewImplUiBinder extends UiBinder<Widget, SavedViewImpl> {
	}
	
	
	
	private Presenter listener = null;
	private boolean loadingNext = false;
	InlineLabel infoLabel = null;
	@UiField DivElement loaderInfo;
	@UiField SearchBox searchInput;
	@UiField HTMLPanel loaderContainer;
	@UiField InlineLabel loader;
	@UiField HTMLPanel root;
	@UiField HTMLPanel list;
	
	public SavedViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
		searchInput.addStyleName("Saved_View_searchBox");
		searchInput.getElement().setAttribute("placeholder", "search the request...");
		
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
		
		infoLabel = new InlineLabel();
		infoLabel.setText("You do not have any saved requests :(");
		infoLabel.addStyleName("Saved_View_emptyInfo");
		root.add(infoLabel);
		
	}
	
	private void emptyQueryResults(){
		infoLabel = new InlineLabel();
		infoLabel.setText("No history for query \""+searchInput.getValue()+"\" found.");
		infoLabel.addStyleName("Saved_View_emptyInfo");
		root.add(infoLabel);
	}
	
	void startSearch(String query){ 
		loader.setVisible(true);
		listener.serach(query);
	}
	
	final native void observeSearch(Element element) /*-{
		var context = this;
		var callback = $entry(function(e){
			var value = e.target.value;
			context.@org.rest.client.ui.desktop.SavedViewImpl::startSearch(Ljava/lang/String;)(value);
		});
		element.addEventListener('search',callback,false);
	}-*/;
	
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

	@Override
	public void appendResults(List<RequestObject> data) {
		
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
		for(RequestObject item : data){
			SavedListItemViewImpl widget = new SavedListItemViewImpl(listener, item);
			list.add(widget);
		}
		list.setVisible(true);
		
		ensureScrollItems();
	}
}
