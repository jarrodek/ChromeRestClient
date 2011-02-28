package com.kalicinscy.web.restclient.client.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class HeaderLine extends Composite {
	interface HeaderLineBinder extends UiBinder<Widget, HeaderLine> {}
	private static HeaderLineBinder uiBinder = GWT.create(HeaderLineBinder.class);
	
	@UiField
	Anchor title;
	
	@UiField 
	SpanElement desc;
	
	@UiField
	SpanElement example;
	
	@UiField
	SpanElement headerName;
	
	@UiField
	DivElement hintParent;
	
	
	public HeaderLine(){
		initWidget(uiBinder.createAndBindUi(this));
		title.setStylePrimaryName("hint-title");
	}
	
	public void setHeaderTitle(String data){
		this.title.setHTML(data );
	}
	
	public void setHeaderName( String name ){
		if( name.equals("") ){
			return;
		}
		this.headerName.setInnerHTML(name);
		this.headerName.removeClassName("hidden");
	}
	
	public void setDesc(String desc){
		this.desc.setInnerHTML( desc );
	}
	public void setExample( String ex ){
		if( ex.equals("") ){
			return;
		}
		this.example.setInnerHTML(ex);
		this.example.removeClassName("hidden");
	}
	
	
	@UiHandler("title")
	void handleClick(ClickEvent e) {
		Element parent = hintParent.getParentElement();
		String currentClass = parent.getClassName();
		if( currentClass.contains( "opened" ) ){
			parent.removeClassName( "opened" );
			hintParent.setAttribute("style", "height:0px");
		} else {
			parent.addClassName( "opened" );
			hintParent.setAttribute("style", "height:"+hintParent.getScrollHeight()+"px");
		}
	}
}
