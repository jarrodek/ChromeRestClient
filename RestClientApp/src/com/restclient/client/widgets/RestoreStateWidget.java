package com.restclient.client.widgets;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.cell.client.ButtonCell;
import com.google.gwt.cell.client.DateCell;
import com.google.gwt.cell.client.EditTextCell;
import com.google.gwt.cell.client.FieldUpdater;
import com.google.gwt.cell.client.TextCell;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.DateTimeFormat.PredefinedFormat;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.text.shared.SafeHtmlRenderer;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.cellview.client.CellTable;
import com.google.gwt.user.cellview.client.Column;
import com.google.gwt.user.cellview.client.ColumnSortEvent.ListHandler;
import com.google.gwt.user.cellview.client.HasKeyboardPagingPolicy.KeyboardPagingPolicy;
import com.google.gwt.user.cellview.client.SimplePager;
import com.google.gwt.user.cellview.client.SimplePager.TextLocation;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.view.client.DefaultSelectionEventManager;
import com.google.gwt.view.client.ListDataProvider;
import com.google.gwt.view.client.SelectionModel;
import com.google.gwt.view.client.SingleSelectionModel;
import com.restclient.client.RestApp;
import com.restclient.client.StatusNotification;
import com.restclient.client.event.FormStateRemoveEvent;
import com.restclient.client.event.RestoreRequestEvent;
import com.restclient.client.request.ImportDataCallback;
import com.restclient.client.request.ImportRequest;
import com.restclient.client.storage.RestForm;
import com.restclient.client.storage.RestFormJS;

@SuppressWarnings("javadoc")
public class RestoreStateWidget extends Composite implements SubpageWidget {

	interface Binder extends UiBinder<Widget, RestoreStateWidget> {}
	
	@UiField(provided=true) CellTable<RestForm> table;
	@UiField(provided=true) SimplePager pager;
	@UiField HTMLPanel tableContainer;
	@UiField TextBox openKey;
	@UiField Button appImport;
	
	private ListDataProvider<RestForm> provider;
	private SelectionModel<RestForm> selectionModel = null;
	private EventBus eventBus;
	
	public RestoreStateWidget(EventBus eventBus) {
		this.eventBus = eventBus;
		
		SimplePager.Resources pagerResources = GWT.create(SimplePager.Resources.class);
		provider = new ListDataProvider<RestForm>();
		table = new CellTable<RestForm>(provider.getKeyProvider());
		pager = new SimplePager(TextLocation.CENTER,pagerResources, false, 0, true);
		
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		String data = "<p class=\"note\">";
		data += "You do not have saved requests.<br/>";
		data += "When ready press CTRL + S to save current request state. Press CTRL + O to restore.";
		data += "</p>";
		HTML info = new HTML(data);
		
		table.setEmptyTableWidget(info);
		pager.setDisplay(table);
		table.setKeyboardPagingPolicy(KeyboardPagingPolicy.CHANGE_PAGE);
		
		selectionModel = new SingleSelectionModel<RestForm>(provider.getKeyProvider());
		table.setSelectionModel(selectionModel, DefaultSelectionEventManager.<RestForm> createDefaultManager());
		provider.addDataDisplay(table);
		ListHandler<RestForm> sortHandler = new ListHandler<RestForm>(provider.getList());
		table.addColumnSortHandler(sortHandler);
		initTableColumns(selectionModel, sortHandler);
	}
	
	@Override
	public void onShow() {
		getData();
	}
	
	public void addRow(RestForm row){
		List<RestForm> list = provider.getList();
		list.add(row);
		provider.setList(list);
		table.redraw();
	}
	
	public void getData(){
		
		RestApp.FORM_SERVICE.getAllData(new ListCallback<RestFormJS>() {
			@Override
			public void onFailure(DataServiceException error) {
				if( RestApp.isDebug() ){
					Log.error("error get data from form service (getAllData)", error);
				}
			}
			@Override
			public void onSuccess(List<RestFormJS> result) {
				List<RestForm> list = new ArrayList<RestForm>();
				for (RestFormJS data : result) {
					if(data == null) continue;
					RestForm row = new RestForm();
					row.setData(data.getData());
					row.setId(data.getId());
					row.setName(data.getName());
					row.setTime(data.getTime());
					row.setUrl(data.getUrl());
					list.add(row);
				}
				provider.setList(list);
			}
		});
	}
	
	private void initTableColumns(SelectionModel<RestForm> selectionModel2,
			ListHandler<RestForm> sortHandler) {
		
		// name
		Column<RestForm, String> nameColumn = new Column<RestForm, String>(
				new EditTextCell()) {
			@Override
			public String getValue(RestForm object) {
				return object.getName();
			}
		};
		nameColumn.setSortable(true);
		sortHandler.setComparator(nameColumn, new Comparator<RestForm>() {
			@Override
			public int compare(RestForm o1, RestForm o2) {
				if(o1 == null || o1.getName() == null){
					return -1;
				}
				if(o2 == null || o2.getName() == null) {
					return 1;
				}
				return o1.getName().compareTo(o2.getName());
			}
		});
		table.addColumn(nameColumn, "Name");
		nameColumn.setFieldUpdater(new FieldUpdater<RestForm, String>() {
			@Override
			public void update(int index, RestForm object, String value) {
				object.setName(value);
				RestApp.FORM_SERVICE.updateItemName(object.getId(), value,
					new VoidCallback() {
						@Override
						public void onFailure(DataServiceException error) {}
						@Override
						public void onSuccess() {
						}
					});
			}
		});
		SafeHtmlRenderer<String> urlColumnRenderer = new SafeHtmlRenderer<String>() {
			@Override
			public void render(String value, SafeHtmlBuilder builder) {
				if (value == null) {
					return;
				}
				builder.appendHtmlConstant("<div style='color:red;'>");
				SafeHtml safeValue = SafeHtmlUtils.fromString("bbb" + value);
				builder.append(safeValue);
				builder.appendHtmlConstant("</div>");
			}

			@Override
			public SafeHtml render(String value) {
				if (value == null) {
					return null;
				}
				SafeHtml safeValue = SafeHtmlUtils.fromString(value);
				SafeHtmlBuilder b = new SafeHtmlBuilder();
				b.appendHtmlConstant("<div class=\"url-column-restore\"><a href=\""
						+ safeValue.asString() + "\" target=\"blank\">");
				b.append(safeValue);
				b.appendHtmlConstant("</a></div>");
				return b.toSafeHtml();
			}
		};

		// url
		Column<RestForm, String> urlColumn = new Column<RestForm, String>(
				new TextCell(urlColumnRenderer)) {
			@Override
			public String getValue(RestForm object) {
				return object.getUrl();
			}
		};
		urlColumn.setSortable(true);
		sortHandler.setComparator(urlColumn, new Comparator<RestForm>() {
			@Override
			public int compare(RestForm o1, RestForm o2) {
				if(o1 == null || o1.getUrl() == null){
					return -1;
				}
				if(o2 == null || o2.getUrl() == null) {
					return 1;
				}
				return o1.getUrl().compareTo(o2.getUrl());
			}
		});

		table.addColumn(urlColumn, "URL");
		table.setColumnWidth(urlColumn, 40, Unit.PCT);

		// time
		DateTimeFormat format = DateTimeFormat
				.getFormat(PredefinedFormat.DATE_TIME_SHORT);
		Column<RestForm, Date> timeColumn = new Column<RestForm, Date>(
				new DateCell(format)) {
			@Override
			public Date getValue(RestForm object) {
				Long time = object.getTime();
				if(time == null){
					return null;
				}
				return new Date(time);
			}
		};
		timeColumn.setSortable(true);
		sortHandler.setComparator(timeColumn, new Comparator<RestForm>() {
			@Override
			public int compare(RestForm o1, RestForm o2) {
				if(o1 == null || o1.getTime() == null){
					return -1;
				}
				if(o2 == null || o2.getTime() == null) {
					return 1;
				}
				return o1.getTime().compareTo(o2.getTime());
			}
		});
		table.addColumn(timeColumn, "Add date");
		table.setColumnWidth(timeColumn, 135, Unit.PX);
		// select button
		Column<RestForm, String> selectColumn = new Column<RestForm, String>(
				new ButtonCell()) {
			@Override
			public String getValue(RestForm object) {
				return "select";
			}
		};
		selectColumn.setSortable(false);
		table.addColumn(selectColumn);
		selectColumn.setFieldUpdater(new FieldUpdater<RestForm, String>() {
			@Override
			public void update(int index, RestForm object, String value) {
				eventBus.fireEventFromSource(new RestoreRequestEvent(object) , RestoreStateWidget.class);
			}
		});
		table.setColumnWidth(selectColumn, 85, Unit.PX);
		
		//delete row
		Column<RestForm, String> deleteColumn = new Column<RestForm, String>(new ButtonCell()){
			@Override
			public String getValue(RestForm object) {
				return "delete";
			}
		};
		deleteColumn.setSortable(false);
		table.addColumn(deleteColumn, "Actions");
		deleteColumn.setFieldUpdater(new FieldUpdater<RestForm, String>() {
			@Override
			public void update(final int index, final RestForm object, final String value) {
				if(Window.confirm("Do you really want to remove this item?")){
					final int removeId = object.getId();
					RestApp.FORM_SERVICE.deleteItem(removeId, new VoidCallback() {
						@Override
						public void onFailure(DataServiceException error) {
							Window.alert("Error to remove :( \n"+error.getMessage());
						}
						@Override
						public void onSuccess() {
							if(RestApp.isDebug()){
								Log.debug("Saved item has been removed.");
							}
							provider.getList().remove(index);
							eventBus.fireEvent(new FormStateRemoveEvent(removeId));
						}
					});
				}
			}
		});
		table.setColumnWidth(deleteColumn, 90, Unit.PX);
		
		//share row
		Column<RestForm, String> shareColumn = new Column<RestForm, String>(new ButtonCell()){
			@Override
			public String getValue(RestForm object) {
				return "share";
			}
		};
		shareColumn.setSortable(false);
		shareColumn.setFieldUpdater(new FieldUpdater<RestForm, String>() {
			@Override
			public void update(final int index, final RestForm object, final String value) {
				ShareItemDialog dialog = new ShareItemDialog(object);
				dialog.show();
			}
		});
		table.addColumn(shareColumn);
		table.setColumnWidth(shareColumn, 70, Unit.PX);
	}
	
	@UiHandler("appImport")
	void onImport(ClickEvent e){
		
		String key = openKey.getValue();
		if(key == null || key.trim().equals("")){
			openKey.getElement().focus();
			return;
		}
		
		openKey.setEnabled(false);
		appImport.setEnabled(false);
		
		ImportRequest.importData(new String[]{key}, new ImportDataCallback() {
			
			@Override
			public void onSuccess(List<RestForm> result) {
				openKey.setEnabled(true);
				appImport.setEnabled(true);
				if(result.size() == 0){
					StatusNotification.notify("An error occured. Please, try again later.");
					return;
				}
				eventBus.fireEventFromSource(new RestoreRequestEvent(result.get(0)), RestoreStateWidget.class);
			}
			
			@Override
			public void onFailure(String message, Throwable exception) {
				openKey.setEnabled(true);
				appImport.setEnabled(true);
				StatusNotification.notify("An error occured. Please, try again later.");
			}
		});
		
	}
}
