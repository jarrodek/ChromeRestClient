package com.restclient.client.widgets;

import java.util.Date;
import java.util.List;
import java.util.Set;

import com.google.gwt.cell.client.AbstractCell;
import com.google.gwt.cell.client.ValueUpdater;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.EventTarget;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.DateTimeFormat.PredefinedFormat;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.cellview.client.CellList;
import com.google.gwt.user.cellview.client.CellList.Resources;
import com.google.gwt.user.cellview.client.HasKeyboardPagingPolicy.KeyboardPagingPolicy;
import com.google.gwt.user.cellview.client.HasKeyboardSelectionPolicy.KeyboardSelectionPolicy;
import com.google.gwt.user.cellview.client.SimplePager;
import com.google.gwt.user.cellview.client.SimplePager.TextLocation;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.view.client.AsyncDataProvider;
import com.google.gwt.view.client.CellPreviewEvent;
import com.google.gwt.view.client.DefaultSelectionEventManager;
import com.google.gwt.view.client.HasData;
import com.google.gwt.view.client.MultiSelectionModel;
import com.google.gwt.view.client.ProvidesKey;
import com.google.gwt.view.client.Range;
import com.google.gwt.xhr2.client.RequestHeader;
import com.restclient.client.RequestHistory;
import com.restclient.client.RequestHistoryItem;
import com.restclient.client.event.HistoryRestoreEvent;
import com.restclient.client.resources.CellResources;

/**
 * Widget provide view for request history list.
 * @author Paweł Psztyć
 *
 */
public class HistoryListWidget extends Composite implements SubpageWidget {

	private static final Binder binder = GWT.create(Binder.class);

	interface Binder extends UiBinder<Widget, HistoryListWidget> {
	}
	
	interface WidgetStyle extends CssResource {
		String timeCell();
		String flex();
		String itemCell();
		String itemRow();
		String cellListEmptyNote();
		String methodCell();
		String urlCell();
		String hidden();
		String descRow();
		String encodingCell();
		String headersCell();
		String bodyCell();
		String headerInnerRow();
		String descRowOpened();
		String actionCell();
	}
	
	interface Template extends SafeHtmlTemplates {
		/**
		 * Request URL
		 * @param classes wrapper class name
		 * @param url content
		 * @return
		 */
		@Template("<div class=\"{0}\">{1}</div>")
	    SafeHtml rowRequestUrl(String classes, String url);
		/**
		 * Request method
		 * @param classes wrapper class name
		 * @param type content
		 * @return
		 */
		@Template("<div class=\"{0}\">{1}</div>")
	    SafeHtml rowRequestMethod(String classes, String type);
		/**
		 * Simple div element with content
		 * @param classes wrapper class name
		 * @param cellContents content
		 * @return
		 */
		@Template("<div class=\"{0}\" style=\"outline:none;\">{1}</div>")
	    SafeHtml div(String classes, SafeHtml cellContents);
		
		/**
		 * Simple button element with value
		 * @param classes wrapper class name
		 * @param cellContents content
		 * @return
		 */
		@Template("<div class=\"{0}\" style=\"outline:none;\"><input class=\"gwt-Button\" type=\"button\" value=\"{1}\"/></div>")
	    SafeHtml button(String classes, String cellContents);
	}
	private static final Template TEMPLATE = GWT.create(Template.class);
	/**
	 * Single history items row.
	 * @author jarrod
	 *
	 */
	class HistoryCell extends AbstractCell<RequestHistoryItem>{
		
		public HistoryCell(){
			super("click","keydown");
		}
		
		@Override
		public void onBrowserEvent(
				com.google.gwt.cell.client.Cell.Context context,
				final Element parent, RequestHistoryItem value, NativeEvent event,
				ValueUpdater<RequestHistoryItem> valueUpdater) {
			if (value == null) {
				return;
		    }
			super.onBrowserEvent(context, parent, value, event, valueUpdater);
			
			if( "click".equals(event.getType()) ){
				if( event.getCtrlKey() || event.getShiftKey() ){
					//
					// Do nothing in multi-selection.
					//
					return;
				}
				boolean isSelected = selectionModel.isSelected(value);
				EventTarget target = event.getEventTarget();
				Element targetElement = target.cast();
				if(targetElement.getClassName().contains( "gwt-Button" )){
					if( !isSelected ){
						selectionModel.setSelected(value, true);
					}
					fireHistoryEvent(value);
					return;
				}
				
				
				if( isSelected ){
					return;
				}
				Set<RequestHistoryItem> set = selectionModel.getSelectedSet();
				if( set.size() > 0 ){
					//
					// User select more than one item and should not take action in presenter.
					//
					return;
				}
				selectionModel.setSelected(value, !isSelected);
			}
			
		}
		
		@Override
		protected void onEnterKeyDown(
				com.google.gwt.cell.client.Cell.Context context,
				Element parent, RequestHistoryItem value, NativeEvent event,
				ValueUpdater<RequestHistoryItem> valueUpdater) {
			selectionModel.clear();
			selectionModel.setSelected(value, true);
			fireHistoryEvent(value);
		}
		
		@Override
		public void render(com.google.gwt.cell.client.Cell.Context context,
				RequestHistoryItem value, SafeHtmlBuilder sb) {
			if (value == null) {
				return;
			}
			
			String cellClass = style.itemCell() + " " + style.flex();
			String rowClass = style.itemRow() + " "+ style.flex();
			
			long updated = value.getUpdated();
			Date lastUpdateDate = new Date(updated);
			
			String dateStr = lastUpdateDate == null ? "" : DateTimeFormat.getFormat(PredefinedFormat.DATE_TIME_MEDIUM).format(lastUpdateDate);
			SafeHtml dateCell = TEMPLATE.div(style.timeCell() + " " + cellClass, SafeHtmlUtils.fromString(dateStr));
			
			String method = value.getMethod();
			SafeHtml methodCell = TEMPLATE.rowRequestMethod(cellClass + " " + style.methodCell(), method);
			
			String url = value.getRequestUrl();
			SafeHtml urlCell = TEMPLATE.rowRequestUrl(cellClass + " " + style.urlCell(), url);
			
			SafeHtml buttonCell = TEMPLATE.button(cellClass + " " + style.actionCell(), "Select");
			
			
			String itemKey = (String) selectionModel.getKeyProvider().getKey(value);
			
			//itemKey is signed integer
			
			sb.appendHtmlConstant("<div class=\"" + rowClass + "\" data-key=\""+itemKey+"\">");
			sb.append(methodCell);
			sb.append(urlCell);
			sb.append(dateCell);
			sb.append(buttonCell);
			sb.appendHtmlConstant("</div>");
			
			boolean isSelected = selectionModel.isSelected(value);
			
			
			sb.appendHtmlConstant("<div class=\"" + rowClass + " " + ( isSelected ? style.descRowOpened() : style.descRow() ) + "\" data-for=\""+itemKey+"\">");
			
			String enc = value.getFormEncoding();
			List<RequestHeader> headers = value.getHeaders();
			String post = value.getPostData();
			if(post == null){
				post = "";
			} else {
				if( post.length() > 200 ){
					post = post.substring(0,200);
					post += " (...)";
				}
			}
			
			SafeHtml encodingCell = TEMPLATE.div(style.encodingCell() + " " + cellClass, SafeHtmlUtils.fromString(enc));
			SafeHtml postCell = TEMPLATE.div(style.bodyCell() + " " + cellClass, SafeHtmlUtils.fromString(post));
			SafeHtmlBuilder headersBuilder = new SafeHtmlBuilder();
			int headersMin = Math.min(headers.size(), 4);
			
			
			
			for( int i = 0; i<headersMin; i++ ){
				RequestHeader item = headers.get(i);
				String keaderKey = item.getName();
				String headerValue = item.getValue();
				
				headersBuilder.appendHtmlConstant("<span class=\"" + style.headerInnerRow() + "\">");
				SafeHtml headersHtml = SafeHtmlUtils.fromString( keaderKey + ": "+ headerValue );
				headersBuilder.append(headersHtml);
				headersBuilder.appendHtmlConstant("</span>");
			}
			if( headersMin < headers.size() ){
				headersBuilder.appendEscaped( "(...)" );
			}
			SafeHtml headersCell = TEMPLATE.div(style.headersCell() + " " + cellClass, headersBuilder.toSafeHtml());
			sb.append(encodingCell);
			sb.append(postCell);
			sb.append(headersCell);
			sb.appendHtmlConstant("</div>");
		}
		
	}
	
	private EventBus eventBus;
	private CellList<RequestHistoryItem> historyList;
	private MultiSelectionModel<RequestHistoryItem> selectionModel;
	private final Label DEFAULT_EMPTY_MESSGAE = new Label("You do not have saved history.");
	
	@UiField WidgetStyle style;
	@UiField(provided=true) SimplePager pager;
	@UiField HTMLPanel bodyPanel;
	
	private static final ProvidesKey<RequestHistoryItem> KEY_PROVIDER = new ProvidesKey<RequestHistoryItem>() {
		@Override
		public Object getKey(RequestHistoryItem item) {
			
			if(item == null){
				return String.valueOf(String.valueOf(Math.random()).substring(2).hashCode());
			}
			String key = item.getUpdated() + ":" + item.getMethod() + ":" + item.getRequestUrl();
			return String.valueOf(key.hashCode());
		}
	};
	/**
	 * Constructor.
	 * @param eventBus 
	 */
	public HistoryListWidget(EventBus eventBus) {
		
		this.eventBus = eventBus;
		
		SimplePager.Resources pagerResources = GWT.create(SimplePager.Resources.class);
		pager = new SimplePager(TextLocation.CENTER,pagerResources, false, 0, true);
		
		initWidget(binder.createAndBindUi(this));
		
		HistoryCell historyCell = new HistoryCell();
		
		Resources resources = (com.google.gwt.user.cellview.client.CellList.Resources) GWT.create(CellResources.class);
		historyList = new CellList<RequestHistoryItem>(historyCell,resources,KEY_PROVIDER);
		historyList.setVisibleRange(0, 19);
		DEFAULT_EMPTY_MESSGAE.addStyleName( style.cellListEmptyNote() );
		historyList.setEmptyListWidget(DEFAULT_EMPTY_MESSGAE);
		historyList.setTabIndex(-1);

		historyList.setKeyboardPagingPolicy(KeyboardPagingPolicy.INCREASE_RANGE);
		historyList.setPageSize(20);

		historyList.setKeyboardSelectionPolicy(KeyboardSelectionPolicy.ENABLED);
		selectionModel = new MultiSelectionModel<RequestHistoryItem>(KEY_PROVIDER);
		
		historyList.setSelectionModel(selectionModel,
				DefaultSelectionEventManager.<RequestHistoryItem> createDefaultManager());
		
		historyList.addCellPreviewHandler(new CellPreviewEvent.Handler<RequestHistoryItem>() {

			@Override
			public void onCellPreview(CellPreviewEvent<RequestHistoryItem> preview) {
				NativeEvent evt = preview.getNativeEvent();
				if( evt.getCtrlKey() || evt.getShiftKey() ){
					return;
				}
				if (evt.getType().equals("click")) {
					selectionModel.clear();
				}
			}
		});
		final AsyncDataProvider<RequestHistoryItem> dataProvider = new AsyncDataProvider<RequestHistoryItem>(KEY_PROVIDER) {
			@Override
			protected void onRangeChanged(HasData<RequestHistoryItem> display) {
				Range range = display.getVisibleRange();
				int start = range.getStart();
				int limit = range.getLength();
				if(start < 0) start = 0;
				getHistoryValues(start, limit);
			}
		};
		
		dataProvider.addDataDisplay(historyList);
		pager.setDisplay(historyList);
		
		bodyPanel.add(historyList);
	}
	
	
	
	protected void getHistoryValues(final int start, int limit) {
		List<RequestHistoryItem> response = RequestHistory.getHistory(start, limit);
		historyList.setRowData(start, response);
		historyList.setVisibleRange(start, limit);
	}


	/**
	 * called just after when widget is shown. 
	 */
	@Override
	public void onShow() {
		int size = RequestHistory.size();
		historyList.setRowCount(size);
		
		Range range = historyList.getVisibleRange();
		int start = historyList.getPageStart();
		int end = range.getLength();
		getHistoryValues(start, end);
	}
	/**
	 * Fire restore event from history item.
	 * @param item
	 */
	private void fireHistoryEvent(RequestHistoryItem item){
		HistoryRestoreEvent ev = new HistoryRestoreEvent( item );
		eventBus.fireEventFromSource(ev, HistoryListWidget.class);
	}

}
