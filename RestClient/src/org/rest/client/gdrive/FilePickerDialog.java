package org.rest.client.gdrive;

import java.util.Date;

import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.ui.html5.SearchBox;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.dom.client.ScrollEvent;
import com.google.gwt.event.dom.client.ScrollHandler;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.i18n.shared.DateTimeFormat;
import com.google.gwt.i18n.shared.DateTimeFormat.PredefinedFormat;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.PopupPanel;

public class FilePickerDialog implements KeyDownHandler {

	interface Binder extends UiBinder<DialogBox, FilePickerDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DialogBox dialog;
	@UiField SpanElement loader;
	@UiField HTMLPanel results;
	@UiField SearchBox searchBox;
	
	private DateTimeFormat feedDF = DateTimeFormat.getFormat(PredefinedFormat.ISO_8601);
	private DateTimeFormat displayDF = DateTimeFormat.getFormat(PredefinedFormat.MONTH_ABBR_DAY);
	private String nextPageToken = null;
	private final int wingowHeightPagging = 300;
	private final int INIT_NEXT_PAGE_PADDING = 25;
	private boolean requestProgress = false;
	private boolean disableNextRequest = false;
	private String latestSearchValue = null;
	
	private String result = null;
	private final String mimeType;
	private String access_token = null;
	
	public FilePickerDialog(String mimeType) {
		this.mimeType = mimeType;
		
		Binder.BINDER.createAndBindUi(this);
		dialog.addDomHandler(this, KeyDownEvent.getType());
		searchBox.getElement().removeAttribute("placeholder");
		observeSearch(searchBox.getElement());
		int h = Window.getClientHeight();
		if(h > 150+wingowHeightPagging){
			results.getElement().getStyle().setHeight(h-wingowHeightPagging, Unit.PX);
		}
		final HTML5Element resultsElement = (HTML5Element) results.getElement().cast();
		
		results.addDomHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				if(event.getNativeEvent() == null || event.getNativeEvent().getEventTarget() == null){
					return;
				}
				
				com.google.gwt.dom.client.Element target = Element.as(event.getNativeEvent().getEventTarget());
				String folderId = target.getAttribute("data-folder-id");
				if(folderId == null || folderId.isEmpty()){
					return;
				}
				
				HTML5Element selected = resultsElement.querySelector(".Folder_Pickup_ResultRowSelected");
				if(selected != null){
					selected.getClassList().remove("Folder_Pickup_ResultRowSelected");
				}
				
				if(!target.getClassName().contains("Folder_Pickup_ResultRow")){
					while(!target.getClassName().contains("Folder_Pickup_ResultRow")){
						target = target.getParentElement();
						if(target.getNodeName().toLowerCase().equals("body")){
							return;
						}
					}
				}
				
				result = folderId;
				target.addClassName("Folder_Pickup_ResultRowSelected");
			}
		}, ClickEvent.getType());
	}
	
	public HandlerRegistration addCloseHandler(CloseHandler<PopupPanel> handler){
		return dialog.addCloseHandler(handler);
	}
	
	public String getResult(){
		return result;
	}
	
	
	
	
	public String getAccessToken() {
		return access_token;
	}

	public void setAccessToken(String access_token) {
		this.access_token = access_token;
	}

	public void show() {
		dialog.show();
		dialog.center();
		final Element resultElement = results.getElement();
		Window.addResizeHandler(new ResizeHandler() {
			@Override
			public void onResize(ResizeEvent event) {
				int h = event.getHeight();
				if(h > 150+wingowHeightPagging){
					resultElement.getStyle().setHeight(h-wingowHeightPagging, Unit.PX);
				}
			}
		});
		
		results.addDomHandler(new ScrollHandler() {
			@Override
			public void onScroll(ScrollEvent event) {
				int bottomScroll = resultElement.getScrollTop() + resultElement.getOffsetHeight();
				if(resultElement.getScrollHeight() - bottomScroll <= INIT_NEXT_PAGE_PADDING){
					getResultList();
				}
			}
		}, ScrollEvent.getType());
		
		getResultList();
	}
	
	private void getResultList(){
		if(requestProgress || disableNextRequest){
			return;
		}
		requestProgress = true;
		
		loader.removeClassName("hidden");
		DriveCall.getFileList(new DriveCall.FileRequestHandler() {
			@Override
			public void onLoad(DriveFileListResponse response) {
				
				loader.addClassName("hidden");
				if(response == null){
					disableNextRequest = true;
					return;
				}
				
				nextPageToken = response.getNextPageToken();
				if(nextPageToken == null){
					disableNextRequest = true;
				}
				displayResults(response.getItems());
				requestProgress = false;
			}

			@Override
			public void onError(DriveError error) {
				if(error.getCode() == 401){
					//Unauthorized
					DriveCall.auth(new DriveCall.SessionHandler() {
						@Override
						public void onResult(DriveAuth result) {
							if(result == null){
								
								FlowPanel panel = new FlowPanel();
								panel.setStyleName("Folder_Pickup_ResultRow");
								
								Label name = new Label("Unauthorized.");
								name.setStyleName("Folder_Pickup_Name");
								
								results.add(panel);
								return;
							}
							
							getResultList();
						}
					}, true);
				} else {
					FlowPanel panel = new FlowPanel();
					panel.setStyleName("Folder_Pickup_ResultRow");
					
					Label name = new Label("Error: " + error.getMessage());
					name.setStyleName("Folder_Pickup_Name");
					
					results.add(panel);
				}
				
			}
		}, mimeType, nextPageToken, searchBox.getValue().trim(), access_token);
	}
	
	private void displayResults(JsArray<DriveFileListItem> items){
		int size = items.length();
		if(size == 0){
			disableNextRequest = true;
			return;
		}
		
		for(int i=0; i<size; i++){
			DriveFileListItem item = items.get(i);
			
			FlowPanel panel = new FlowPanel();
			panel.setStyleName("Folder_Pickup_ResultRow");
			
			HTML image = new HTML("<img src=\""+item.getIconLink()+"\"/>");
			image.setStyleName("Folder_Pickup_Icon");
			
			Label name = new Label(item.getTitle());
			name.setStyleName("Folder_Pickup_Name");
			
			Date createDateObject = null;
			try{
				createDateObject = feedDF.parse(item.getCreatedDate());
			} catch(Exception ex){}
			
			
			Label time = new Label();
			if(createDateObject != null){
				time.setText(displayDF.format(createDateObject));
			}
			time.setStyleName("Folder_Pickup_Time");

			panel.add(image);
			panel.add(name);
			panel.add(time);
			
			image.getElement().setAttribute("data-folder-id", item.getId());
			name.getElement().setAttribute("data-folder-id", item.getId());
			time.getElement().setAttribute("data-folder-id", item.getId());
			panel.getElement().setAttribute("data-folder-id", item.getId());
			
			results.add(panel);
		}
		dialog.center();
	}

	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		result = null;
		dialog.hide();
	}
	
	@UiHandler("select")
	void onSelect(ClickEvent event) {
		dialog.hide();
	}

	@Override
	public void onKeyDown(KeyDownEvent event) {
		
		int keyCode = event.getNativeKeyCode();
		if (keyCode == KeyCodes.KEY_ESCAPE) {
			onDismiss(null);
		}
	}
	
	@UiHandler("find")
	void onSearch(ClickEvent e){
		e.preventDefault();
		String currentValue = searchBox.getValue();
		resetSearch(currentValue);
	}
	
	void resetSearch(String searchValue){
		if(latestSearchValue != null && latestSearchValue.equals(searchValue)){
			return;
		}
		latestSearchValue = searchValue;
		disableNextRequest = false;
		results.clear();
		getResultList();
	}
	
	final native void observeSearch(Element element) /*-{
		var context = this;
		var callback = $entry(function(e){
			var value = e.target.value;
			context.@org.rest.client.gdrive.FilePickerDialog::resetSearch(Ljava/lang/String;)(value);
		});
		element.addEventListener('search',callback,false);
	}-*/;
}
