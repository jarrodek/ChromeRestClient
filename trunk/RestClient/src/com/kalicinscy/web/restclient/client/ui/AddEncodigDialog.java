package com.kalicinscy.web.restclient.client.ui;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;

public class AddEncodigDialog extends DialogBox {
	private TextBox valueBox;

	public AddEncodigDialog() {
		setGlassEnabled(true);
		setHTML("Insert new Encoding  value");
		
		VerticalPanel verticalPanel = new VerticalPanel();
		setWidget(verticalPanel);
		verticalPanel.setSize("413px", "97px");
		
		Label lblEncoding = new Label("Encoding:");
		verticalPanel.add(lblEncoding);
		
		valueBox = new TextBox();
		verticalPanel.add(valueBox);
		valueBox.setWidth("400px");
		verticalPanel.setCellWidth(valueBox, "100%");
		
		HorizontalPanel horizontalPanel = new HorizontalPanel();
		verticalPanel.add(horizontalPanel);
		verticalPanel.setCellHorizontalAlignment(horizontalPanel, HasHorizontalAlignment.ALIGN_RIGHT);
		horizontalPanel.setWidth("");
		
		Button btnSave = new Button("Save");
		horizontalPanel.add(btnSave);
		horizontalPanel.setCellWidth(btnSave, "50");
		
		btnSave.addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				hide();
			}
		});
		
		Button btnCancel = new Button("Cancel");
		btnCancel.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				valueBox.setText("");
				hide();
			}
		});
		btnCancel.addStyleName("cancel-button-margin");
		horizontalPanel.add(btnCancel);
	}
	
	public String getValue(){
		return this.valueBox.getText();
	}
	
}
