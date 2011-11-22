package com.restclient.client.widgets;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import com.google.gwt.cell.client.CheckboxCell;
import com.google.gwt.cell.client.TextCell;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.DateTimeFormat.PredefinedFormat;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.cellview.client.CellTable;
import com.google.gwt.user.cellview.client.Column;
import com.google.gwt.user.cellview.client.ColumnSortEvent.ListHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.view.client.ListDataProvider;
import com.google.gwt.view.client.NoSelectionModel;
import com.restclient.client.chrome.ChromeCookie;
/**
 * Table with HTTP cookies data.
 * 
 * @author Paweł Psztyć
 *
 */
public class CookiesTable extends Composite {

	private static CookiesTableUiBinder uiBinder = GWT
			.create(CookiesTableUiBinder.class);

	interface CookiesTableUiBinder extends UiBinder<Widget, CookiesTable> {
	}
	
	private ListDataProvider<ChromeCookie> provider;
	
	@UiField(provided=true) CellTable<ChromeCookie> table;
	/**
	 * Create new cookies data
	 * @param list
	 */
	public CookiesTable(List<ChromeCookie> list) {
		
		provider = new ListDataProvider<ChromeCookie>();
		table = new CellTable<ChromeCookie>( provider.getKeyProvider() );
		
		String data = "<p class=\"note\">";
		data += "No cookies has been captured during request.<br/>";
		data += "</p>";
		HTML info = new HTML(data);
		
		table.setEmptyTableWidget(info);
		provider.addDataDisplay(table);
		provider.setList(list);
		table.setRowCount(list.size(), true);
		
		table.setWidth("100%");
		ListHandler<ChromeCookie> sortHandler = new ListHandler<ChromeCookie>( provider.getList() );
		table.addColumnSortHandler(sortHandler);
		table.setSelectionModel(new NoSelectionModel<ChromeCookie>());
		
		initWidget(uiBinder.createAndBindUi(this));
		initTableColumns(sortHandler);
	}
	/**
	 * Clear cookies list
	 */
	public void clearTable(){
		provider.setList( new ArrayList<ChromeCookie>() );
	}
	/**
	 * Reset cookie table data with new cookie list
	 * @param list
	 */
	public void loadTableData(List<ChromeCookie> list){
		provider.setList(list);
		
	}
	
	private void initTableColumns(ListHandler<ChromeCookie> sortHandler){
		
		Column<ChromeCookie, String> nameColumn = new Column<ChromeCookie, String>(new TextCell()) {
			@Override
			public String getValue(ChromeCookie object) {
				if( object == null ) return null;
				return object.getName();
			}
		};
		nameColumn.setSortable(true);
		table.addColumn(nameColumn,"Name");
		sortHandler.setComparator(nameColumn, new Comparator<ChromeCookie>() {
			@Override
			public int compare(ChromeCookie o1, ChromeCookie o2) {
				return o1.getName().compareTo(o2.getName());
			}
		});
		
		
		Column<ChromeCookie, String> valueColumn = new Column<ChromeCookie, String>(new TextCell()) {
			@Override
			public String getValue(ChromeCookie object) {
				if( object == null ) return null;
				return object.getValue();
			}
		};
		valueColumn.setSortable(true);
		table.addColumn(valueColumn,"Value");
		sortHandler.setComparator(valueColumn, new Comparator<ChromeCookie>() {
			@Override
			public int compare(ChromeCookie o1, ChromeCookie o2) {
				return o1.getValue().compareTo(o2.getValue());
			}
		});
		
		
		
		Column<ChromeCookie, String> domainColumn = new Column<ChromeCookie, String>(new TextCell()) {
			@Override
			public String getValue(ChromeCookie object) {
				if( object == null ) return null;
				return object.getDomain();
			}
		};
		domainColumn.setSortable(true);
		table.addColumn(domainColumn, "Domain");
		sortHandler.setComparator(domainColumn, new Comparator<ChromeCookie>() {
			@Override
			public int compare(ChromeCookie o1, ChromeCookie o2) {
				return o1.getDomain().compareTo(o2.getDomain());
			}
		});
		
		
		
		Column<ChromeCookie, String> pathColumn = new Column<ChromeCookie, String>(new TextCell()) {
			@Override
			public String getValue(ChromeCookie object) {
				if( object == null ) return null;
				return object.getPath();
			}
		};
		pathColumn.setSortable(true);
		table.addColumn(pathColumn, "Path");
		sortHandler.setComparator(pathColumn, new Comparator<ChromeCookie>() {
			@Override
			public int compare(ChromeCookie o1, ChromeCookie o2) {
				return o1.getPath().compareTo(o2.getPath());
			}
		});
		
		
		
		Column<ChromeCookie, String> expiresColumn = new Column<ChromeCookie, String>(new TextCell()) {
			@Override
			public String getValue(ChromeCookie object) {
				if( object == null ) return null;
				Long exp = object.getExpirationDate();
				if(exp == null || exp == 0){
					if( object.isSession() )
						return "Session";
					return null;
				} else if( exp < 0 ){
					return "Expired";
				}
				Date d = new Date(exp);
				return DateTimeFormat.getFormat(PredefinedFormat.DATE_TIME_SHORT).format(d);
			}
		};
		expiresColumn.setSortable(true);
		table.addColumn(expiresColumn,"Expires");
		sortHandler.setComparator(expiresColumn, new Comparator<ChromeCookie>() {
			@Override
			public int compare(ChromeCookie o1, ChromeCookie o2) {
				if( o1 == null || o1.getExpirationDate() == null ) return -1;
				if( o2 == null || o2.getExpirationDate() == null ) return 1;
				return o1.getExpirationDate().compareTo(o2.getExpirationDate());
			}
		});
		
		
		
		
		Column<ChromeCookie, Boolean> httpColumn = new Column<ChromeCookie, Boolean>(new CheckboxCell(false, false)) {
			@Override
			public Boolean getValue(ChromeCookie object) {
				if( object == null ) return false;
				return object.isHttpOnly();
			}
		};
		httpColumn.setSortable(true);
		
		table.addColumn(httpColumn,"HTTP");
		sortHandler.setComparator(httpColumn, new Comparator<ChromeCookie>() {
			@Override
			public int compare(ChromeCookie o1, ChromeCookie o2) {
				
				if( o1 == null ) return -1;
				if( o2 == null ) return 1;
				Boolean b1 = new Boolean(o1.isHttpOnly());
				Boolean b2 = new Boolean(o2.isHttpOnly());
				return b1.compareTo(b2);
			}
		});
		
		
		
		
		
		Column<ChromeCookie, Boolean> secureColumn = new Column<ChromeCookie, Boolean>(new CheckboxCell(false, false)) {
			@Override
			public Boolean getValue(ChromeCookie object) {
				if( object == null ) return false;
				return object.isSecure();
			}
		};
		secureColumn.setSortable(true);
		table.addColumn(secureColumn,"Secure");
		sortHandler.setComparator(secureColumn, new Comparator<ChromeCookie>() {
			@Override
			public int compare(ChromeCookie o1, ChromeCookie o2) {
				if( o1 == null ) return -1;
				if( o2 == null ) return 1;
				Boolean b1 = new Boolean(o1.isSecure());
				Boolean b2 = new Boolean(o2.isSecure());
				return b1.compareTo(b2);
			}
		});
		table.setColumnWidth(httpColumn, 65.0, Unit.PX);
		table.setColumnWidth(secureColumn, 65.0, Unit.PX);
	}
}
