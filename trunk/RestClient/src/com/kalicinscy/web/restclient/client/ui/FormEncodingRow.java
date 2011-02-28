package com.kalicinscy.web.restclient.client.ui;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.PopupPanel;
import com.kalicinscy.web.restclient.client.RestClient;
import com.kalicinscy.web.restclient.client.storage.LocalStorage;
import com.google.gwt.user.client.ui.HorizontalPanel;

public class FormEncodingRow extends Composite implements ChangeHandler{
	
	private final List<String> encodings;
	private ListBox dataEncoding;
	
	public FormEncodingRow() {
		
		HorizontalPanel horizontalPanel = new HorizontalPanel();
		
		encodings = new ArrayList<String>();
		encodings.add("Add new");
		encodings.add("application/x-www-form-urlencoded");
		encodings.add("multipart/form-data");
		this.restore();
		
		String enc = RestClient.REST_PARAMS.getFormEncoding();
		int selectedItem = 1;
		
		dataEncoding = new ListBox();
		Iterator<String> it = encodings.iterator();
		int i = 0;
		while( it.hasNext() ){
			String v = it.next();
			dataEncoding.addItem( v );
			if( v.equals(enc) ){
				selectedItem = i;
			}
			i++;
		}
		
		dataEncoding.setSelectedIndex(selectedItem);
		dataEncoding.setVisibleItemCount(1);
		dataEncoding.addChangeHandler(this);
		dataEncoding.setStylePrimaryName("encSelect");
		
		horizontalPanel.add(dataEncoding);
		
		initWidget(horizontalPanel);
	}
	
	/**
	 * Restore user defined encodings from Storage
	 * and put it to main encoding list.
	 */
	private void restore() {
		String data = LocalStorage.getValue("user-encodings");
		if(data == null) {
			return;
		}
		JSONValue value = JSONParser.parseLenient(data);
		JSONArray obj = value.isArray();
		if(obj==null) {
			return;
		}
		if(obj != null) {
			int cnt = obj.size();
			for( int i = 0; i<cnt; i++ ){
				JSONValue _tmp = obj.get(i);
				if( _tmp == null ){
					continue;
				}
				JSONString _data = _tmp.isString();
				if( _data == null ){
					continue;
				}
				String encoding = _data.stringValue();
				encodings.add(encoding);
			}
			
		}
	}
	private void store(){
		int cnt = encodings.size();
		JSONArray data = new JSONArray();
		for( int i = cnt-1; i > 2; i-- ){
			String item = encodings.get(i);
			data.set(data.size(), new JSONString(item));
		}
		LocalStorage.setValue("user-encodings", data.toString());
	}
	
	public void setEncoding(String newValue){
		int cnt = dataEncoding.getItemCount();
		int pos = -1;
		for( int i = 0; i<cnt; i++ ){
			String v = dataEncoding.getItemText(i);
			if( v.equals(newValue) ){
				pos = i;
				break;
			}
		}
		if( pos < 1 ){
			dataEncoding.addItem( newValue );
			dataEncoding.setSelectedIndex(cnt);
		} else {
			dataEncoding.setSelectedIndex(pos);
		}
	}
	
	
	@Override
	public void onChange(ChangeEvent event) {
		int index = dataEncoding.getSelectedIndex();
		if( index == 0 ){ //add new
			final AddEncodigDialog dialog = new AddEncodigDialog();
			dialog.center();
			dialog.show();
			dialog.addCloseHandler(new CloseHandler<PopupPanel>() {
				@Override
				public void onClose(final CloseEvent<PopupPanel> event) {
					String v = dialog.getValue();
					if( !v.equals("") ){
						dataEncoding.addItem(v);
						dataEncoding.setSelectedIndex( dataEncoding.getItemCount()-1 );
						encodings.add( v );
						store();
						RestClient.REST_PARAMS.setFormEncoding(v);
						RestClient.REST_PARAMS.store();
					} else {
						dataEncoding.setSelectedIndex(1);
					}
				}
			});
		} else {
			String v = dataEncoding.getItemText( index );
			RestClient.REST_PARAMS.setFormEncoding(v);
			RestClient.REST_PARAMS.store();
		}
	}
}
