package org.rest.client.ui.desktop;

import java.util.Date;

import org.rest.client.StatusNotification;
import org.rest.client.analytics.GoogleAnalytics;
import org.rest.client.analytics.GoogleAnalyticsApp;
import org.rest.client.importparser.ImportResult;
import org.rest.client.request.ApplicationRequest;
import org.rest.client.request.RequestImportListItem;
import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.ui.ImportExportView;

import com.google.gwt.chrome.tabs.CreateProperties;
import com.google.gwt.chrome.tabs.Tab;
import com.google.gwt.chrome.tabs.TabCallback;
import com.google.gwt.chrome.tabs.Tabs;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.PreElement;
import com.google.gwt.dom.client.Style.Display;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.file.client.File;
import com.google.gwt.http.client.URL;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.DateTimeFormat.PredefinedFormat;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Grid;
import com.google.gwt.user.client.ui.Widget;

public class ImportExportViewImpl extends Composite implements ImportExportView {

	private static ImportExportViewImplUiBinder uiBinder = GWT.create(ImportExportViewImplUiBinder.class);

	interface ImportExportViewImplUiBinder extends UiBinder<Widget, ImportExportViewImpl> {
	}

	private Presenter listener;
	private ImportResult currentFileImport = null;

	@UiField
	Element fileDrop;
	@UiField
	DivElement fileImportSpinner;
	/**
	 * Custom element to display import data in data table.
	 */
	@UiField
	Element importDataTable;
	/**
	 * Custom element to display import data in data table for server data.
	 */
	@UiField
	Element serverImportDataTable;
	/**
	 * "Prepare data to export" button's container
	 */
	@UiField
	Element dataPrepareContainer;
	/**
	 * "Prepare data to export" button
	 */
	@UiField
	Element dataPrepareButton;
	/**
	 * Spinner container in data export
	 */
	@UiField
	Element dataDownloadSpinner;
	/**
	 * "Download file" button's container
	 */
	@UiField
	Element dataDownload2;
	/**
	 * "Download file" button
	 */
	@UiField
	Element dataDownload2Button;
	/**
	 * "Cancel" download button
	 */
	@UiField
	Element dataDownloadCancel;
	/**
	 * Block of file import section
	 */
	@UiField
	Element fileImportSection;
	/**
	 * Block of file export section
	 */
	@UiField
	Element fileExportSection;
	/**
	 * Block of file server import/export section
	 */
	@UiField
	Element serverSection;
	
	@UiField
	Element connectActionContainer;

	public ImportExportViewImpl() {
		initWidget(uiBinder.createAndBindUi(this));

		addFileEventHandler(this);
		addPreviewTableHandlers(this);
		addDownloadDataHandlers(this);
	}

	@Override
	public void setPresenter(Presenter listener) {
		this.listener = listener;
	}

	/**
	 * Prepare export data to download.
	 */
	void prepareFileExport() {
		setExportState(1);
		listener.prepareDataToFile(new StringCallback() {
			@Override
			public void onResult(final String downloadUrl) {
				setExportState(2);
				String date = DateTimeFormat.getFormat(PredefinedFormat.DATE_TIME_MEDIUM).format(new Date());
				String fileName = "arc-" + date + ".json";
				dataDownload2Button.setAttribute("download", fileName);
				dataDownload2Button.setAttribute("href", downloadUrl);
				dataDownload2Button.setAttribute("data-downloadurl",
						"application/json:" + fileName + ":" + downloadUrl);
			}
		});
	}

	@Override
	public void resetImportView() {
		if (previewGrid != null) {
			previewGrid.clear();
		}
		currentFileImport = null;
		setImportState(0);
		resetFileElement(this);
	}

	@Override
	public void resetExportView() {
		listener.revokeDownloadData();
		setExportState(0);
	}

	/**
	 * Hide / show controls depending on import state
	 * 
	 * @param state
	 *            Current state. One of:
	 *            <ul>
	 *            <li>0 - regular state - ready to import data.</li>
	 *            <li>1 - reading or parsing data</li>
	 *            <li>2 - displaying confirmation table</li>
	 *            <li>3 - importing</li>
	 *            </ul>
	 */
	private void setImportState(int state) {
		switch (state) {
		case 0:
			fileImportSpinner.addClassName("hidden");
			fileDrop.removeClassName("hidden");
			importDataTable.addClassName("hidden");
			serverSection.removeClassName("hidden");
			fileExportSection.removeClassName("hidden");
			break;
		case 1:
			fileImportSpinner.removeClassName("hidden");
			fileDrop.addClassName("hidden");
			importDataTable.addClassName("hidden");
			serverSection.addClassName("hidden");
			fileExportSection.addClassName("hidden");
			break;
		case 2:
			fileImportSpinner.addClassName("hidden");
			fileDrop.addClassName("hidden");
			importDataTable.removeClassName("hidden");
			serverSection.addClassName("hidden");
			fileExportSection.addClassName("hidden");
			break;
		case 3:
			fileImportSpinner.removeClassName("hidden");
			fileDrop.addClassName("hidden");
			importDataTable.addClassName("hidden");
			serverSection.addClassName("hidden");
			fileExportSection.addClassName("hidden");
			break;
		}
	}

	/**
	 * Hide / show controls depending on export state
	 * 
	 * @param state
	 *            Current state. One of:
	 *            <ul>
	 *            <li>0 - regular state - ready to prepare data to export</li>
	 *            <li>1 - preparing data</li>
	 *            <li>2 - displaying download link</li>
	 *            </ul>
	 */
	private void setExportState(int state) {
		switch (state) {
		case 0:
			dataPrepareContainer.removeClassName("hidden");
			dataDownload2.addClassName("hidden");
			dataDownloadSpinner.addClassName("hidden");
			break;
		case 1:
			dataPrepareContainer.addClassName("hidden");
			dataDownload2.addClassName("hidden");
			dataDownloadSpinner.removeClassName("hidden");
			break;
		case 2:
			dataPrepareContainer.addClassName("hidden");
			dataDownload2.removeClassName("hidden");
			dataDownloadSpinner.addClassName("hidden");
			break;
		}
	}

	/**
	 * Hide / show controls depending on server import/export state
	 * 
	 * @param state
	 *            Current state. One of:
	 *            <ul>
	 *            <li>0 - regular state - ready to prepare data to import/export
	 *            </li>
	 *            <li>1 - user is not logged in</li>
	 *            <li>2 - showing preview table</li>
	 *            <li>3 - loading data</li>
	 *            </ul>
	 */
	private void setServerState(int state) {
		serverSection.removeClassName("hidden");
		
		switch (state) {
		case 0:
			fileExportSection.removeClassName("hidden");
			fileImportSection.removeClassName("hidden");
			serverImportDataTable.addClassName("hidden");
			shareUrlPanel.removeClassName("hidden");
			storeDataPanel.removeClassName("hidden");
			connectActionContainer.addClassName("hidden");
			break;
		case 1:
			fileExportSection.addClassName("hidden");
			fileImportSection.addClassName("hidden");
			serverImportDataTable.addClassName("hidden");
			shareUrlPanel.addClassName("hidden");
			storeDataPanel.addClassName("hidden");
			connectActionContainer.removeClassName("hidden");
			break;
		case 2:
			fileExportSection.addClassName("hidden");
			fileImportSection.addClassName("hidden");
			serverImportDataTable.removeClassName("hidden");
			shareUrlPanel.addClassName("hidden");
			storeDataPanel.addClassName("hidden");
			connectActionContainer.addClassName("hidden");
			break;
		case 3:
			fileExportSection.addClassName("hidden");
			fileImportSection.addClassName("hidden");
			serverImportDataTable.addClassName("hidden");
			shareUrlPanel.addClassName("hidden");
			storeDataPanel.addClassName("hidden");
			connectActionContainer.addClassName("hidden");
			break;
		}
	}

	void importFromFile(File file) {
		if (file == null) {
			resetImportView();
			return;
		}
		setImportState(1);
		if (previewGrid != null) {
			previewGrid.clear();
		}
		listener.importFromFile(file);
	}

	private Grid previewGrid = null;

	@Override
	public void showImportTable(ImportResult result) {
		setImportState(2);
		JsArray<RequestObject> requests = result.getRequests();
		if (requests.length() == 0) {
			StatusNotification.notify("There is nothing to import.", StatusNotification.TIME_MEDIUM);
			setImportState(0);
			return;
		}
		JsArray<ProjectObject> projects = result.getProjects();
		setDataTable(projects, requests);
		currentFileImport = result;
	}

	private void saveFileImportData() {
		if (currentFileImport == null) {
			resetImportView();
			return;
		}
		setImportState(3);
		listener.saveImportedFileData(currentFileImport, new Callback<Boolean, Void>() {
			@Override
			public void onSuccess(Boolean result) {
				if (result != null && result) {
					resetImportView();
					StatusNotification.notify("Data saved.", StatusNotification.TIME_SHORT);
				} else {
					setImportState(2);
					StatusNotification.notify("Data save error.", StatusNotification.TIME_MEDIUM);
				}
			}

			@Override
			public void onFailure(Void reason) {
				setImportState(2);
				StatusNotification.notify("Data save error.", StatusNotification.TIME_MEDIUM);
			}
		});
	}

	@UiField
	DivElement storeDataPanel;
	@UiField
	DivElement shareUrlPanel;
	@UiField
	PreElement shareLink;

	@UiField
	Button connectButton;
	@UiField
	Button storeData;
	@UiField
	Button restoreData;

	@Override
	public void setIsUserView() {
		setServerState(0);
		updateShareLink();
	}

	
	@Override
	public void updateShareLink() {
		String applicationUserId = listener.getApplicationUserId();
		if (applicationUserId == null)
			return;

		String url = "";
		if (Window.Location.getHost().startsWith("127.")) { // DEV mode
			url = "http://127.0.0.1:8888/RestClient.html?gwt.codesvr=127.0.0.1:9997";
		} else {
			// TODO: url = Extension.getURL("/RestClient.html");
			url = "/RestClient.html";

		}
		url += "#ImportExportPlace:import/" + applicationUserId;
		shareLink.setInnerText(url);
	}

	@UiHandler("connectButton")
	void onConnectButton(ClickEvent e) {
		String signInUrl = ApplicationRequest.AUTH_URL + "/signin?ret=";

		String returnPath = "";
		if (Window.Location.getHost().startsWith("127.")) { // DEV MODE
			returnPath = "http://127.0.0.1:8888/auth.html#auth";
		} else {
			// TODO: returnPath = Runtime.getURL("/auth.html#auth");
			returnPath = "/auth.html#auth";
		}
		signInUrl = signInUrl + URL.encodeQueryString(returnPath);
		Tabs tabs = GWT.create(Tabs.class);
		CreateProperties cp = CreateProperties.create();
		cp.setUrl(signInUrl);
		tabs.create(cp, new TabCallback() {
			@Override
			public void onResult(Tab tab) {

			}
		});
	}

	@Override
	public void setIsNotUserView() {
		setServerState(1);
	}

	@Override
	public void serverControlsSetEnabled(boolean enabled) {
		storeData.setEnabled(enabled);
		restoreData.setEnabled(enabled);
	}

	@UiHandler("storeData")
	void onStoreDataClick(ClickEvent e) {
		String applicationUserId = listener.getApplicationUserId();
		if (applicationUserId == null) {
			StatusNotification.notify("Connect to application first (not logged in)", StatusNotification.TIME_MEDIUM);
			return;
		}
		storeData.setEnabled(false);
		restoreData.setEnabled(false);
		listener.serverStoreAction();
	}

	@UiHandler("restoreData")
	void onRestoreDataClick(ClickEvent e) {
		setServerState(3);
		listener.requestImportSuggestions("me");
		GoogleAnalytics.sendEvent("Settings usage", "Import data", "Import server dialog");
		GoogleAnalyticsApp.sendEvent("Settings usage", "Import data", "Import server dialog");
	}

	@Override
	protected void onDetach() {
		super.onDetach();
		nativeDetach(this);
	}

	private final native void nativeDetach(ImportExportViewImpl context) /*-{
		var listeners = context._detachListeners;
		if (!listeners) {
			return;
		}
		listeners.forEach(function(value) {
			value.element.removeEventListener(value.event, value.fn);
		});
		context._detachListeners = null;
	}-*/;

	/**
	 * Add file drop element listeners. This events must be removed on detach.
	 * 
	 * @param element
	 * @param context
	 */
	private final native void addFileEventHandler(ImportExportViewImpl context) /*-{
		var fn = $entry(function(e, detail) {
			if (e.detail && e.detail.file) {
				context.@org.rest.client.ui.desktop.ImportExportViewImpl::importFromFile(Lcom/google/gwt/file/client/File;)(e.detail.file);
			}
		});
		var elm = context.@org.rest.client.ui.desktop.ImportExportViewImpl::fileDrop;
		var listeners = context._detachListeners;
		if (!listeners) {
			listeners = new Map();
		}
		listeners.set('file-ready', {
			element : elm,
			fn : fn,
			event : 'file-ready'
		});
		context._detachListeners = listeners;
		elm.addEventListener('file-ready', fn);
	}-*/;

	/**
	 * Reset drag and drop file element to initial state
	 */
	private final native void resetFileElement(ImportExportViewImpl context) /*-{
		var elm = context.@org.rest.client.ui.desktop.ImportExportViewImpl::fileDrop;
		elm.reset();
	}-*/;

	/**
	 * Add preview table listeners. This events must be removed on detach.
	 * 
	 * @param context
	 */
	private final native void addPreviewTableHandlers(ImportExportViewImpl context) /*-{
		var table = this.@org.rest.client.ui.desktop.ImportExportViewImpl::importDataTable;
		if (!table) {
			console.error('There is no table???');
			return;
		}
		var importHandler = $entry(function(e) {
			if (e.detail && e.detail.action) {
				if (e.detail.action === 'import') {
					context.@org.rest.client.ui.desktop.ImportExportViewImpl::saveFileImportData()();
				} else if (e.detail.action === 'cancel') {
					context.@org.rest.client.ui.desktop.ImportExportViewImpl::resetImportView()();
				}
			}
		});
		var listeners = context._detachListeners;
		if (!listeners) {
			listeners = new Map();
		}
		listeners.set('import-action', {
			element : table,
			fn : importHandler,
			event : 'import-action'
		});
		context._detachListeners = listeners;
		table.addEventListener('import-action', importHandler);
	}-*/;

	/**
	 * Fill the preview data table with imported data.
	 * 
	 * @param projects
	 * @param requests
	 */
	private final native void setDataTable(JsArray<ProjectObject> projects, JsArray<RequestObject> requests) /*-{
		var table = this.@org.rest.client.ui.desktop.ImportExportViewImpl::importDataTable;
		if (!table) {
			console.error('There is no table???');
			return;
		}
		table.requests = requests;
		table.projects = projects;
	}-*/;

	private final native void addDownloadDataHandlers(ImportExportViewImpl context) /*-{
		var prepareButton = this.@org.rest.client.ui.desktop.ImportExportViewImpl::dataPrepareButton;
		var downloadButton = this.@org.rest.client.ui.desktop.ImportExportViewImpl::dataDownload2Button;
		var dataDownloadCancel = this.@org.rest.client.ui.desktop.ImportExportViewImpl::dataDownloadCancel;
		var prepare = $entry(function(e) {
			context.@org.rest.client.ui.desktop.ImportExportViewImpl::prepareFileExport()();
		});
		var download = $entry(function(e) {
			var link = document.createElement("a");
			link.download = e.target.getAttribute('download');
			link.href = e.target.getAttribute('href');
			link.dataset.downloadurl = e.target.dataset.downloadurl;
			link.click();
		});
		var cancel = $entry(function(e) {
			context.@org.rest.client.ui.desktop.ImportExportViewImpl::resetExportView()();
		});
		prepareButton.addEventListener('tap', prepare);
		downloadButton.addEventListener('tap', download);
		dataDownloadCancel.addEventListener('tap', cancel);
		var listeners = context._detachListeners;
		if (!listeners) {
			listeners = new Map();
		}
		listeners.set('prepare-button-tap', {
			element : prepareButton,
			fn : prepare,
			event : 'tap'
		});
		listeners.set('download-button-tap', {
			element : downloadButton,
			fn : download,
			event : 'tap'
		});
		listeners.set('download-cancel-tap', {
			element : dataDownloadCancel,
			fn : cancel,
			event : 'tap'
		});
		context._detachListeners = listeners;
	}-*/;

	@Override
	public void showServerImportTable(JsArray<RequestImportListItem> items) {
		if (items.length() == 0) {
			StatusNotification.notify("There is nothing to import.", StatusNotification.TIME_MEDIUM);
			setServerState(0);
			return;
		}
		setServerState(2);
		setServerImportDataTable(items);
	}
	/**
	 * Fill the preview data table with imported data.
	 * 
	 * @param projects
	 * @param requests
	 */
	private final native void setServerImportDataTable(JsArray<RequestImportListItem> requests) /*-{
		var table = this.@org.rest.client.ui.desktop.ImportExportViewImpl::serverImportDataTable;
		if (!table) {
			console.error('There is no table???');
			return;
		}
		table.requests = requests;
	}-*/;
}
