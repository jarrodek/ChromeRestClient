package org.rest.client.ui.desktop;

import java.util.List;

import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.ui.SavedView;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.Widget;

public class SavedViewImpl extends Composite implements SavedView {
	
	private static SavedViewImplUiBinder uiBinder = GWT
			.create(SavedViewImplUiBinder.class);

	interface SavedViewImplUiBinder extends UiBinder<Widget, SavedViewImpl> {
	}
	
	interface WidgetStyle extends CssResource {
		String emptyInfo();
	}
	
	private Presenter listener = null;
	@UiField DivElement loaderInfo;
	@UiField HTMLPanel root;
	@UiField HTMLPanel list;
	@UiField WidgetStyle style;
	@UiField Button loadNextPage;
	
	public SavedViewImpl(){
		initWidget(uiBinder.createAndBindUi(this));
	}
	
	@Override
	public void setPresenter(Presenter listener) {
		this.listener = listener;
	}
	
	@UiHandler("loadNextPage")
	void onLoadNextPage(ClickEvent e){
		e.preventDefault();
		listener.getNextItemsPage();
	}
	
	/**
	 * Create info message when no data available
	 */
	private void emptyInfo(){
		InlineLabel label = new InlineLabel();
		label.setText("You do not have any saved requests :(");
		label.addStyleName(style.emptyInfo());
		root.add(label);
		loadNextPage.removeFromParent();
	}
	
	@Override
	public void addData(List<RequestObject> data) {
		loaderInfo.removeFromParent();
		if(data == null || data.isEmpty()){
			emptyInfo();
			return;
		}
		
		for(RequestObject item : data){
			SavedListItemViewImpl widget = new SavedListItemViewImpl(listener, item);
			root.add(widget);
		}
	}

	@Override
	public void setNoMoreItems() {
		loadNextPage.removeFromParent();
	}
}
