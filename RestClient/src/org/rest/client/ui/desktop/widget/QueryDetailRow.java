package org.rest.client.ui.desktop.widget;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.Widget;

public class QueryDetailRow extends Composite {

	private static QueryDetailRowUiBinder uiBinder = GWT
			.create(QueryDetailRowUiBinder.class);

	interface QueryDetailRowUiBinder extends UiBinder<Widget, QueryDetailRow> {
	}
	
	@UiField SimplePanel keyPanel;
	@UiField SimplePanel valuePanel;
	@UiField HTMLPanel actionsPanel;
	
	public QueryDetailRow() {
		initWidget(uiBinder.createAndBindUi(this));
		
		
		
	}

}
