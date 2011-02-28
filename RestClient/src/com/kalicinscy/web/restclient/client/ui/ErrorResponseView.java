package com.kalicinscy.web.restclient.client.ui;

import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Grid;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;
import com.google.gwt.user.client.ui.Label;

public class ErrorResponseView extends Composite {
	/**
	 * Vew grid.
	 */
	private final Grid mainGrid;
	/**
	 * Main Grid cols count.
	 */
	private final int gridCols = 2;
	/**
	 * Main Grid rows count.
	 */
	private final int gridRows = 3;
	/**
	 * Main grid default spacing.
	 */
	private final int gridSpacing = 5;
	private Label requestTimeLabel;
	private Label dummyHeaderLabel;
	public ErrorResponseView() {
		mainGrid = new Grid(gridRows,gridCols);
		mainGrid.setCellSpacing(gridSpacing);
		mainGrid.setCellPadding(gridSpacing);
		mainGrid.setWidth("100%");
		Label lblStatusCode = new Label("Status code");
		lblStatusCode.setStyleName("response-panel-label");
		mainGrid.setWidget(0, 0, lblStatusCode);
		mainGrid.getCellFormatter().setWidth(0, 0, "100px");
		lblStatusCode.setWidth("100px");
		Label responseCodeLabel = new Label("0");
		mainGrid.setWidget(0, 1, responseCodeLabel);
		mainGrid.getCellFormatter().setVerticalAlignment(0, 0,
				HasVerticalAlignment.ALIGN_TOP);
		mainGrid.getCellFormatter().setHorizontalAlignment(0, 0,
				HasHorizontalAlignment.ALIGN_RIGHT);
		mainGrid.getCellFormatter().setVerticalAlignment(0, 1,
				HasVerticalAlignment.ALIGN_TOP);
		
		Label lblTime = new Label("Time");
		lblTime.setStyleName("response-panel-label");
		mainGrid.setWidget(1, 0, lblTime);
		requestTimeLabel = new Label("0 s");
		mainGrid.setWidget(1, 1, requestTimeLabel);
		Label lblHeaders = new Label("Headers");
		lblHeaders.setStyleName("response-panel-label");
		mainGrid.setWidget(2, 0, lblHeaders);
		mainGrid.getCellFormatter().setHorizontalAlignment(2, 0,
				HasHorizontalAlignment.ALIGN_RIGHT);
		mainGrid.getCellFormatter().setVerticalAlignment(2, 0,
				HasVerticalAlignment.ALIGN_TOP);

		dummyHeaderLabel = new Label("No response headers...");
		mainGrid.setWidget(2, 1, dummyHeaderLabel);
		mainGrid.getCellFormatter().setVerticalAlignment(2, 1,
				HasVerticalAlignment.ALIGN_TOP);
		mainGrid.getCellFormatter().setHorizontalAlignment(1, 0,
				HasHorizontalAlignment.ALIGN_RIGHT);
		mainGrid.getCellFormatter().setVerticalAlignment(1, 0,
				HasVerticalAlignment.ALIGN_TOP);
		mainGrid.getCellFormatter().setVerticalAlignment(1, 1,
				HasVerticalAlignment.ALIGN_TOP);
		
		initWidget(mainGrid);
	}

}
