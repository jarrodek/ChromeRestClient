package org.rest.client.deprecated;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.rest.client.ui.ImportExportView.Presenter;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.cell.client.Cell.Context;
import com.google.gwt.cell.client.CheckboxCell;
import com.google.gwt.cell.client.DateCell;
import com.google.gwt.cell.client.TextCell;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.DateTimeFormat.PredefinedFormat;
import com.google.gwt.safehtml.shared.SafeHtmlBuilder;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.cellview.client.CellTable;
import com.google.gwt.user.cellview.client.Column;
import com.google.gwt.user.cellview.client.ColumnSortEvent.ListHandler;
import com.google.gwt.user.cellview.client.Header;
import com.google.gwt.user.cellview.client.SimplePager;
import com.google.gwt.user.cellview.client.SimplePager.TextLocation;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.view.client.DefaultSelectionEventManager;
import com.google.gwt.view.client.ListDataProvider;
import com.google.gwt.view.client.MultiSelectionModel;
import com.google.gwt.view.client.ProvidesKey;
import com.google.gwt.view.client.SelectionModel;
/**
 * 
 * @author Paweł Psztyć
 *
 */
public class ImportListingDialog {

	interface Binder extends UiBinder<DialogBox, ImportListingDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField(provided = true)
	CellTable<SuggestionImportItem> cellTable;
	/**
	 * The pager used to change the range of data.
	 */
	@UiField(provided = true) SimplePager pager;
	@UiField DialogBox dialog;
	@UiField Button save;

	private final List<SuggestionImportItem> resultList = new ArrayList<SuggestionImportItem>();
	/**
	 * The key provider that provides the unique ID of a contact.
	 */
	public static final ProvidesKey<SuggestionImportItem> KEY_PROVIDER = new ProvidesKey<SuggestionImportItem>() {
		public Object getKey(SuggestionImportItem item) {
			return item == null ? null : item.getKey();
		}
	};
	/**
	 * The provider that holds the list of contacts in the database.
	 */
	private ListDataProvider<SuggestionImportItem> dataProvider = new ListDataProvider<SuggestionImportItem>();
	private Presenter listener;
	
	public ImportListingDialog(Presenter listener) {
		this.listener = listener; 

		// Set a key provider that provides a unique key for each item.
		cellTable = new CellTable<SuggestionImportItem>(KEY_PROVIDER);
		cellTable.setWidth("100%", true);

		// Attach a column sort handler to the ListDataProvider to sort the
		// list.
		ListHandler<SuggestionImportItem> sortHandler = new ListHandler<SuggestionImportItem>(
				dataProvider.getList());
		cellTable.addColumnSortHandler(sortHandler);

		// Create a Pager to control the table.
		SimplePager.Resources pagerResources = GWT
				.create(SimplePager.Resources.class);
		pager = new SimplePager(TextLocation.CENTER, pagerResources, false, 0,
				true);
		pager.setDisplay(cellTable);

		// Add a selection model so we can select cells.
		final SelectionModel<SuggestionImportItem> selectionModel = new MultiSelectionModel<SuggestionImportItem>(
				KEY_PROVIDER);
		cellTable.setSelectionModel(selectionModel,
				DefaultSelectionEventManager
						.<SuggestionImportItem> createCheckboxManager());
		// Initialize the columns.
		initTableColumns(selectionModel, sortHandler);

		// Add the CellList to the adapter in the database.
		dataProvider.addDataDisplay(cellTable);
		Binder.BINDER.createAndBindUi(this);
		//dialog.setPreviewingAllNativeEvents(true);
		//dialog.setSize("720px", "440px");
	}

	public static class ToggleSelectionCheckboxHeader extends Header<Boolean> {
		private boolean value;
		private TableToggleSelectionValueChange changeValue;
		public ToggleSelectionCheckboxHeader(CheckboxCell cell, TableToggleSelectionValueChange changeValue) {
			super(cell);
			this.changeValue = changeValue;
		}

		@Override
		public Boolean getValue() {
			return value;
		}
		
		@Override
		public void onBrowserEvent(Context context, Element elem,
				NativeEvent event) {
			Event evt = Event.as(event);
			int eventType = evt.getTypeInt();
			switch (eventType) {
			case Event.ONCHANGE:
				value = !value;
				if (changeValue != null)
					changeValue.changedValue(context.getColumn(), value);
				break;
			}
			super.onBrowserEvent(context, elem, event);
		}

		@Override
		public void render(Context context, SafeHtmlBuilder sb) {
			super.render(context, sb.appendEscaped(""));
		}
	}

	public interface TableToggleSelectionValueChange {
		void changedValue(int columnIndex, Boolean value);
	}

	private void initTableColumns(
			final SelectionModel<SuggestionImportItem> selectionModel,
			ListHandler<SuggestionImportItem> sortHandler) {
		// Checkbox column. This table will uses a checkbox column for
		// selection.
		// Alternatively, you can call cellTable.setSelectionEnabled(true) to
		// enable
		// mouse selection.
		
		CheckboxCell cell = new CheckboxCell();
		ToggleSelectionCheckboxHeader checkboxHeader = new ToggleSelectionCheckboxHeader(cell,
				new TableToggleSelectionValueChange() {
			@Override
			public void changedValue(int columnIndex, Boolean value) {
				Log.debug("changedValue");
				List<SuggestionImportItem> list = dataProvider.getList();
				SelectionModel<? super SuggestionImportItem> _selectionModel = cellTable.getSelectionModel();
				for(SuggestionImportItem _item : list){
					_selectionModel.setSelected(_item, value);
				}
				if(value){
					resultList.addAll(list);
				} else {
					resultList.clear();
				}
			}
		});
		
		Column<SuggestionImportItem, Boolean> checkColumn = new Column<SuggestionImportItem, Boolean>(
				new CheckboxCell(true, false)) {
			@Override
			public Boolean getValue(SuggestionImportItem object) {
				// Get the value from the selection model.
				boolean isSelected = selectionModel.isSelected(object);
				if(isSelected){
					if(!resultList.contains(object)){
						resultList.add(object);
					}
				} else {
					if(resultList.contains(object)){
						resultList.remove(object);
					}
				}
				return isSelected;
			}
		};
		cellTable.addColumn(checkColumn,checkboxHeader);
		cellTable.setColumnWidth(checkColumn, 40, Unit.PX);
		// name.
		Column<SuggestionImportItem, String> nameColumn = new Column<SuggestionImportItem, String>(
				new TextCell()) {
			@Override
			public String getValue(SuggestionImportItem object) {
				return object.getName();
			}
		};
		nameColumn.setSortable(true);
		sortHandler.setComparator(nameColumn, new Comparator<SuggestionImportItem>() {
			public int compare(SuggestionImportItem o1, SuggestionImportItem o2) {
				return o1.getName().compareTo(o2.getName());
			}
		});
		cellTable.addColumn(nameColumn, "Name");
		// cellTable.setColumnWidth(nameColumn, 200, Unit.PX);

		// URL column
		Column<SuggestionImportItem, String> urlColumn = new Column<SuggestionImportItem, String>(
				new TextCell()) {
			@Override
			public String getValue(SuggestionImportItem object) {
				return object.getUrl();
			}
		};
		urlColumn.setSortable(true);
		sortHandler.setComparator(urlColumn, new Comparator<SuggestionImportItem>() {
			public int compare(SuggestionImportItem o1, SuggestionImportItem o2) {
				return o1.getUrl().compareTo(o2.getUrl());
			}
		});
		cellTable.addColumn(urlColumn, "URL");
		// cellTable.setColumnWidth(urlColumn, 100, Unit.PX);

		// Date column
		Column<SuggestionImportItem, Date> dateColumn = new Column<SuggestionImportItem, Date>(
				new DateCell(
						DateTimeFormat
								.getFormat(PredefinedFormat.DATE_TIME_MEDIUM))) {
			@Override
			public Date getValue(SuggestionImportItem object) {
				return object.getCreated();
			}
		};
		dateColumn.setSortable(true);
		sortHandler.setComparator(dateColumn, new Comparator<SuggestionImportItem>() {
			public int compare(SuggestionImportItem o1, SuggestionImportItem o2) {
				return o1.getCreated().compareTo(o2.getCreated());
			}
		});
		cellTable.addColumn(dateColumn, "Created");
		cellTable.setColumnWidth(dateColumn, 160, Unit.PX);
	}

	public void append(List<SuggestionImportItem> result) {
		dataProvider.getList().addAll(result);
	}

	public void show() {
		dialog.show();
		dialog.center();
	}

	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		dialog.hide();
	}

	@UiHandler("save")
	void onSave(ClickEvent event) {
		if(resultList.size() == 0){
			StatusNotification.notify("Select at least one element from list.", StatusNotification.TYPE_NORMAL, StatusNotification.TIME_SHORT);
			return;
		}
		int size = resultList.size();
		
		if(size > 30){
			//
			// App Engine supports query with 30 subqueries. In one time can import 30 elements.
			//
			StatusNotification.notify("You can select max 30 items to import", StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
			return;
		}
		
		String[] keys = new String[size];
		for(int i=0; i<size; i++){
			SuggestionImportItem item = resultList.get(i);
			keys[i] = item.getKey();
		}
		dialog.hide();
		listener.doServerImport(keys);
	}
}
