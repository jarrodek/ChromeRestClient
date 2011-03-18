package com.kalicinscy.web.restclient.client.ui;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;

public class RestoreFormDialog extends DialogBox {
	SimplePanel tablePanel;
	
	public RestoreFormDialog() {
		setAnimationEnabled(true);
		setGlassEnabled(true);
		setAutoHideEnabled(true);
		
		setHTML("Select saved config to restore");
		
		VerticalPanel verticalPanel = new VerticalPanel();
		setWidget(verticalPanel);
		verticalPanel.setSize("720px", "323px");
		tablePanel = new SimplePanel();
		
		verticalPanel.add(tablePanel);
		verticalPanel.setCellVerticalAlignment(tablePanel, HasVerticalAlignment.ALIGN_MIDDLE);
		verticalPanel.setCellHorizontalAlignment(tablePanel, HasHorizontalAlignment.ALIGN_CENTER);
		tablePanel.setSize("100%", "100%");
		
		
		HorizontalPanel horizontalPanel = new HorizontalPanel();
		verticalPanel.add(horizontalPanel);
		verticalPanel.setCellHeight(horizontalPanel, "30");
		horizontalPanel.setSize("100%", "30px");
		
		Button closeButton = new Button("Close");
		horizontalPanel.add(closeButton);
		horizontalPanel.setCellVerticalAlignment(closeButton, HasVerticalAlignment.ALIGN_BOTTOM);
		horizontalPanel.setCellHorizontalAlignment(closeButton, HasHorizontalAlignment.ALIGN_RIGHT);
		
		closeButton.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				hide();
			}
		});
	}

	public void addTable(RestoreTableAsync form) {
		tablePanel.clear();
		tablePanel.add(form);
	}
	
	@Override
	protected void onPreviewNativeEvent(NativePreviewEvent event) {
		int keyCode = event.getNativeEvent().getKeyCode();
		if( keyCode == 27 ){ //escape
			event.cancel();
			hide();
			return;
		}
		super.onPreviewNativeEvent(event);
	}
}
