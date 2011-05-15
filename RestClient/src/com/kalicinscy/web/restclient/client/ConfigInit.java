package com.kalicinscy.web.restclient.client;

import java.util.ArrayList;
import java.util.List;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.resources.client.ResourceCallback;
import com.google.gwt.resources.client.ResourceException;
import com.google.gwt.resources.client.TextResource;
import com.google.gwt.user.client.Window;
import com.kalicinscy.web.restclient.client.resources.AppResources;
import com.kalicinscy.web.restclient.client.storage.HeaderInsertRow;
import com.kalicinscy.web.restclient.client.storage.HeadersService;
import com.kalicinscy.web.restclient.client.storage.LocalStorage;
import com.kalicinscy.web.restclient.client.storage.RestFormService;
import com.kalicinscy.web.restclient.client.storage.StatusCodesInsertRow;
import com.kalicinscy.web.restclient.client.storage.StatusCodesService;
import com.kalicinscy.web.restclient.client.storage.UrlsService;

public class ConfigInit {
	private boolean CONFIG_INITED = false;

	public static final HeadersService HEADERS_SERVICE = GWT
			.create(HeadersService.class);
	public static final StatusCodesService STATUSES_SERVICE = GWT
			.create(StatusCodesService.class);
	public static final UrlsService URLS_SERVICE = GWT
			.create(UrlsService.class);
	public static final RestFormService FORM_SERVICE = GWT
			.create(RestFormService.class);

	public ConfigInit() {
		String hl = LocalStorage.getValue("headersLoaded");
		if (hl != null) {
			CONFIG_INITED = true;
			return;
		}
	}

	public void init() {
		initTables();
	}

	private void initTables() {
		HEADERS_SERVICE.initTable(new VoidCallback() {
			@Override
			public void onFailure(DataServiceException error) {
			}

			@Override
			public void onSuccess() {
			}
		});
		STATUSES_SERVICE.initTable(new VoidCallback() {
			@Override
			public void onFailure(DataServiceException error) {
			}

			@Override
			public void onSuccess() {
			}
		});
		URLS_SERVICE.initTable(new VoidCallback() {
			@Override
			public void onFailure(DataServiceException error) {
			}

			@Override
			public void onSuccess() {
			}
		});
		FORM_SERVICE.initTable(new VoidCallback() {
			@Override
			public void onFailure(DataServiceException error) {
			}

			@Override
			public void onSuccess() {
			}
		});
	}

	public boolean isCreated() {
		return CONFIG_INITED;
	}

	public void create() {
		initTables();
		try {
			loadHeaders();
		} catch (ResourceException e) {
		}
	}

	private void loadHeaders() throws ResourceException {
		AppResources.INSTANCE.asyncStatus().getText(
				new ResourceCallback<TextResource>() {

					@Override
					public void onSuccess(TextResource resource) {
						String json = resource.getText();
						JSONValue data = JSONParser.parseLenient(json);
						final JSONObject obj = data.isObject();
						if (obj == null) {
							return;
						}

						if (obj.containsKey("requests")) {
							JSONArray array = obj.get("requests").isArray();
							if (array == null) {
								return;
							}
							parseHeadersArray(array, "request");
						}
						if (obj.containsKey("responses")) {
							JSONArray array = obj.get("responses").isArray();
							if (array == null) {
								return;
							}
							parseHeadersArray(array, "response");
						}

						if (obj.containsKey("codes")) {
							JSONArray array = obj.get("codes").isArray();
							if (array == null) {
								return;
							}
							parseCodesArray(array);
						}

						LocalStorage.setValue("headersLoaded", "true");
					}

					@Override
					public void onError(ResourceException e) {
					}
				});
	}

	/**
	 * Parse headers from resource file and insert it's content to database.
	 * 
	 * @param array
	 *            Data array from file
	 * @param headerService
	 *            Database service service
	 * @param type
	 *            request or response
	 */
	private void parseHeadersArray(JSONArray array, final String type) {
		int cnt = array.size();
		List<HeaderInsertRow> toSave = new ArrayList<HeaderInsertRow>();
		for (int i = 0; i < cnt; i++) {
			JSONObject obj = array.get(i).isObject();
			if (obj == null)
				continue;
			JSONString keyJson = obj.get("key").isString();
			JSONString descJson = obj.get("desc").isString();
			JSONString exampleJson = obj.get("example").isString();
			if (keyJson == null || descJson == null || exampleJson == null) {
				continue;
			}

			String key = keyJson.stringValue();
			String desc = descJson.stringValue();
			String example = exampleJson.stringValue();
			HeaderInsertRow row = new HeaderInsertRow();
			row.setName(key).setDesc(desc).setExample(example).setType(type);
			toSave.add(row);
		}
		if (toSave.size() > 0) {
			HEADERS_SERVICE.insertHeaders(toSave, new RowIdListCallback() {
				@Override
				public void onFailure(DataServiceException error) {
					Window.alert("error: "+error.getMessage());
				}

				@Override
				public void onSuccess(List<Integer> rowIds) {
					// Window.alert("headers "+type+" saved");
				}
			});
		}
	}

	protected void parseCodesArray(JSONArray array) {
		int cnt = array.size();
		List<StatusCodesInsertRow> toSave = new ArrayList<StatusCodesInsertRow>();
		for (int i = 0; i < cnt; i++) {
			JSONObject obj = array.get(i).isObject();
			if (obj == null)
				continue;
			JSONNumber codeJson = obj.get("key").isNumber();
			JSONString descJson = obj.get("desc").isString();
			JSONString labelJson = obj.get("label").isString();

			if (codeJson == null || descJson == null || labelJson == null) {
				continue;
			}
			Integer key = Integer.parseInt(codeJson.toString());
			String desc = descJson.stringValue();
			String label = labelJson.stringValue();
			StatusCodesInsertRow row = new StatusCodesInsertRow();
			row.setCode(key).setDesc(desc).setLabel(label);
			toSave.add(row);
		}
		if (toSave.size() > 0) {
			STATUSES_SERVICE.insertCodes(toSave, new RowIdListCallback() {
				@Override
				public void onFailure(DataServiceException error) {
					Window.alert("error: "+error.getMessage());
				}

				@Override
				public void onSuccess(List<Integer> rowIds) {
					// Window.alert("status codes saved");
				}
			});
		}
	}
}
