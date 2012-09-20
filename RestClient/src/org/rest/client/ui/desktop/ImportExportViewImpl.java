package org.rest.client.ui.desktop;

import java.util.Date;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.chrome.Extension;
import org.rest.client.chrome.Tab;
import org.rest.client.chrome.TabCallback;
import org.rest.client.chrome.Tabs;
import org.rest.client.deprecated.ImportListingDialog;
import org.rest.client.deprecated.ImportRequest;
import org.rest.client.deprecated.ImportSuggestionsCallback;
import org.rest.client.deprecated.LoaderDialog;
import org.rest.client.deprecated.SuggestionImportItem;
import org.rest.client.request.ApplicationRequest;
import org.rest.client.ui.ImportExportView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.ParagraphElement;
import com.google.gwt.dom.client.PreElement;
import com.google.gwt.dom.client.Style.Display;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.http.client.URL;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.DateTimeFormat.PredefinedFormat;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.InlineLabel;
import com.google.gwt.user.client.ui.Widget;

public class ImportExportViewImpl extends Composite implements ImportExportView {

	private static ImportExportViewImplUiBinder uiBinder = GWT
			.create(ImportExportViewImplUiBinder.class);

	interface ImportExportViewImplUiBinder extends
			UiBinder<Widget, ImportExportViewImpl> {
	}

	private Presenter listener;
	@UiField Anchor fileDownload;

	public ImportExportViewImpl() {
		initWidget(uiBinder.createAndBindUi(this));

		//
		// OLD SYSTEM SETUP
		//
		statusInfo.setText("Checking connection status...");
	}

	@Override
	public void setPresenter(Presenter listener) {
		this.listener = listener;
	}

	@UiHandler("fileExport")
	void onfileExportClick(ClickEvent e) {
		prepareFileExport();
	}
	
	@UiHandler("fileDownload")
	void onDownloadFileClick(ClickEvent e) {
		if(!fileDownload.getElement().getAttribute("disabled").isEmpty()){
			return;
		}
		fileDownload.getElement().setAttribute("disabled", "true");
		Timer t = new Timer() {
			@Override
			public void run() {
				fileDownload.setVisible(false);
				fileDownload.setHref("");
				listener.revokeDownloadData();
			}
		};
		t.schedule(1500);
	}

	void prepareFileExport() {
		listener.prepareDataToFile(new StringCallback() {
			@Override
			public void onResult(final String result) {
				
				Scheduler.get().scheduleDeferred(new Command() {
					public void execute() {
						String fileObjectUrl = listener.createDownloadData(result);
						fileDownload.setHref(fileObjectUrl);
						String date = DateTimeFormat.getFormat(PredefinedFormat.DATE_TIME_MEDIUM).format(new Date());
						String fileName = "arc-"+date+".json";
						fileDownload.getElement().setAttribute("download", fileName);
						fileDownload.getElement().setAttribute("data-downloadurl", "application/json:"+fileName+":"+fileObjectUrl);
						fileDownload.setVisible(true);
					}
				});

			}
		});
	}

	

	
	
	
	
	
	
	
	//
	// OLD SYSTEM
	//
	@UiField
	InlineLabel loggedInInfo;
	@UiField
	InlineLabel statusInfo;
	@UiField
	DivElement storeDataPanel;
	@UiField
	DivElement shareUrlPanel;
	@UiField
	ParagraphElement connectNote;
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
		statusInfo.setText("");

		//
		// OLD SYSTEM
		//
		hideConnectControls();
		showShareLink();
	}

	/**
	 * Hide controls like "connect to application"
	 */
	private void hideConnectControls() {
		loggedInInfo.setVisible(true);
		connectButton.setVisible(false);
		connectNote.getStyle().setDisplay(Display.NONE);
		storeDataPanel.getStyle().setDisplay(Display.BLOCK);
	}

	private void showShareLink() {
		String applicationUserId = listener.getApplicationUserId();
		if (applicationUserId == null)
			return;

		shareUrlPanel.getStyle().setDisplay(Display.BLOCK);
		Extension ext = Extension.getExtensionIfSupported();
		String url = "";
		if (ext == null) { // DEV mode
			url = "http://127.0.0.1:8888/RestClientApp.html?gwt.codesvr=127.0.0.1:9997";
		} else {
			url = ext.getURL("/RestClientApp.html");
		}
		url += "#ImportExportPlace:import/" + applicationUserId;
		shareLink.setInnerText(url);
	}

	@UiHandler("connectButton")
	void onConnectButton(ClickEvent e) {
		String signInUrl = ApplicationRequest.AUTH_URL + "/signin?ret=";
		Extension ext = Extension.getExtensionIfSupported();
		String returnPath = "";
		if (ext == null) { // DEV MODE
			returnPath = "http://127.0.0.1:8888/auth.html#auth";
		} else {
			returnPath = ext.getURL("/auth.html#auth");
		}
		signInUrl = signInUrl + URL.encodeQueryString(returnPath);
		Tabs tabs = Tabs.getTabsIfSupported();
		if (tabs == null) { // DEV MODE
			Window.open(signInUrl, "_blank", "");
		} else {
			tabs.create(Tabs.CreateProperties.create().setUrl(signInUrl),
					new TabCallback() {
						@Override
						public void onResult(Tab tab) {
						}
					});
		}
	}

	@Override
	public void setIsNotUserView() {
		statusInfo.setText("");
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
			StatusNotification.notify(
					"Connect to application first (not logged in)",
					StatusNotification.TYPE_ERROR,
					StatusNotification.TIME_MEDIUM);
			return;
		}
		storeData.setEnabled(false);
		restoreData.setEnabled(false);
		listener.serverStoreAction();
	}

	@UiHandler("restoreData")
	void onRestoreDataClick(ClickEvent e) {
		String applicationUserId = listener.getApplicationUserId();
		if (applicationUserId == null) {
			StatusNotification.notify(
					"Connect to application first (not logged in)",
					StatusNotification.TYPE_ERROR,
					StatusNotification.TIME_MEDIUM);
			return;
		}

		storeData.setEnabled(false);
		restoreData.setEnabled(false);
		// Show dialog
		final LoaderDialog dialog = new LoaderDialog(
				"Preparing data to download. Please wait.", false);
		dialog.show();
		// Make request
		ImportRequest.getImportSuggestions("me",
				new ImportSuggestionsCallback() {

					@Override
					public void onSuccess(List<SuggestionImportItem> result) {
						dialog.hide();
						if (result == null) {
							StatusNotification.notify(
									"Server returns empty data",
									StatusNotification.TYPE_ERROR);
							restoreData.setEnabled(true);
							return;
						}
						final ImportListingDialog importDialog = new ImportListingDialog(
								listener);
						importDialog.append(result);
						//
						// delay show dialog for data providers to refresh the
						// list
						// and show dialog in it's place (center)
						//
						new Timer() {
							@Override
							public void run() {
								importDialog.show();
							}
						}.schedule(200);
					}

					@Override
					public void onFailure(String message, Throwable exception) {
						if (RestClient.isDebug()) {
							if (exception != null) {
								Log.error(message, exception);
							} else {
								Log.error(message);
							}
						}
						StatusNotification.notify(message,
								StatusNotification.TYPE_ERROR);
						dialog.hide();
						storeData.setEnabled(true);
						restoreData.setEnabled(true);
					}
				});
	}
}
