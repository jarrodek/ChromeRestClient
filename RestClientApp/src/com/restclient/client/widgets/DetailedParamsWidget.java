/**
 * 
 */
package com.restclient.client.widgets;


import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.HasValue;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.restclient.client.utils.URLParser;
import com.restclient.client.utils.URLParser.QueryParam;

/**
 * @author jarrod
 *
 */
public class DetailedParamsWidget extends Composite implements HasValue<String> {

	private static DetailedParamsWidgetUiBinder uiBinder = GWT
			.create(DetailedParamsWidgetUiBinder.class);

	interface DetailedParamsWidgetUiBinder extends
			UiBinder<Widget, DetailedParamsWidget> {
	}
	
	interface WidgetStyle extends CssResource {
		String paramValueTextBoxStyle();
		String removeButton();
	}
	
	@UiField TextBox detailedHost;
	@UiField TextBox detailedPath;
	@UiField TextBox detailedHash;
	@UiField HTMLPanel queryParamsContainer;
	@UiField WidgetStyle style;
	
	private List<ParamsInputs> queryList = new ArrayList<DetailedParamsWidget.ParamsInputs>();
	
	
	/**
	 * Because this class has a default constructor, it can
	 * be used as a binder template. In other words, it can be used in other
	 * *.ui.xml files as follows:
	 * <ui:UiBinder xmlns:ui="urn:ui:com.google.gwt.uibinder"
	 *   xmlns:g="urn:import:**user's package**">
	 *  <g:**UserClassName**>Hello!</g:**UserClassName>
	 * </ui:UiBinder>
	 * Note that depending on the widget that is used, it may be necessary to
	 * implement HasHTML instead of HasText.
	 */
	public DetailedParamsWidget() {
		initWidget(uiBinder.createAndBindUi(this));
		
		detailedHost.addValueChangeHandler(anyValueChangeHandler);
		detailedPath.addValueChangeHandler(anyValueChangeHandler);
		detailedHash.addValueChangeHandler(anyValueChangeHandler);
	}


	@Override
	public HandlerRegistration addValueChangeHandler(
			ValueChangeHandler<String> handler) {
		return addHandler(handler, ValueChangeEvent.getType());
	}



	@Override
	public String getValue() {
		String url = detailedHost.getValue();
		if(url.endsWith("/")){ //trim last "/"
			url = url.substring(0, url.length()-1);
		}
		
		String path = detailedPath.getValue();
		if(!path.trim().isEmpty() && !path.startsWith("/")){
			path = "/"+path;
		}
		
		url += path;
		int paramsSize = queryList.size();
		if(paramsSize > 0){
			url += "?";
		}
		for(int i=0; i<paramsSize; i++){
			if(i>0){
				url += "&";
			}
			ParamsInputs pi = queryList.get(i);
			url += pi.key.getText() + "="+ pi.value.getText(); 
		}
		
		String hash = detailedHash.getValue();
		if(hash != null && !hash.trim().isEmpty()){
			url += "#"+hash;
		}
		
		//Log.debug(url);
		return url;
	}



	@Override
	public void setValue(String value) {
		setValue(value, false);
	}
	
	
	private ValueChangeHandler<String> anyValueChangeHandler = new ValueChangeHandler<String>() {
		@Override
		public void onValueChange(ValueChangeEvent<String> event) {
			
			//get all data and insert to main input.
			collectDataAndFireEvent();
		}
	};
	
	
	private void collectDataAndFireEvent(){
		ValueChangeEvent.fire(this, getValue());
	}
	

	@Override
	public void setValue(String value, boolean fireEvents) {
		
		//parse given path and place it to proper fields
		URLParser data = new URLParser().parse(value);
		
		String protocol = data.getProtocol();
		String authority = data.getAuthority();
		String hostField = "";
		if(!(protocol == null || authority == null || protocol.isEmpty() && authority.isEmpty())){
			if(!protocol.isEmpty()){
				hostField = data.getProtocol() + "://";
			}
			hostField += data.getAuthority();
		}
		
		detailedHost.setValue(hostField);
		detailedPath.setValue(data.getPath());
		
		queryParamsContainer.clear();
		queryList.clear();
		
		List<QueryParam> params = data.getParamsList();
		int paramsSize = params.size();
		for(int i=0; i<paramsSize; i++){
			QueryParam param = params.get(i);
			String key = param.getKey();
			if(key == null || key.trim().isEmpty()){
				continue;
			}
			addQueryParamForm(param.getKey(), param.getValue());
		}
		detailedHash.setValue(data.getAnchor());
		
	}
	private void addQueryParamForm(){addQueryParamForm(null,null);}
	
	private void addQueryParamForm(String key, String value){
		final TextBox keyBox = new TextBox();
		if(key != null){
			keyBox.setValue(key);
		}
		
		keyBox.addValueChangeHandler(anyValueChangeHandler);
		
		final TextBox valueBox = new TextBox();
		if(value != null){
			valueBox.setValue(value);
		}
		valueBox.setStyleName(style.paramValueTextBoxStyle());
		valueBox.addValueChangeHandler(anyValueChangeHandler);
		
		final ParamsInputs pi = new ParamsInputs();
		final FlowPanel panel = new FlowPanel();
		panel.add(keyBox);
		panel.add(valueBox);
		
		Button remove = new Button("x");
		remove.addStyleName(style.removeButton());
		
		panel.add(remove);
		remove.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				panel.removeFromParent();
				queryList.remove(pi);
				collectDataAndFireEvent();
			}
		});
		
		queryParamsContainer.add(panel);
		
		pi.key = keyBox;
		pi.value = valueBox;
		queryList.add(pi);
	}
	
	
	private class ParamsInputs {
		TextBox key;
		TextBox value;
	}
	@UiHandler("addDetailedParam")
	void onAddParameter(ClickEvent e){
		addQueryParamForm();
	}
}
