package com.restclient.client.widgets;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.SuggestBox;
import com.google.gwt.user.client.ui.SuggestOracle;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.user.client.ui.SuggestBox.DefaultSuggestionDisplay;
import com.google.gwt.user.client.ui.SuggestOracle.Suggestion;
import com.google.gwt.xhr2.client.ProgressEvent;
import com.google.gwt.xhr2.client.Response;
import com.restclient.client.AppRequestFactory;
import com.restclient.client.RestApp;
import com.restclient.client.event.EncodingAddEvent;
import com.restclient.client.event.EncodingChangeEvent;
import com.restclient.client.event.MethodChangeEvent;
import com.restclient.client.event.RequestEndEvent;
import com.restclient.client.event.RequestStartEvent;
import com.restclient.client.event.RequestUiChangeEvent;
import com.restclient.client.event.UrlChangeEvent;
import com.restclient.client.html5.HTML5Progress;
import com.restclient.client.request.RequestParameters;
import com.restclient.client.request.ViewParameters;
import com.restclient.client.storage.UrlsSuggestOracle;
/**
 * Request controls.
 * @author jarrod
 *
 */
public class RequestWidget extends Composite implements SubpageWidget {

	interface Binder extends UiBinder<Widget, RequestWidget> {
	}

	private final EventBus eventBus;

	@UiField(provided = true) SuggestBox urlField;
	@UiField(provided = true) MethodsWidget methodsWidget;
	@UiField(provided = true) HeaderInputWidget headersWidget;
	@UiField(provided = true) BodyInputWidget bodyWidget;
	@UiField HTMLPanel requestPanel;
	@UiField DivElement requestBodyControls;
	@UiField(provided = true) ListBox contentType;
	@UiField HTML5Progress requestProgress;
	@UiField Button clearForm;
	@UiField Button sendRequest;
	@UiField HTML5Progress uploadProgress;
	@UiField DivElement sendingDiv;
	@UiField DivElement receivingDiv;
	@UiField SpanElement sizeCounter;
	@UiField HTML urlParamsSupport;

	private final List<String> encodings;
	private Date lastEnterTime;

	private DefaultSuggestionDisplay suggestionsDisplay;
	/**
	 * Whole request form.
	 * @param eventBus
	 */
	public RequestWidget(final EventBus eventBus) {
		this.eventBus = eventBus;

		UrlsSuggestOracle oracle = new UrlsSuggestOracle(RestApp.URLS_SERVICE);
		suggestionsDisplay = new DefaultSuggestionDisplay();
		suggestionsDisplay.setAnimationEnabled(true);

		urlField = new SuggestBox(oracle, new TextBox(), suggestionsDisplay);

		methodsWidget = new MethodsWidget(eventBus);
		headersWidget = new HeaderInputWidget(eventBus);
		bodyWidget = new BodyInputWidget(eventBus);

		contentType = new ListBox();
		encodings = new ArrayList<String>();
		encodings.add("Add new");
		encodings.add("application/x-www-form-urlencoded");
		encodings.add("multipart/form-data");
		restoreEncoding();
		int selectedItem = 1;
		String currentEnc = RequestParameters.getFormEncoding();
		int i = 0;
		for (String enc : encodings) {
			contentType.addItem(enc);
			if (enc.equals(currentEnc)) {
				selectedItem = i;
			}
			i++;
		}
		contentType.setSelectedIndex(selectedItem);
		contentType.getElement().setPropertyInt("position", selectedItem);

		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		sendRequest.setEnabled(false);
		
		contentType.addChangeHandler(new ChangeHandler() {
			@Override
			public void onChange(ChangeEvent event) {
				int index = contentType.getSelectedIndex();
				if (index == 0) { // add new
					AddEncodingDialog dialog = new AddEncodingDialog(eventBus);
					dialog.show();
				} else {
					String v = contentType.getItemText(index);
					RequestWidget.this.eventBus.fireEventFromSource(
							new EncodingChangeEvent(v), RequestWidget.class);
				}
			}
		});

		EncodingAddEvent.register(eventBus, new EncodingAddEvent.Handler() {
			@Override
			public void onChange(String encoding, Object source) {
				if (encoding == null) { // cancel
					int pos = contentType.getElement().getPropertyInt(
							"position");
					contentType.setSelectedIndex(pos);
				} else {
					encodings.add(encoding);
					contentType.addItem(encoding);
					int selectedItem = contentType.getItemCount() - 1;
					contentType.setSelectedIndex(selectedItem);
					contentType.getElement().setPropertyInt("position",
							selectedItem);
					
					RequestWidget.this.eventBus.fireEventFromSource(
							new EncodingChangeEvent(encoding), RequestWidget.class);
					storeEncoding();
				}
			}
		});

		MethodChangeEvent.register(eventBus, new MethodChangeEvent.Handler() {
			@Override
			public void onChange(String oldMethod, String newMethod) {
				if (oldMethod == null) {
					methodsWidget.setValue(newMethod);
					HTMLPanel.setVisible(requestBodyControls,
							isBodyRequest(newMethod));
					return;
				}
				boolean oldRequestIsBody = isBodyRequest(oldMethod);
				boolean currentIsBody = isBodyRequest(newMethod);

				if (oldRequestIsBody == currentIsBody) {
					// nothing actually changed in UI
					return;
				}
				HTMLPanel.setVisible(requestBodyControls, currentIsBody);
			}
		});

		UrlChangeEvent.register(eventBus, new UrlChangeEvent.Handler() {
			@Override
			public void onChange(String url, Object source) {
				if (url == null) {
					url = "";
				}
				if (source != null && ( source.equals(RequestParameters.class ) || source.equals(GETParamsEditorDialog.class) )) {
					RequestWidget.this.urlField.setValue(url);
				}
				if( url.trim().equals("") ){
					sendRequest.setEnabled(false);
				} else {
					sendRequest.setEnabled(true);
				}
			}
		});
		EncodingChangeEvent.register(eventBus,
				new EncodingChangeEvent.Handler() {
					@Override
					public void onChange(String enc, Object source) {
						if (source != null
								&& source.equals(RequestParameters.class)) {
							int length = encodings.size();
							for (int i = 0; i < length; i++) {
								if (encodings.get(i).equals(enc)) {
									contentType.setSelectedIndex(i);
									break;
								}
							}
						}
					}
				});

		/**
		 * Add support for "enter" key as send form method
		 */
		urlField.addKeyDownHandler(new KeyDownHandler() {

			@Override
			public void onKeyDown(KeyDownEvent event) {
				if (event.getNativeKeyCode() == KeyCodes.KEY_ENTER) {
					if (suggestionsDisplay.isSuggestionListShowing()){
						return;
					}
					if( lastEnterTime != null ){
						Date c = new Date();
						long delta = c.getTime()-lastEnterTime.getTime();
						if( delta < 1000 ){
							return;
						}
					}
					if( AppRequestFactory.isRequestInProgress() ){
						return;
					}
					
					lastEnterTime = new Date();
					suggestionCallback();
					RequestStartEvent e = new RequestStartEvent();
					RequestWidget.this.eventBus.fireEventFromSource(e,
							RequestWidget.class);
				}
			}
		});
		urlField.addSelectionHandler(new SelectionHandler<SuggestOracle.Suggestion>() {
			@Override
			public void onSelection(SelectionEvent<Suggestion> event) {
				suggestionCallback();
			}

		});

		urlField.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				if(suggestionsDisplay.isSuggestionListShowing()){
					return;
				}
				suggestionCallback();
			}
		});
		RequestUiChangeEvent.register(eventBus,
				new RequestUiChangeEvent.Handler() {
					@Override
					public void performAction(int payload, Object data) {
						double current;
						ProgressEvent progressEvent;

						switch (payload) {
						case RequestUiChangeEvent.ACTION_DISABLE_BUTTONS:
							disableButtons();
							break;
						case RequestUiChangeEvent.ACTION_ENABLE_BUTTONS:
							enableButtons();
							if (!sendingDiv.getClassName().contains("hidden")) {
								sendingDiv.addClassName("hidden");
							}
							if (!receivingDiv.getClassName().contains("hidden")) {
								receivingDiv.addClassName("hidden");
							}
							break;
						case RequestUiChangeEvent.ACTION_SET_UPLOAD_CONTROLS:
							progressEvent = (ProgressEvent) data;
							current = progressEvent.getLoaded();
							uploadProgress.setMax((int) progressEvent
									.getTotal());
							String value = roundUnits((long) current);
							sizeCounter.setInnerHTML("(" + value + ")");
							uploadProgress.setValue((int) current);
							break;
						case RequestUiChangeEvent.ACTION_SET_UPLOAD_START:
							progressEvent = (ProgressEvent) data;
							if (progressEvent.isLengthComputable()) {
								uploadProgress.setMax((int) progressEvent
										.getTotal());
							}
							sizeCounter.setInnerHTML("(0B)");
							uploadProgress.setValue(0);
							if (sendingDiv.getClassName().contains("hidden")) {
								sendingDiv.removeClassName("hidden");
							}
							break;
						case RequestUiChangeEvent.ACTION_SET_UPLOAD_END:
							if (!sendingDiv.getClassName().contains("hidden")) {
								sendingDiv.addClassName("hidden");
							}
							if (receivingDiv.getClassName().contains("hidden")) {
								receivingDiv.removeClassName("hidden");
							}
							break;
						case RequestUiChangeEvent.ACTION_SET_DOWNLOAD_CONTROLS:
							hideUpload();
							progressEvent = (ProgressEvent) data;
							if (progressEvent.isLengthComputable()) {
								uploadProgress.setMax((int) progressEvent
										.getTotal());
								//
								// ploadProgress or download??
								//
							}
							sizeCounter.setInnerHTML("(0B)");
							uploadProgress.setValue(0);
							showProgress();
							break;
						}
					}
				});
		RequestEndEvent.register(eventBus, new RequestEndEvent.Handler() {
			@Override
			public void onResponse(boolean success, Response response, long requestTime) {
				if (!receivingDiv.getClassName().contains("hidden")) {
					receivingDiv.addClassName("hidden");
				}
			}
		});

		
		urlParamsSupport.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				GETParamsEditorDialog dialog = new GETParamsEditorDialog(eventBus, urlField.getValue());
				dialog.show();
			}
		});
		
	}
	
	@Override
	public void onShow() {
		
	}

	private void suggestionCallback() {
		String url = urlField.getValue();
		if( url.trim().equals("") ){
			sendRequest.setEnabled(false);
		} else {
			sendRequest.setEnabled(true);
		}
		eventBus.fireEventFromSource(new UrlChangeEvent(url),
				RequestWidget.class);
	}

	/**
	 * Check if request method allows transport body
	 * @param requestMethod 
	 * 
	 * @return
	 */
	public static boolean isBodyRequest(String requestMethod) {
		return (requestMethod.equals("POST") || requestMethod.equals("PUT") || requestMethod
				.equals("DELETE")|| requestMethod.equals("PATCH"));
	}

	/**
	 * Restore user defined encodings from Storage and put it to main encoding
	 * list.
	 */
	private void restoreEncoding() {
		Storage storage = Storage.getLocalStorageIfSupported();
		if (storage == null) {
			if( RestApp.isDebug() ){
				Log.error("No storage found");
			}
			return;
		}
		String data = storage.getItem("user-encodings");
		if (data == null) {
			return;
		}
		JSONValue value = JSONParser.parseLenient(data);
		JSONArray obj = value.isArray();
		if (obj == null) {
			return;
		}
		if (obj != null) {
			int cnt = obj.size();
			for (int i = 0; i < cnt; i++) {
				JSONValue _tmp = obj.get(i);
				if (_tmp == null) {
					continue;
				}
				JSONString _data = _tmp.isString();
				if (_data == null) {
					continue;
				}
				String encoding = _data.stringValue();
				encodings.add(encoding);
			}

		}
	}
	/**
	 * Store user encoding list
	 * 
	 * changed to getLocalStorageIfSupported() from getSessionStorageIfSupported()
	 * 
	 */
	private void storeEncoding() {
		Storage storage = Storage.getLocalStorageIfSupported();
		if (storage == null) {
			return;
		}
		int cnt = encodings.size();
		JSONArray data = new JSONArray();
		for (int i = cnt - 1; i > 2; i--) {
			String item = encodings.get(i);
			data.set(data.size(), new JSONString(item));
		}
		storage.setItem("user-encodings", data.toString());
	}

	/**
	 * Clear form state.
	 * 
	 * @param event
	 */
	@UiHandler("clearForm")
	void onClear(ClickEvent event) {
		RequestParameters.reset();
		RequestParameters.store();
		RequestParameters.restoreFromStorage();
		ViewParameters.reset();
		ViewParameters.store();
		ViewParameters.setRestoredState(eventBus);
	}

	@UiHandler("sendRequest")
	void onSend(ClickEvent event) {
		RequestStartEvent e = new RequestStartEvent();
		eventBus.fireEventFromSource(e, RequestWidget.class);
	}

	/**
	 * Disable form buttons (clear/send)
	 */
	public void disableButtons() {
		clearForm.setEnabled(false);
		sendRequest.setEnabled(false);
	}
	/**
	 * Enable form buttons (clear/send)
	 */
	public void enableButtons() {
		clearForm.setEnabled(true);
		sendRequest.setEnabled(true);
	}
	/**
	 * Round size units into highest possible value 
	 * @param value
	 * @return
	 */
	private String roundUnits(long value /* bytes */) {
		float parse = (float) value;
		String[] units = new String[5];
		units[0] = "B";
		units[1] = "kB";
		units[2] = "MB";
		units[3] = "GB";
		units[4] = "TB";
		String result = "";
		int i = 0;
		while (true) {
			if (parse < 1024) {
				String parsed = String.valueOf(parse);
				int dotPos = parsed.indexOf(".");
				if (dotPos != -1 && dotPos + 3 < parsed.length()) {
					parsed = parsed.substring(0, dotPos + 3);
				}
				result = parsed + " " + units[i];
				break;
			}
			parse = parse / 1024;
			i++;
		}
		return result;
	}
	/**
	 * Show "upload" progress bar
	 */
	public void showUpload() {
		if (sendingDiv.getClassName().contains("hidden"))
			sendingDiv.removeClassName("hidden");
	}
	/**
	 * Hidde "upload" progress bar
	 */
	public void hideUpload() {
		if (!sendingDiv.getClassName().contains("hidden")) {
			sendingDiv.addClassName("hidden");
		}
	}
	/**
	 * Hide "download" progress bar
	 */
	public void hideProgress() {
		if (!receivingDiv.getClassName().contains("hidden"))
			receivingDiv.addClassName("hidden");
	}
	/**
	 * Show "download" progress bar
	 */
	public void showProgress() {
		if (receivingDiv.getClassName().contains("hidden"))
			receivingDiv.removeClassName("hidden");
	}
}
