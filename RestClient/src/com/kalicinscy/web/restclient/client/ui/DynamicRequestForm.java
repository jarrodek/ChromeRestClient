package com.kalicinscy.web.restclient.client.ui;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.logical.shared.HasValueChangeHandlers;
import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.event.shared.HasHandlers;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DecoratedPopupPanel;
import com.google.gwt.user.client.ui.FlexTable;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.SuggestBox;
import com.google.gwt.user.client.ui.SuggestOracle;
import com.google.gwt.user.client.ui.SuggestOracle.Suggestion;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;
import com.kalicinscy.web.restclient.client.ConfigInit;
import com.kalicinscy.web.restclient.client.HeadersFillSupport;
import com.kalicinscy.web.restclient.client.storage.HeaderRow;


public class DynamicRequestForm extends FlexTable implements HasHandlers, HasValueChangeHandlers<LinkedHashMap<String, String>>{
	
	private SuggestOracle formOracle = null;
	private HandlerManager handlerManager = new HandlerManager(this);
	
	private int addedByAutofill = 0;
	
	/**
	 * Request to be sent to server. It's contain key - value pairs from form
	 * (request headers, form, values)
	 */
	LinkedHashMap<String, String> formValues = new LinkedHashMap<String, String>();
	
	
	
	public DynamicRequestForm( SuggestOracle oracle ) {
		this();
		this.formOracle = oracle;
	}
	public DynamicRequestForm( ){
		
		setWidth("100%");
		setCellSpacing(2);
		setCellPadding(2);
		
		Button addRowButton = new Button("Add new value", new ClickHandler() {
			public void onClick(ClickEvent event) {
				addFormRow();
			}
		});
		
		
		FlexCellFormatter cellFormatter = getFlexCellFormatter();
		cellFormatter.setHorizontalAlignment(0, 2,
				HasHorizontalAlignment.ALIGN_LEFT);
		setWidget(0, 0, addRowButton);
		cellFormatter.setColSpan(0, 0, 3);
		cellFormatter.setWidth(1, 0, "220px");
		
		Label lblName = new Label("Name");
		setWidget(1, 0, lblName);

		Label lblValue = new Label("Value");
		setWidget(1, 1, lblValue);
	}
	
	protected void addFormRow() {
		addFormRow(null, null);
	}

	private void addFormRow(String key, String value) {
		final int numRows = getRowCount();
		
		SuggestBox textBox = null;
		if( formOracle != null ) {
			textBox = new SuggestBox( formOracle );
		} else {
			textBox = new SuggestBox();
		}
		HTML explLabel = new HTML();
		explLabel.setVisible(false);
		explLabel.setStylePrimaryName("headers-hint-label");
		textBox.setWidth("200px");
		textBox.addSelectionHandler(requestHeaderSuggestionHandler);
		textBox.addValueChangeHandler(requestHeaderChangeHandler);
		textBox.setAutoSelectEnabled(true);
		textBox.setLimit(20);
		if( key != null ){
			textBox.setText(key);
		}

		VerticalPanel vp = new VerticalPanel();
		vp.setWidth("200px");
		vp.add(textBox);
		vp.add(explLabel);

		TextBox valueBox = new TextBox();
		valueBox.setWidth("99%");
		valueBox.addValueChangeHandler(requestHeaderValueChangeHandler);
		if( value != null ){
			valueBox.setText(value);
		}
		Button btnRemove = new Button("Remove");
		btnRemove.addClickHandler(requestHeaderRemoveRowHandler);
		
		setWidget(numRows, 0, vp);
		setWidget(numRows, 1, valueBox);
		setWidget(numRows, 2, btnRemove);
		
		getCellFormatter().setWidth(numRows, 2, "70px");
		
		if( HeadersFillSupport.isSupported(key) ){
			HeadersFillSupport headersSupport = new HeadersFillSupport(key, valueBox);
			headersSupport.addSupport();
		}
		
		FlexCellFormatter formatter = getFlexCellFormatter();

		formatter.setVerticalAlignment(numRows, 1,HasVerticalAlignment.ALIGN_TOP);
		formatter.setVerticalAlignment(numRows, 2,HasVerticalAlignment.ALIGN_TOP);
	}
	
	/**
	 * Search for row index where widget is attached.
	 * 
	 * @param table
	 * @param searchWidget
	 * @return row position (zero based) or -1 if not found
	 */
	private int getRowIndexForWidget(Widget searchWidget) {
		int result = -1;
		int cnt = getRowCount();
		cnt--;
		for (int i = cnt; i >= 0; i--) {
			if (result != -1)
				break;

			int cellCnt = getCellCount(i);
			for (int j = cellCnt; j >= 0; j--) {
				Widget w = null;
				try {
					w = getWidget(i, j);
				} catch (Exception e) {
				}
				if (w != null && w.equals(searchWidget)) {
					result = i;
					break;
				}

			}
		}
		return result;
	}
	
	public void reset(){
		reset(null);
	}
	
	public void reset(LinkedHashMap<String, String> newValues){
		formValues.clear();
		
		while( getRowCount() > 2 ){
			int rows = getRowCount();
			removeRow(rows-1);
		}
		
		
		if( newValues != null ){
			formValues = newValues;
			Set<String> set = newValues.keySet();
			Iterator<String> it = set.iterator();
			while(it.hasNext()){
				String key = it.next();
				String value = newValues.get(key);
				addFormRow(key,value);
			}
		}
	}
	
	private void revalidateRequestHeadersForm() {
		formValues.clear();
		int rows = getRowCount();
		if (rows <= 2) {
			return;
		}
		// start from 3rd row
		for (int i = 2; i < rows; i++) {
			VerticalPanel vp = (VerticalPanel) getWidget(i, 0);
			SuggestBox box = (SuggestBox) vp.getWidget(0);
			String key = box.getValue();
			TextBox valueBox = (TextBox) getWidget(i, 1);
			String value = valueBox.getText();
			formValues.put(key, value);
		}
		notyfiValueChanged();
	}
	
	public HashMap<String, String> getFormValues() {
		return formValues;
	}
	
	
	private void setHeaderHintInfo(final HTML explLabel,String txt){
		if (txt.equals("")) {
			explLabel.setVisible(false);
		} else {
			ConfigInit.HEADERS_SERVICE.getHeader(txt, new ListCallback<HeaderRow>() {
				@Override
				public void onFailure(final DataServiceException error) {
					explLabel.setVisible(false);
				}
				@Override
				public void onSuccess(final List<HeaderRow> result) {
					if( result.size() == 0 ){
						explLabel.setVisible(false);
					} else {
						HeaderRow row = result.get(0);
						String expl = "<span class=\"header-desc\">"+row.getDesc()+"</span><br/><span class=\"header-example\">"+row.getExample()+"</span>";
						
						final DecoratedPopupPanel simplePopup = new DecoratedPopupPanel(true);
					    simplePopup.setWidth("300px");
					    simplePopup.addStyleName("headers-desc-popup");
					    
						explLabel.addClickHandler( new ClickHandler() {
							@Override
							public void onClick(ClickEvent event) {
								HTML source = (HTML) event.getSource();
							    simplePopup.setWidget(new HTML( source.getHTML() ));
							    int left = event.getClientX() + 10;
					            int top = event.getClientY() + 10;
					            simplePopup.setPopupPosition(left, top);
					            simplePopup.show();
							}
						});
						
						explLabel.setHTML(expl);
						explLabel.setVisible(true);
					}
				}
			});
		}
	}
	
	
	private void createHeaderGUI(String header, VerticalPanel widget){
		int i = getRowIndexForWidget(widget);
		Widget w = getWidget(i, 1);
		if( !(w instanceof TextBox ) ) return;
		final TextBox valueBox =  (TextBox) w;
		HeadersFillSupport.removeSupport(valueBox);
		if( HeadersFillSupport.isSupported(header) ){
			HeadersFillSupport headersSupport = new HeadersFillSupport(header, valueBox);
			headersSupport.addSupport();
			//Widget newWidget = headersSupport.construct();
			//clearCell(i, 1);
			//setWidget(i, 1, newWidget);
		}
	}
	
	
	/**
	 * Handler for suggestion select in request headers widgets
	 */
	SelectionHandler<SuggestOracle.Suggestion> requestHeaderSuggestionHandler = new SelectionHandler<SuggestOracle.Suggestion>() {

		@Override
		public void onSelection(SelectionEvent<Suggestion> event) {
			Suggestion s = event.getSelectedItem();
			String txt = s.getReplacementString();
			SuggestBox w = (SuggestBox) event.getSource();
			VerticalPanel vp = (VerticalPanel) w.getParent();
			final HTML explLabel = (HTML) vp.getWidget(1);
			setHeaderHintInfo(explLabel,txt);
			revalidateRequestHeadersForm();
			createHeaderGUI(txt,vp);
		}
	};

	ValueChangeHandler<String> requestHeaderChangeHandler = new ValueChangeHandler<String>() {
		@Override
		public void onValueChange(ValueChangeEvent<String> event) {
			//Log.debug("onValueChange");
			String txt = event.getValue();
			SuggestBox w = (SuggestBox) event.getSource();
			VerticalPanel vp = (VerticalPanel) w.getParent();
			final HTML explLabel = (HTML) vp.getWidget(1);
			setHeaderHintInfo(explLabel,txt);
			revalidateRequestHeadersForm();
			createHeaderGUI(txt,vp);
		}
	};
	ClickHandler requestHeaderRemoveRowHandler = new ClickHandler() {
		@Override
		public void onClick(ClickEvent event) {
			Button button = (Button) event.getSource();
			int pos = getRowIndexForWidget(button);
			if (pos > 0) {
				VerticalPanel vp = (VerticalPanel) getWidget(pos, 0);
				SuggestBox textBox = (SuggestBox) vp.getWidget(0);
				String key = textBox.getValue();
				if (!key.equals("")) {
					if (formValues.containsKey(key)) {
						formValues.remove(key);
						notyfiValueChanged();
					}
				}
				removeRow(pos);
			}
		}
	};
	/**
	 * On change value text box row.
	 */
	ValueChangeHandler<String> requestHeaderValueChangeHandler = new ValueChangeHandler<String>() {

		@Override
		public void onValueChange(ValueChangeEvent<String> event) {
			TextBox valueBox = (TextBox) event.getSource();
			int pos = getRowIndexForWidget(valueBox);
			VerticalPanel vp = (VerticalPanel) getWidget(pos,0);
			SuggestBox textBox = (SuggestBox) vp.getWidget(0);

			String value = valueBox.getValue();
			String key = textBox.getValue();
			if (!key.equals("")) {
				formValues.put(key, value);
				notyfiValueChanged();
			}
		}
	};
	
	
	private void notyfiValueChanged(){
		ValueChangeEvent.fire(this, formValues);
	}
	
	
	@Override
	public void fireEvent(GwtEvent<?> event) {
		handlerManager.fireEvent(event);
	}
	
	@Override
	public HandlerRegistration addValueChangeHandler(
			ValueChangeHandler<LinkedHashMap<String, String>> handler) {
		return handlerManager.addHandler( ValueChangeEvent.getType(), handler );
	}

	public void setData(LinkedHashMap<String, String> currentHeaders) {
		this.formValues = currentHeaders;
		addedByAutofill = currentHeaders.size();
		Set<String> set = currentHeaders.keySet();
		Iterator<String> it = set.iterator();
		while(it.hasNext()){
			String key = it.next();
			String value = currentHeaders.get(key);
			addFormRow(key,value);
		}
	}
	/**
	 * Add empty start rows.
	 * 
	 * @param cnt
	 */
	public void addRows(int cnt) {
		int len = cnt - addedByAutofill;
		for( int i=0; i<len; i++ ){
			addFormRow();
		}
		addedByAutofill = 0;
	}
	/**
	 * Add row to form without firing any callback actions
	 * @param key
	 * @param value
	 */
	public void addRowData(String key, String value){
		this.formValues.put(key, value);
		addFormRow(key, value);
	}
}
