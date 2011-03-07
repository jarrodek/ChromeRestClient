package com.kalicinscy.web.restclient.client.ui;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DisclosurePanel;
import com.google.gwt.user.client.ui.Grid;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.xhr2.client.Header;
import com.kalicinscy.web.restclient.client.ConfigInit;
import com.kalicinscy.web.restclient.client.storage.HeaderRow;
import com.kalicinscy.web.restclient.client.storage.StatusCodeRow;

public class ResponseView extends Composite {
	/**
	 * Label for response code.
	 */
	private HTML responseCodeLabel;
	/**
	 * Label for response time.
	 */
	private Label requestTimeLabel;
	/**
	 * to remove.
	 */
	private Label dummyHeaderLabel;
	/**
	 * image for status code hint.
	 */
	private Image statusCodeHint;
	/**
	 * to remove.
	 */
	private Label dummyBodyLabel;
	/**
	 * Request response code.
	 */
	private int responseCode = 0;
	/**
	 * Request response time in milliseconds.
	 */
	private long responseTime = 0;
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
	private final int gridRows = 4;
	/**
	 * Main grid default spacing.
	 */
	private final int gridSpacing = 5;
	/**
	 * Body response row number in main grid.
	 */
	private final int bodyRowNo = 3;
	private ClickHandler statusCodeHintHandler = new ClickHandler() {
		@Override
		public void onClick(ClickEvent event) {
			if (responseCode == 0) {
				StatusCodeInfo dialog = new StatusCodeInfo();
				dialog.setHTML("Status Code: " + responseCode);

				dialog.setInfoText("No response data.");
				dialog.center();
				dialog.show();
				return;
			}
			ConfigInit.STATUSES_SERVICE.getCode(responseCode,
					new ListCallback<StatusCodeRow>() {
						@Override
						public void onFailure(DataServiceException error) {
						}

						@Override
						public void onSuccess(List<StatusCodeRow> result) {
							if (result.size() == 0) {
								return;
							}
							StatusCodeRow code = result.get(0);
							StatusCodeInfo dialog = new StatusCodeInfo();
							dialog.setHTML("Status Code: " + responseCode);

							dialog.setInfoText(code.getDesc());
							dialog.center();
							dialog.show();
						}
					});
		}
	};

	public ResponseView() {
		VerticalPanel verticalPanel = new VerticalPanel();
		verticalPanel.setSize("100%", "auto");
		DisclosurePanel responsePanel = new DisclosurePanel("Response");
		
		verticalPanel.add(responsePanel);
		verticalPanel.setCellWidth(responsePanel, "100%");
		
		mainGrid = new Grid(5, gridCols);
		mainGrid.setCellSpacing(gridSpacing);
		mainGrid.setCellPadding(gridSpacing);
		responsePanel.setContent(mainGrid);
		mainGrid.setWidth("100%");
		Label lblStatusCode = new Label("Status code");
		lblStatusCode.setStyleName("response-panel-label");
		mainGrid.setWidget(0, 0, lblStatusCode);
		mainGrid.getCellFormatter().setWidth(0, 0, "100px");
		lblStatusCode.setWidth("100px");
		responseCodeLabel = new HTML("0");
		responseCodeLabel.addStyleName("status-code");
		
		statusCodeHint = new Image("img/help-3.png");
		statusCodeHint.addClickHandler(statusCodeHintHandler);
		statusCodeHint.setAltText("Show explanation");
		statusCodeHint.setStyleName("hint-image");
		
		HorizontalPanel statusPanel = new HorizontalPanel();
		statusPanel.add( responseCodeLabel );
		statusPanel.add( statusCodeHint );
		statusPanel.setCellVerticalAlignment(statusCodeHint, HasVerticalAlignment.ALIGN_MIDDLE);
		statusPanel.setCellHorizontalAlignment(statusCodeHint, HasHorizontalAlignment.ALIGN_RIGHT);
		statusPanel.setCellWidth(statusCodeHint, "50");
		
		
		mainGrid.setWidget(0, 1, statusPanel);
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

		Label lblBody = new Label("Body");
		lblBody.setStyleName("response-panel-label");
		mainGrid.setWidget(bodyRowNo, 0, lblBody);

		dummyBodyLabel = new Label("Empty");
		mainGrid.setWidget(bodyRowNo, 1, dummyBodyLabel);
		mainGrid.getCellFormatter().setVerticalAlignment(bodyRowNo, 1,
				HasVerticalAlignment.ALIGN_TOP);
		mainGrid.getCellFormatter().setVerticalAlignment(bodyRowNo, 0,
				HasVerticalAlignment.ALIGN_TOP);
		mainGrid.getCellFormatter().setHorizontalAlignment(bodyRowNo, 0,
				HasHorizontalAlignment.ALIGN_RIGHT);
		mainGrid.getCellFormatter().setVerticalAlignment(0, 0, HasVerticalAlignment.ALIGN_MIDDLE);
		
		responsePanel.setOpen(true);
		//responsePanel.addStyleName("panels-border");
		responsePanel.setAnimationEnabled(true);
		responsePanel.setSize("99%", "auto");
		
		initWidget(verticalPanel);
	}

	/**
	 * Sets response status code.
	 * 
	 * @param code
	 *            Returned status code.
	 * @param msg
	 *            Message from response.
	 */
	public final void setStatusCode(final int code, final String msg) {
		responseCode = code;
		if( code >=400 || code == 0){
			responseCodeLabel.addStyleName("error");
		}
		
		String txt = "<strong>" + code + "</strong>";

		if (msg != null && !msg.equals("")) {
			txt += " " + msg;
		} else if (code == 0) {
			txt += " NO RESPONSE";
		}

		responseCodeLabel.setHTML(txt);
	}

	/**
	 * @param respTime
	 *            the responseTime to set
	 */
	public final void setResponseTime(final long respTime) {
		this.responseTime = respTime;
		requestTimeLabel.setText(this.responseTime + " ms");
	}

	/**
	 * Sets response headers list.
	 * 
	 * @param headers
	 *            headers list
	 */
	public final void setHeaders(final Header[] headers) {
		
		dummyHeaderLabel.removeFromParent();
		if (headers == null || headers.length == 0 || responseCode == 0) {
			mainGrid.getRowFormatter().setVisible(2, false);
			return;
		}
		
		Progress progress = new Progress();
		progress.setTitle("loading...");
		mainGrid.setWidget(2, 1, progress);
		
		int cnt = headers.length;
		List<String> names = new ArrayList<String>();
		for (int i = 0; i < cnt; i++) {
			names.add(headers[i].getName());
		}
		ConfigInit.HEADERS_SERVICE.getHeaders(names,
			new ListCallback<HeaderRow>() {
				@Override
				public void onFailure(final DataServiceException error) {
					fillHeadersData(headers, null);
				}

				@Override
				public void onSuccess(final List<HeaderRow> result) {
					fillHeadersData(headers, result);
				}
			});
	}

	private void fillHeadersData(final Header[] headers,
			final List<HeaderRow> headerData) {
		VerticalPanel vp = new VerticalPanel();
		for (Header header : headers) {
			if (header == null) {
				continue;
			}
			HeaderLine line = new HeaderLine();
			String head = "";
			if (header.getName() != null) {
				head += header.getName();
			}
			if (header.getValue() != null) {
				head += ": " + header.getValue();
			}

			line.setHeaderTitle(head);

			String desc = "";
			String example = "";
			String name = "";
			if (headerData == null) {
				desc = "<i>no info</i>";
				example = "";
				name = "";
			} else {
				HeaderRow row = findHeaderData(headerData, header.getName());
				if (row == null) {
					desc = "<i>no info</i>";
					example = "";
					name = "";
				} else {
					desc = row.getDesc();
					example = row.getExample();
					name = row.getName();
				}
			}
			line.setHeaderName(name);
			line.setExample(example);
			line.setDesc(desc);
			vp.add(line);
		}
		mainGrid.setWidget(2, 1, vp);
	}

	private HeaderRow findHeaderData(List<HeaderRow> headerData,
			String headerName) {
		Iterator<HeaderRow> it = headerData.iterator();
		while (it.hasNext()) {
			HeaderRow hd = it.next();
			if (hd.getName().equals(headerName)) {
				return hd;
			}
		}
		return null;
	}
	/**
	 * Sets response body.
	 * 
	 * @param body
	 *            returned body
	 */
	public final void setResponseBody(final String body) {
		dummyBodyLabel.removeFromParent();
		if( responseCode == 0 ){
			mainGrid.getRowFormatter().setVisible(bodyRowNo, false);
			return;
		}
		
		VerticalPanel vp = new VerticalPanel();
		vp.setSize("100%", "auto");
		
		Anchor newWindow = new Anchor("Open HTML output in new window");
		newWindow.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				writeRawBody(body);
			}
		});
		vp.add(newWindow);
		TextArea bodyArea = new TextArea();
		bodyArea.setText(body);
		bodyArea.getElement().setId("bodyArea");
		bodyArea.setStylePrimaryName("response-body-area");
		vp.add(bodyArea);
		HTML lblNewLabel = new HTML("Code highlighting thanks to <a href=\"http://codemirror.net/\">Code Mirror</a>");
		vp.add(lblNewLabel);
		mainGrid.setWidget(bodyRowNo, 1, vp);
		initCodeMirror(bodyArea.getElement());
	}
	/**
	 * Init Code Mirror lib via native interface.
	 * 
	 * @param element
	 *            reference element
	 */
	public final native void initCodeMirror(
			final com.google.gwt.user.client.Element element)/*-{
		$wnd.CodeMirror.fromTextArea(element, {
		parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
		stylesheet: ["code-mirror/css/xmlcolors.css", "code-mirror/css/jscolors.css", "code-mirror/css/csscolors.css"],
		path: "code-mirror/js/",
		iframeClass: "cm-iframe",
		readOnly: true,
		height:"dynamic",
		lineNumbers:true,
		minHeight: 600
		});
	}-*/;
	
	/**
	 * Sets errorView flag.
	 * If true its not validate body response and change class names to error
	 * 
	 */
	public void setErrorView() {
		mainGrid.getRowFormatter().setVisible(bodyRowNo, false);
	}
	
	private final native void writeRawBody(String body)/*-{
		var wnd = $wnd.open();
		wnd.document.body.innerHTML = body;
	}-*/;
}
