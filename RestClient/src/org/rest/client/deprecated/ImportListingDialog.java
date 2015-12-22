package org.rest.client.deprecated;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.rest.client.StatusNotification;
import org.rest.client.request.RequestImportListItem;
import org.rest.client.ui.ImportExportView.Presenter;

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
	CellTable<RequestImportListItem> cellTable;
	/**
	 * The pager used to change the range of data.
	 */
	@UiField(provided = true)
	SimplePager pager;
	@UiField
	DialogBox dialog;
	@UiField
	Button save;

	private final List<RequestImportListItem> resultList = new ArrayList<RequestImportListItem>();
	/**
	 * The key provider that provides the unique ID of a contact.
	 */
	public static final ProvidesKey<RequestImportListItem> KEY_PROVIDER = new ProvidesKey<RequestImportListItem>() {
		public Object getKey(RequestImportListItem item) {
			return item == null ? null : item.getKey();
		}
	};
	/**
	 * The provider that holds the list of contacts in the database.
	 */
	private ListDataProvider<RequestImportListItem> dataProvider = new ListDataProvider<RequestImportListItem>();
	private Presenter listener;

	public ImportListingDialog(Presenter listener) {
		this.listener = listener;

		// Set a key provider that provides a unique key for each item.
		cellTable = new CellTable<RequestImportListItem>(KEY_PROVIDER);
		cellTable.setWidth("100%", true);

		// Attach a column sort handler to the ListDataProvider to sort the
		// list.
		ListHandler<RequestImportListItem> sortHandler = new ListHandler<RequestImportListItem>(dataProvider.getList());
		cellTable.addColumnSortHandler(sortHandler);

		// Create a Pager to control the table.
		SimplePager.Resources pagerResources = GWT.create(SimplePager.Resources.class);
		pager = new SimplePager(TextLocation.CENTER, pagerResources, false, 0, true);
		pager.setDisplay(cellTable);

		// Add a selection model so we can select cells.
		final SelectionModel<RequestImportListItem> selectionModel = new MultiSelectionModel<RequestImportListItem>(
				KEY_PROVIDER);
		cellTable.setSelectionModel(selectionModel,
				DefaultSelectionEventManager.<RequestImportListItem> createCheckboxManager());
		// Initialize the columns.
		initTableColumns(selectionModel, sortHandler);

		// Add the CellList to the adapter in the database.
		dataProvider.addDataDisplay(cellTable);
		Binder.BINDER.createAndBindUi(this);
		// dialog.setPreviewingAllNativeEvents(true);
		// dialog.setSize("720px", "440px");
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
		public void onBrowserEvent(Context context, Element elem, NativeEvent event) {
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

	private void initTableColumns(final SelectionModel<RequestImportListItem> selectionModel,
			ListHandler<RequestImportListItem> sortHandler) {
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
						List<RequestImportListItem> list = dataProvider.getList();
						SelectionModel<? super RequestImportListItem> _selectionModel = cellTable.getSelectionModel();
						for (RequestImportListItem _item : list) {
							_selectionModel.setSelected(_item, value);
						}
						if (value) {
							resultList.addAll(list);
						} else {
							resultList.clear();
						}
					}
				});

		Column<RequestImportListItem, Boolean> checkColumn = new Column<RequestImportListItem, Boolean>(
				new CheckboxCell(true, false)) {
			@Override
			public Boolean getValue(RequestImportListItem object) {
				// Get the value from the selection model.
				boolean isSelected = selectionModel.isSelected(object);
				if (isSelected) {
					if (!resultList.contains(object)) {
						resultList.add(object);
					}
				} else {
					if (resultList.contains(object)) {
						resultList.remove(object);
					}
				}
				return isSelected;
			}
		};
		cellTable.addColumn(checkColumn, checkboxHeader);
		cellTable.setColumnWidth(checkColumn, 40, Unit.PX);
		// name.
		Column<RequestImportListItem, String> nameColumn = new Column<RequestImportListItem, String>(new TextCell()) {
			@Override
			public String getValue(RequestImportListItem object) {
				return object.getName();
			}
		};
		nameColumn.setSortable(true);
		sortHandler.setComparator(nameColumn, new Comparator<RequestImportListItem>() {
			public int compare(RequestImportListItem o1, RequestImportListItem o2) {
				return o1.getName().compareTo(o2.getName());
			}
		});
		cellTable.addColumn(nameColumn, "Name");
		// cellTable.setColumnWidth(nameColumn, 200, Unit.PX);

		// URL column
		Column<RequestImportListItem, String> urlColumn = new Column<RequestImportListItem, String>(new TextCell()) {
			@Override
			public String getValue(RequestImportListItem object) {
				return object.getUrl();
			}
		};
		urlColumn.setSortable(true);
		sortHandler.setComparator(urlColumn, new Comparator<RequestImportListItem>() {
			public int compare(RequestImportListItem o1, RequestImportListItem o2) {
				return o1.getUrl().compareTo(o2.getUrl());
			}
		});
		cellTable.addColumn(urlColumn, "URL");
		// cellTable.setColumnWidth(urlColumn, 100, Unit.PX);

		// Date column
		Column<RequestImportListItem, Date> dateColumn = new Column<RequestImportListItem, Date>(
				new DateCell(DateTimeFormat.getFormat(PredefinedFormat.DATE_TIME_MEDIUM))) {
			@Override
			public Date getValue(RequestImportListItem object) {
				return object.getCreated();
			}
		};
		dateColumn.setSortable(true);
		sortHandler.setComparator(dateColumn, new Comparator<RequestImportListItem>() {
			public int compare(RequestImportListItem o1, RequestImportListItem o2) {
				return o1.getCreated().compareTo(o2.getCreated());
			}
		});
		cellTable.addColumn(dateColumn, "Created");
		cellTable.setColumnWidth(dateColumn, 160, Unit.PX);
	}

	public void append(List<RequestImportListItem> result) {
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
		if (resultList.size() == 0) {
			StatusNotification.notify("Select at least one element from list.", StatusNotification.TIME_SHORT);
			return;
		}
		int size = resultList.size();

		if (size > 30) {
			//
			// App Engine supports query with 30 subqueries. In one time can
			// import 30 elements.
			//
			StatusNotification.notify("You can select max 30 items to import", StatusNotification.TIME_SHORT);
			return;
		}

		String[] keys = new String[size];
		for (int i = 0; i < size; i++) {
			RequestImportListItem item = resultList.get(i);
			keys[i] = item.getKey();
		}
		dialog.hide();
		listener.doServerImport(keys);
	}
}
