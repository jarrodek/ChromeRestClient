package com.kalicinscy.web.restclient.client.ui;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.DisclosurePanel;
import com.google.gwt.user.client.ui.FlexTable;
import com.google.gwt.user.client.ui.HTMLTable.CellFormatter;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HasVerticalAlignment;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.kalicinscy.web.restclient.client.ConfigInit;
import com.kalicinscy.web.restclient.client.RestClient;
import com.kalicinscy.web.restclient.client.events.FormEncodingChangeEvent;
import com.kalicinscy.web.restclient.client.events.FormEncodingChangeHandler;
import com.kalicinscy.web.restclient.client.events.FormStateEventHandler;
import com.kalicinscy.web.restclient.client.events.HeadersChangedEvent;
import com.kalicinscy.web.restclient.client.events.HeadersChangedEventHandler;
import com.kalicinscy.web.restclient.client.events.MethodChangedEvent;
import com.kalicinscy.web.restclient.client.events.MethodChangedHandler;
import com.kalicinscy.web.restclient.client.events.PostDataChangedEvent;
import com.kalicinscy.web.restclient.client.events.PostDataChangedEventHandler;
import com.kalicinscy.web.restclient.client.events.UrlChangedEvent;
import com.kalicinscy.web.restclient.client.events.UrlChangedEventHandler;
import com.kalicinscy.web.restclient.client.storage.UrlRow;

public class MainForm extends Composite implements FormStateEventHandler,
		PostDataChangedEventHandler, UrlChangedEventHandler, MethodChangedHandler, FormEncodingChangeHandler,HeadersChangedEventHandler {

	private FlexTable requestTable;

	private static final int POST_DATA_ROW = 3;
	private static final int ENCODING_ROW = 4;
	private static final int BUTTONS_ROW = 5;

	private final UrlOracle urlField;

	private ActionButtons buttonsBar;

	private PostDataRow postDataRow;

	private MethodsRow methods;

	private final FormEncodingRow encodingRow;

	private final HeadersRow headersRow;

	public MainForm() {

		VerticalPanel verticalPanel = new VerticalPanel();
		initWidget(verticalPanel);
		verticalPanel.setSize("100%", "auto");

		DisclosurePanel requestPanel = new DisclosurePanel("Request");
		requestPanel.addStyleName("panels-border");
		requestPanel.setOpen(true);
		requestPanel.setAnimationEnabled(true);

		verticalPanel.add(requestPanel);
		verticalPanel.setCellWidth(requestPanel, "100%");
		requestPanel.setSize("99%", "auto");

		requestTable = new FlexTable();
		requestTable.setCellSpacing(2);
		requestPanel.setContent(requestTable);
		requestTable.setSize("99%", "auto");

		Label lblUrl = new Label("URL");
		lblUrl.addStyleName("formRowLabel");
		requestTable.setWidget(0, 0, lblUrl);

		urlField = new UrlOracle();
		urlField.setWidth("100%");
		urlField.setParentWidth("100%");
		requestTable.setWidget(0, 1, urlField);

		Label lblNewLabel = new Label("Method");
		lblNewLabel.addStyleName("formRowLabel");
		requestTable.setWidget(1, 0, lblNewLabel);

		methods = new MethodsRow();
		requestTable.setWidget(1, 1, methods);
		methods.addValueChangeHandler(new ValueChangeHandler<String>() {

			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				String method = event.getValue();
				RestClient.REST_PARAMS.setMethod(method);
				RestClient.REST_PARAMS.store();
				setOpenedTab(method);
			}
		});

		Label lblHeaders = new Label("Headers");
		lblHeaders.addStyleName("formRowLabel");
		requestTable.setWidget(2, 0, lblHeaders);
		headersRow = new HeadersRow();
		requestTable.setWidget(2, 1, headersRow);

		Label lblData = new Label("Data");
		lblData.addStyleName("formRowLabel");
		requestTable.setWidget(POST_DATA_ROW, 0, lblData);
		postDataRow = new PostDataRow();
		requestTable.setWidget(POST_DATA_ROW, 1, postDataRow);

		Label lblEncoding = new Label("Encoding");
		lblEncoding.addStyleName("formRowLabel");
		requestTable.setWidget(ENCODING_ROW, 0, lblEncoding);
		encodingRow = new FormEncodingRow();
		requestTable.setWidget(ENCODING_ROW, 1, encodingRow);

		buttonsBar = new ActionButtons();
		requestTable.setWidget(BUTTONS_ROW, 1, buttonsBar);

		buttonsBar.addFormStateHandler(this);

		CellFormatter formatter = requestTable.getCellFormatter();
		formatter.setHorizontalAlignment(2, 1,
				HasHorizontalAlignment.ALIGN_LEFT);
		formatter.setVerticalAlignment(2, 1, HasVerticalAlignment.ALIGN_TOP);
		formatter.setWidth(0, 0, "120px");

		if (!isFormRequest()) {
			requestTable.getRowFormatter().setVisible(POST_DATA_ROW, false);
			requestTable.getRowFormatter().setVisible(ENCODING_ROW, false);
		}
		// Log.debug(" end of main module");
	}

	/**
	 * Check if request is POST or PUT type.
	 * 
	 * @return true when METHOD is PUT or POST.
	 */
	private boolean isFormRequest() {
		String method = RestClient.REST_PARAMS.getMethod();
		return (method.equals("POST") || method.equals("PUT"));
	}

	/**
	 * Starts REST request.
	 */
	private void startRequest() {
		RestClient.getInstance().startRequest();
	}

	public boolean validate() {
		boolean hasErrors = false;
		String url = RestClient.REST_PARAMS.getUrl();
		if (url == null || url.equals("")) {
			urlField.addStyleName("validate-error");
			hasErrors = true;
		} else {
			urlField.removeStyleName("validate-error");
		}
		return !hasErrors;
	}

	public void restoreButtonsState() {
		buttonsBar.restoreButtonsState();
	}

	public void disableButtons() {
		buttonsBar.disableButtons();
	}

	@Override
	public void onSend() {

		if (!validate()) {
			return;
		}

		disableButtons();

		final String url = RestClient.REST_PARAMS.getUrl();
		ConfigInit.URLS_SERVICE.getUrls(url, new ListCallback<UrlRow>() {

			@Override
			public void onFailure(DataServiceException error) {
				// Log.debug( "DataServiceException", error );
			}

			@Override
			public void onSuccess(List<UrlRow> result) {
				// Log.debug( result.size()+"" );
				if (result.size() == 0) {
					ConfigInit.URLS_SERVICE.insertLink(url, new Date(),
							new RowIdListCallback() {
								@Override
								public void onFailure(DataServiceException error) {
									// Log.debug(
									// "DataServiceException insertLink",error
									// );
								}

								@Override
								public void onSuccess(List<Integer> rowIds) {
									// Log.debug( rowIds+" insertLink" );
								}
							});
				} else {
					UrlRow row = result.get(0);
					ConfigInit.URLS_SERVICE.updateTime(row.getId(), new Date(),
							new VoidCallback() {
								@Override
								public void onFailure(DataServiceException error) {
									// Log.debug(
									// "DataServiceException updateTime",error
									// );
								}

								@Override
								public void onSuccess() {
									// Log.debug( " update time " );
								}
							});
				}
			}
		});

		startRequest();
	}

	@Override
	public void onClear() {
		postDataRow.setPostData("");
		urlField.setText("");
		methods.updateMethod("GET", false);
		setOpenedTab("GET");
		encodingRow.setEncoding("application/x-www-form-urlencoded");
		headersRow.setHeaders(new LinkedHashMap<String, String>());
		RestClient.REST_PARAMS.reset();
		RestClient.REST_PARAMS.store();
	}

	@Override
	public void onDataChange(PostDataChangedEvent event) {
		postDataRow.setPostData(event.getData());
	}

	@Override
	public void onUrlChanged(UrlChangedEvent event) {
		urlField.setText(event.getUrl());
	}

	@Override
	public void onMethodChange(MethodChangedEvent event) {
		methods.updateMethod(event.getData(), false);
		setOpenedTab(event.getData());
	}

	@Override
	public void onEncodingChange(FormEncodingChangeEvent event) {
		encodingRow.setEncoding(event.getData());
	}

	@Override
	public void onHeaderChange(HeadersChangedEvent event) {
		headersRow.setHeaders(event.getHeaders());
	}
	
	public void setOpenedTab(String method){
		//
		// Hide/Show POST rows.
		//
		if (method.equals("POST") || method.equals("PUT")) {
			requestTable.getRowFormatter().setVisible(POST_DATA_ROW,true);
			requestTable.getRowFormatter().setVisible(ENCODING_ROW,true);
		} else {
			requestTable.getRowFormatter().setVisible(POST_DATA_ROW,false);
			requestTable.getRowFormatter().setVisible(ENCODING_ROW,false);
		}
	}
}
