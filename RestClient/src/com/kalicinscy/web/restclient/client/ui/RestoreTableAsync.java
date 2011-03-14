package com.kalicinscy.web.restclient.client.ui;

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
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.DateTimeFormat.PredefinedFormat;
import com.google.gwt.safehtml.shared.SafeHtml;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
import com.google.gwt.text.shared.SafeHtmlRenderer;
import com.google.gwt.user.cellview.client.CellTable;
import com.google.gwt.user.cellview.client.Column;
import com.google.gwt.user.cellview.client.ColumnSortEvent.ListHandler;
import com.google.gwt.user.cellview.client.HasKeyboardPagingPolicy.KeyboardPagingPolicy;
import com.google.gwt.user.cellview.client.SimplePager;
import com.google.gwt.user.cellview.client.SimplePager.TextLocation;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.view.client.DefaultSelectionEventManager;
import com.google.gwt.view.client.ListDataProvider;
import com.google.gwt.view.client.SelectionModel;
import com.google.gwt.view.client.SingleSelectionModel;
import com.kalicinscy.web.restclient.client.ConfigInit;
import com.kalicinscy.web.restclient.client.storage.RestForm;
import com.kalicinscy.web.restclient.client.storage.RestFormJS;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;

public class RestoreTableAsync extends Composite {
	
	public interface SelectionHandler {
		void onSelect(RestForm data);
	}
	
	private SelectionHandler currentHandler;
	/**
	 * The main CellTable.
	 */
	CellTable<RestForm> cellTable;
	/**
	 * The provider that holds the list of contacts in the database.
	 */
	private ListDataProvider<RestForm> dataProvider;
	private VerticalPanel wrapper;

	public RestoreTableAsync() {
		wrapper = new VerticalPanel();
		wrapper.setSize("100%", "100%");
		Progress progress = new Progress();
		wrapper.add( progress );
		wrapper.setCellVerticalAlignment(progress, HasVerticalAlignment.ALIGN_MIDDLE);
		wrapper.setCellHorizontalAlignment(progress, HasHorizontalAlignment.ALIGN_CENTER);
		
		initWidget(wrapper);
		
		ConfigInit.FORM_SERVICE.getAllData(new ListCallback<RestFormJS>() {
			@Override
			public void onFailure(DataServiceException error) {
				Window.alert("An error occured :(");
				Log.error("error get data from form servide (getAllData", error);
			}

			@Override
			public void onSuccess(List<RestFormJS> result) {
				List<RestForm> list = new ArrayList<RestForm>();
				for (RestFormJS data : result) {
					RestForm row = new RestForm();
					row.setData(data.getData());
					row.setId(data.getId());
					row.setName(data.getName());
					row.setTime(data.getTime());
					row.setUrl(data.getUrl());
					list.add(row);
				}
				if( list.size() > 0 ){
					createTable(list);
				} else {
					emptyInfo();
				}
			}
		});

	}
	
	private void emptyInfo(){
		HTML info = new HTML("<p style=\"text-align:center;\"><em>You do not have any saved configs.</em></p>");
		wrapper.clear();
		wrapper.add(info);
	}
	
	private void createTable(List<RestForm> list) {
		dataProvider = new ListDataProvider<RestForm>(list);
		cellTable = new CellTable<RestForm>(dataProvider.getKeyProvider());
		cellTable.setPageSize(7);
		cellTable.setWidth("100%", true);
		cellTable.setRowCount(dataProvider.getList().size(), true);
		ListHandler<RestForm> sortHandler = new ListHandler<RestForm>(
				dataProvider.getList());
		cellTable.addColumnSortHandler(sortHandler);
		final SelectionModel<RestForm> selectionModel = new SingleSelectionModel<RestForm>(
				dataProvider.getKeyProvider());
		cellTable.setSelectionModel(selectionModel,
				DefaultSelectionEventManager.<RestForm> createDefaultManager());
		initTableColumns(selectionModel, sortHandler);
		dataProvider.addDataDisplay(cellTable);
		
		SimplePager.Resources pagerResources = GWT
				.create(SimplePager.Resources.class);
		SimplePager pager = new SimplePager(TextLocation.CENTER,
				pagerResources, false, 0, true);
		pager.setDisplay(cellTable);
		cellTable.setKeyboardPagingPolicy(KeyboardPagingPolicy.CHANGE_PAGE);
		wrapper.clear();
		wrapper.add(cellTable);
		wrapper.add(pager);
		wrapper.setCellVerticalAlignment(pager, HasVerticalAlignment.ALIGN_MIDDLE);
		wrapper.setCellHorizontalAlignment(pager, HasHorizontalAlignment.ALIGN_CENTER);
	}

	private void initTableColumns(SelectionModel<RestForm> selectionModel,
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
				return o1.getName().compareTo(o2.getName());
			}
		});
		cellTable.addColumn(nameColumn, "Name");
		nameColumn.setFieldUpdater(new FieldUpdater<RestForm, String>() {
			@Override
			public void update(int index, RestForm object, String value) {
				object.setName(value);
				ConfigInit.FORM_SERVICE.updateItemName(object.getId(), value,
					new VoidCallback() {
						@Override
						public void onFailure(DataServiceException error) {
						}

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
						+ safeValue.asString() + "\">");
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
				return o1.getUrl().compareTo(o2.getUrl());
			}
		});

		cellTable.addColumn(urlColumn, "URL");
		cellTable.setColumnWidth(urlColumn, 230, Unit.PX);

		// time
		DateTimeFormat format = DateTimeFormat
				.getFormat(PredefinedFormat.DATE_TIME_SHORT);
		Column<RestForm, Date> timeColumn = new Column<RestForm, Date>(
				new DateCell(format)) {
			@Override
			public Date getValue(RestForm object) {
				long time = object.getTime();
				long ltime = Long.parseLong(String.valueOf(time));
				return new Date(ltime);
			}
		};
		timeColumn.setSortable(true);
		sortHandler.setComparator(timeColumn, new Comparator<RestForm>() {
			@Override
			public int compare(RestForm o1, RestForm o2) {
				double t1 = o1.getTime();
				double t2 = o2.getTime();
				if (t1 > t2) {
					return 1;
				}
				if (t1 < t2) {
					return -1;
				}
				return 0;
			}
		});
		cellTable.addColumn(timeColumn, "Add date");
		cellTable.setColumnWidth(timeColumn, 135, Unit.PX);
		// select button
		Column<RestForm, String> selectColumn = new Column<RestForm, String>(
				new ButtonCell()) {
			@Override
			public String getValue(RestForm object) {
				return "Select";
			}
		};
		selectColumn.setSortable(false);
		cellTable.addColumn(selectColumn);
		selectColumn.setFieldUpdater(new FieldUpdater<RestForm, String>() {
			@Override
			public void update(int index, RestForm object, String value) {
				if( currentHandler != null ){
					currentHandler.onSelect(object);
				}
			}
		});
		cellTable.setColumnWidth(selectColumn, 85, Unit.PX);
		
		//delete row
		Column<RestForm, String> deleteColumn = new Column<RestForm, String>(new ButtonCell()){
			@Override
			public String getValue(RestForm object) {
				return "delete";
			}
		};
		deleteColumn.setSortable(false);
		cellTable.addColumn(deleteColumn, "Actions");
		deleteColumn.setFieldUpdater(new FieldUpdater<RestForm, String>() {
			@Override
			public void update(final int index, final RestForm object, final String value) {
				
				if(Window.confirm("Do you really want to remove this item?")){
					
					ConfigInit.FORM_SERVICE.deleteItem(object.getId(), new VoidCallback() {
						
						@Override
						public void onFailure(DataServiceException error) {
							Window.alert("Error to remove :( \n"+error.getMessage());
						}
						
						@Override
						public void onSuccess() {
							dataProvider.getList().remove(index);
						}
					});
				}
			}
		});
		cellTable.setColumnWidth(deleteColumn, 90, Unit.PX);
	}
	
	public void addSelectionHandler( SelectionHandler handler ){
		currentHandler = handler;
	}
}
