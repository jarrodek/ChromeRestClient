package com.kalicinscy.web.restclient.client.ui;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.event.logical.shared.AttachEvent;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;

public class SaveFormStateDialog extends DialogBox {
	private TextBox nameValue;
	private Button saveButton;

	public SaveFormStateDialog() {
		setGlassEnabled(true);
		//setAutoHideOnHistoryEventsEnabled(true);
		setAnimationEnabled(true);
		setHTML("Save current REST form state");
		
		VerticalPanel verticalPanel = new VerticalPanel();
		setWidget(verticalPanel);
		verticalPanel.setSize("498px", "108px");
		
		Label lblEnterName = new Label("Enter record name");
		verticalPanel.add(lblEnterName);
		
		nameValue = new TextBox();
		nameValue.addKeyDownHandler(new KeyDownHandler() {
			public void onKeyDown(KeyDownEvent event) {
				checkButtonState();
			}
		});
		nameValue.addKeyUpHandler( new KeyUpHandler() {
			@Override
			public void onKeyUp(KeyUpEvent event) {
				checkButtonState();
			}
		});
		verticalPanel.add(nameValue);
		nameValue.setWidth("493px");
		
		HorizontalPanel horizontalPanel = new HorizontalPanel();
		verticalPanel.add(horizontalPanel);
		verticalPanel.setCellHorizontalAlignment(horizontalPanel, HasHorizontalAlignment.ALIGN_RIGHT);
		verticalPanel.setCellVerticalAlignment(horizontalPanel, HasVerticalAlignment.ALIGN_BOTTOM);
		
		saveButton = new Button("Save");
		saveButton.setEnabled(false);
		horizontalPanel.add(saveButton);
		horizontalPanel.setCellWidth(saveButton, "60");
		verticalPanel.setCellHorizontalAlignment(saveButton, HasHorizontalAlignment.ALIGN_RIGHT);
		saveButton.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				hide();
			}
		});
		
		Button btnCancel = new Button("Cancel");
		btnCancel.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				nameValue.setText("");
				hide(false);
			}
		});
		horizontalPanel.add(btnCancel);
		
		addAttachHandler( new AttachEvent.Handler() {
			@Override
			public void onAttachOrDetach(AttachEvent event) {
				Timer timeoutTimer = new Timer() {
					@Override
					public void run() {
						nameValue.setFocus(true);
					}
				};
				timeoutTimer.schedule(100);
			}
		});
	}
	
	private void checkButtonState(){
		if( nameValue.getText().trim().length() == 0 ){
			saveButton.setEnabled(false);
		} else {
			saveButton.setEnabled(true);
		}
	}
	
	public String getNameValue() {
		return nameValue.getText().trim();
	}
}
